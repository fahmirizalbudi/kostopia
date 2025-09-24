package handlers

import (
	"api/configs"
	"api/constants"
	"api/database/redis"
	"database/sql"
	"fmt"
	"strconv"
	"time"

	"api/helpers"
	repo "api/repositories"
	"api/types/structs"
	req "api/types/structs/requests"
	res "api/types/structs/responses"
	"api/utils/validator"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RentalIndex(c *gin.Context) {
	cached, err := redis.GetKey("rentals:all")
	if err == nil {
		var rentals []res.RentalWithRoomAndTenantResponse
		json.Unmarshal([]byte(cached), &rentals)

		c.JSON(http.StatusOK, structs.Payload{
			Message: "Rentals retrieved successfully (from cache)",
			Error:   nil,
			Data:    rentals,
		})
		return
	}

	rentals, err := repo.GetAllRentals(configs.DB)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	jsonData, err := json.Marshal(rentals)
	if err != nil {
		panic(err)
	}
	redis.SetKey("rentals:all", string(jsonData), 60)

	c.JSON(http.StatusOK, structs.Payload{
		Message: "Rentals retrieved successfully",
		Error:   nil,
		Data:    rentals,
	})
}

func RentalStore(c *gin.Context) {
	claims, _ := c.Get("claims")
	auth := claims.(*helpers.Claims)

	var rentalRequest req.RentalRequest

	err := c.BindJSON(&rentalRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusOK, structs.Payload{
			Message: "Invalid JSON data",
			Error:   "Bad Request",
			Data:    nil,
		})
		return
	}

	v := validator.New()
	v.Required(rentalRequest.RoomID, "room_id")
	v.Required(rentalRequest.StartDate, "start_date")
	v.Required(rentalRequest.DurationMonths, "duration_months")
	if v.Errors() {
		c.AbortWithStatusJSON(http.StatusUnprocessableEntity, structs.Payload{
			Message: "Validation error",
			Error:   "Unprocessable Entity",
			Data:    v,
		})
		return
	}

	startDate, _ := time.Parse(constants.DATE_FORMAT, rentalRequest.StartDate)
	endDate := startDate.AddDate(0, *rentalRequest.DurationMonths, 0)
	endDateString := endDate.Format(constants.DATE_FORMAT)

	rentalRequest.TenantID = &auth.ID
	rentalRequest.EndDate = endDateString
	rentalRequest.Status = constants.RENTAL_STATUS_PENDING

	rental, err := repo.CreateRental(configs.DB, rentalRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	redis.DelKey("rentals:all")

	c.JSON(http.StatusOK, structs.Payload{
		Message: "Rental inserted successfully",
		Error:   nil,
		Data:    rental,
	})

}

func RentalStatus(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	status := c.Query("to")

	var err error

	switch status {
	case constants.RENTAL_STATUS_ACTIVE:
		err = repo.ChangeRentalStatus(configs.DB, id, constants.RENTAL_STATUS_ACTIVE)
	case constants.RENTAL_STATUS_FINISHED:
		err = repo.ChangeRentalStatus(configs.DB, id, constants.RENTAL_STATUS_FINISHED)
	case constants.RENTAL_STATUS_CANCELLED:
		err = repo.ChangeRentalStatus(configs.DB, id, constants.RENTAL_STATUS_CANCELLED)
	default:
		err = repo.ChangeRentalStatus(configs.DB, id, constants.RENTAL_STATUS_PENDING)
		status = constants.RENTAL_STATUS_PENDING
	}

	if err == sql.ErrNoRows {
		c.AbortWithStatusJSON(http.StatusNotFound, structs.Payload{
			Message: fmt.Sprintf("Rental with id %d not found", id),
			Error:   "Not Found",
			Data:    nil,
		})
		return
	}

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	redis.DelKey("rentals:all")

	c.JSON(http.StatusOK, structs.Payload{
		Message: fmt.Sprintf("Rental with id %d status changed to %s", id, status),
		Error:   nil,
		Data:    nil,
	})
}

func RentalAddDuration(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var body map[string]*int
	err := c.BindJSON(&body)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusOK, structs.Payload{
			Message: "Invalid JSON data",
			Error:   "Bad Request",
			Data:    nil,
		})
		return
	}

	v := validator.New()
	v.Required(body["duration_months"], "duration_months")
	if v.Errors() {
		c.AbortWithStatusJSON(http.StatusUnprocessableEntity, structs.Payload{
			Message: "Validation error",
			Error:   "Unprocessable Entity",
			Data:    v,
		})
		return
	}

	durationMonths := body["duration_months"]

	rental, err := repo.GetRentalByID(configs.DB, id)
	if err == sql.ErrNoRows {
		c.AbortWithStatusJSON(http.StatusNotFound, structs.Payload{
			Message: fmt.Sprintf("Dormitory with id %d not found", id),
			Error:   "Not Found",
			Data:    nil,
		})
		return
	}

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	endDate, _ := time.Parse(constants.TIMESTAMP_TO_DATE_FORMAT, rental.EndDate)
	newEndDate := endDate.AddDate(0, *durationMonths, 0)
	newEndDateString := newEndDate.Format(constants.DATE_FORMAT)

	oldDurationMonths := rental.DurationMonths
	newDurationMonths := oldDurationMonths + *durationMonths

	err = repo.AddRentalDuration(configs.DB, id, newDurationMonths, newEndDateString)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	redis.DelKey("rentals:all")

	c.JSON(http.StatusOK, structs.Payload{
		Message: fmt.Sprintf("Rental with id %d duration added to %s", id, newEndDateString),
		Error:   nil,
		Data:    nil,
	})
}

func RentalByAuthenticated(c *gin.Context) {
	claims, _ := c.Get("claims")
	auth := claims.(*helpers.Claims)

	rentals, err := repo.GetAuthenticatedUserRentals(configs.DB, auth)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Payload{
		Message: "Your rentals retrieved successfully",
		Error:   nil,
		Data:    rentals,
	})
}

func RentalFind(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	rental, err := repo.GetRentalByID(configs.DB, id)
	if err == sql.ErrNoRows {
		c.AbortWithStatusJSON(http.StatusNotFound, structs.Payload{
			Message: fmt.Sprintf("Rental with id %d not found", id),
			Error:   "Not Found",
			Data:    nil,
		})
		return
	}

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Payload{
		Message: fmt.Sprintf("Rental with id %d successfully found", id),
		Error:   nil,
		Data:    rental,
	})
}
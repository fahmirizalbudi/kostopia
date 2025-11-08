package handlers

import (
	"api/configs"
	repo "api/repositories"
	"api/types/structs"
	req "api/types/structs/requests"
	"api/utils/validator"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ReviewIndex(c *gin.Context) {
	reviews, err := repo.GetAllReviews(configs.DB)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Payload{
		Message: "Reviews retrieved successfully",
		Error:   nil,
		Data:    reviews,
	})
}

func ReviewDormitory(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	reviews, err := repo.GetReviewsByDormitoryID(configs.DB, id)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Payload{
		Message: fmt.Sprintf("Reviews with dormitory id %d retrieved successfully", id),
		Error:   nil,
		Data:    reviews,
	})
}

func ReviewStore(c *gin.Context) {
	var reviewRequest req.ReviewRequest

	err := c.BindJSON(&reviewRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusOK, structs.Payload{
			Message: "Invalid JSON data",
			Error:   "Bad Request",
			Data:    nil,
		})
		return
	}

	v := validator.New()
	v.Required(reviewRequest.RentalID, "rental_id")
	v.Required(reviewRequest.Rating, "rating")
	v.Required(reviewRequest.Comment, "comment")
	if v.Errors() {
		c.AbortWithStatusJSON(http.StatusUnprocessableEntity, structs.Payload{
			Message: "Validation error",
			Error:   "Unprocessable Entity",
			Data:    v,
		})
		return
	}

	err = repo.CreateReview(configs.DB, reviewRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Payload{
		Message: "Review created successfully",
		Error:   nil,
		Data:    nil,
	})
}

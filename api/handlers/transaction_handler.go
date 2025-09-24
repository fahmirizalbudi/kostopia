package handlers

import (
	"api/configs"
	"api/constants"
	"api/database/redis"
	repo "api/repositories"
	"api/types/structs"
	req "api/types/structs/requests"
	"api/utils"
	"api/utils/validator"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
)

func TransactionIndex(c *gin.Context) {
	transactions, err := repo.GetAllTransactions(configs.DB)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Payload{
		Message: "Transactions retrieved successfully",
		Error:   nil,
		Data:    transactions,
	})
}

func TransactionMidtrans(c *gin.Context) {
	var s snap.Client
	s.New(os.Getenv("MIDTRANS_SERVER_KEY"), midtrans.Sandbox)

	var transactionRequest req.TransactionRequest

	err := c.BindJSON(&transactionRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusOK, structs.Payload{
			Message: "Invalid JSON data",
			Error:   "Bad Request",
			Data:    nil,
		})
		return
	}
	
	v := validator.New()
	v.Required(transactionRequest.RentalID, "rental_id")
	v.Required(transactionRequest.MonthPaid, "month_paid")
	v.Required(transactionRequest.Method, "method")
	v.Required(transactionRequest.Purpose, "purpose")
	v.Required(transactionRequest.Status, "status")
	if v.Errors() {
		c.AbortWithStatusJSON(http.StatusUnprocessableEntity, structs.Payload{
			Message: "Validation error",
			Error:   "Unprocessable Entity",
			Data:    v,
		})
		return
	}

	redisKey := fmt.Sprintf("rental:%d:transaction", *transactionRequest.RentalID)
	cached, err := redis.GetKey(redisKey)
	if err == nil {
		var cacheSnap snap.Response
		json.Unmarshal([]byte(cached), &cacheSnap)

		c.JSON(http.StatusOK, structs.Payload{
			Message: "Midtrans snap reused from cache",
			Error:   nil,
			Data:    cacheSnap,
		})
		return
	}

	rental, err := repo.GetRentalWithRoomAndTenantByID(configs.DB, *transactionRequest.RentalID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	dormitory, err := repo.GetDormitoryByID(configs.DB, rental.Room.DormitoryID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	snapRequest := snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:   fmt.Sprintf("%s_%d", repo.GetNewTransactionID(configs.DB), time.Now().Unix()),
			GrossAmt: int64(*transactionRequest.MonthPaid) * int64(dormitory.Price),
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: rental.Tenant.Name,
			Email: rental.Tenant.Email,
			Phone: rental.Tenant.Phone,
		},
	}

	snapResponse, snapErr := s.CreateTransaction(&snapRequest)
	if snapErr != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	jsonData, err := json.Marshal(snapResponse)
	if err != nil { panic(err) }
	redis.SetKey(redisKey, string(jsonData), 15 * 60)

	c.JSON(http.StatusOK, structs.Payload{
		Message: "Midtrans snap generated successfully",
		Error:   nil,
		Data:    snapResponse,
	})
}

func TransactionStore(c *gin.Context) {
	var transactionRequest req.TransactionRequest

	err := c.BindJSON(&transactionRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusOK, structs.Payload{
			Message: "Invalid JSON data",
			Error:   "Bad Request",
			Data:    nil,
		})
		return
	}

	v := validator.New()
	v.Required(transactionRequest.RentalID, "rental_id")
	v.Required(transactionRequest.MonthPaid, "month_paid")
	v.Required(transactionRequest.Method, "method")
	v.Required(transactionRequest.Purpose, "purpose")
	v.Required(transactionRequest.Status, "status")
	if v.Errors() {
		c.AbortWithStatusJSON(http.StatusUnprocessableEntity, structs.Payload{
			Message: "Validation error",
			Error:   "Unprocessable Entity",
			Data:    v,
		})
		return
	}

	transaction, err := repo.CreateTransaction(configs.DB, transactionRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	rental, err := repo.GetRentalByID(configs.DB, transaction.RentalID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	rentalStartDate, _ := time.Parse(constants.TIMESTAMP_TO_DATE_FORMAT, rental.StartDate)
	rentalStartDateString := rentalStartDate.Format(constants.DATE_FORMAT)
	if transaction.Status == constants.TRANSACTION_STATUS_SUCCESS && utils.DateNow() == rentalStartDateString {
		repo.ChangeRentalStatus(configs.DB, rental.ID, constants.RENTAL_STATUS_ACTIVE)
	}

	c.JSON(http.StatusOK, structs.Payload{
		Message: "Transaction inserted successfully",
		Error:   nil,
		Data:    transaction,
	})
}

func TransactionAttachProof(c *gin.Context) {
	id := c.Param("id")

	_, err := repo.GetTransactionByID(configs.DB, id)
	if err == sql.ErrNoRows {
		c.AbortWithStatusJSON(http.StatusNotFound, structs.Payload{
			Message: fmt.Sprintf("Transaction with id %s not found", id),
			Error:   "Not Found",
			Data:    nil,
		})
		return
	}


	var v = validator.New()
	proof, err := c.FormFile("proof")
	if err != nil {
		v["proof"] = "The proof field is required."
	}

	if v.Errors() {
		c.AbortWithStatusJSON(http.StatusUnprocessableEntity, structs.Payload{
			Message: "Validation error",
			Error:   "Unprocessable Entity",
			Data:    v,
		})
		return
	}

	filename := utils.RandomString() + filepath.Ext(proof.Filename)
	err = c.SaveUploadedFile(proof, "./public/uploads/" + filename)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
			})
		return
	}

	url := fmt.Sprintf("http://localhost:8080/uploads/%s", filename)
	fmt.Println(url)
	err = repo.AttachProofToTransactionByID(configs.DB, id, url)

	if err == sql.ErrNoRows {
		c.AbortWithStatusJSON(http.StatusNotFound, structs.Payload{
			Message: fmt.Sprintf("Transaction with id %s not found", id),
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
		Message: "Proof attached successfully",
		Error:   nil,
		Data:    nil,
	})
}

func TransactionStatus(c *gin.Context) {
	id := c.Param("id")
	status := c.Query("to")

	var err error

	switch status {
	case constants.TRANSACTION_STATUS_SUCCESS:
		err = repo.ChangeTransactionStatus(configs.DB, id, constants.TRANSACTION_STATUS_SUCCESS)
	default:
		err = repo.ChangeTransactionStatus(configs.DB, id, constants.TRANSACTION_STATUS_PENDING)
		status = constants.TRANSACTION_STATUS_PENDING
	}

	if err == sql.ErrNoRows {
		c.AbortWithStatusJSON(http.StatusNotFound, structs.Payload{
			Message: fmt.Sprintf("Transaction with id %s not found", id),
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
		Message: fmt.Sprintf("Transaction with id %s status changed to %s", id, status),
		Error:   nil,
		Data:    nil,
	})
}

func TransactionFind(c *gin.Context) {
	id := c.Param("id")

	transaction, err := repo.GetTransactionByID(configs.DB, id)
	if err == sql.ErrNoRows {
		c.AbortWithStatusJSON(http.StatusNotFound, structs.Payload{
			Message: fmt.Sprintf("Transaction with id %s not found", id),
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
		Message: fmt.Sprintf("Transaction with id %s successfully found", id),
		Error:   nil,
		Data:    transaction,
	})
}

func TransactionCheckLastStatus(c *gin.Context) {
	rentalId, _ := strconv.Atoi(c.Param("id"))
	res, err := repo.CheckLastTransactionStatusByRentalID(configs.DB, rentalId)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Payload{
		Message: fmt.Sprintf("Transaction status with rental id %d successfully found", rentalId),
		Error:   nil,
		Data:    res,
	})
}
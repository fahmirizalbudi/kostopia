package handlers

import (
	"api/configs"
	"api/database/redis"
	repo "api/repositories"
	"api/types/structs"
	req "api/types/structs/requests"
	"database/sql"
	"encoding/json"
	"fmt"
	"strconv"

	res "api/types/structs/responses"
	"api/utils/password"
	"api/utils/validator"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UserIndex(c *gin.Context) {
	cached, err := redis.GetKey("users:all")
	if err == nil {
		var users []res.UserResponse
		json.Unmarshal([]byte(cached), &users)

		c.JSON(http.StatusOK, structs.Payload{
			Message: "Users retrieved successfully (from cache)",
			Error:   nil,
			Data:    users,
		})
		return
	}

	users, err := repo.GetAllUsers(configs.DB)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	jsonData, err := json.Marshal(users)
	if err != nil { panic(err) }
	redis.SetKey("users:all", string(jsonData), 60)

	c.JSON(http.StatusOK, structs.Payload{
		Message: "Users retrieved successfully",
		Error:   nil,
		Data:    users,
	})
}

func UserStore(c *gin.Context) {
	var userRequest req.UserRequest

	err := c.BindJSON(&userRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusOK, structs.Payload{
			Message: "Invalid JSON data",
			Error:   "Bad Request",
			Data:    nil,
		})
		return
	}

	v := validator.New()
	v.Required(userRequest.Name, "name")
	v.Required(userRequest.Email, "email")
	v.Required(userRequest.Password, "password")
	v.Required(userRequest.Role, "role")
	v.Required(userRequest.Phone, "phone")
	v.Required(userRequest.Address, "address")
	if v.Errors() {
		c.AbortWithStatusJSON(http.StatusUnprocessableEntity, structs.Payload{
			Message: "Validation error",
			Error:   "Unprocessable Entity",
			Data:    v,
		})
		return
	}

	userRequest.Password = password.Hash(userRequest.Password)

	user, err := repo.CreateUser(configs.DB, userRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	redis.DelKey("users:all")

	c.JSON(http.StatusOK, structs.Payload{
		Message: "User inserted successfully",
		Error:   nil,
		Data:    user,
	})
}

func UserFind(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	cached, err := redis.GetKey(fmt.Sprintf("user:%d", id))
	if err == nil {
		var user res.UserResponse
		json.Unmarshal([]byte(cached), &user)

		c.JSON(http.StatusOK, structs.Payload{
			Message: fmt.Sprintf("User with id %d successfully found (from cache)", id),
			Error:   nil,
			Data:    user,
		})
		return
	}

	user, err := repo.GetUserByID(configs.DB, id)
	if err == sql.ErrNoRows {
		c.AbortWithStatusJSON(http.StatusNotFound, structs.Payload{
			Message: fmt.Sprintf("User with id %d not found", id),
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

	jsonData, err := json.Marshal(user)
	if err != nil { panic(err) }
	redis.SetKey(fmt.Sprintf("user:%d", id), string(jsonData), 60)

	c.JSON(http.StatusOK, structs.Payload{
		Message: fmt.Sprintf("User with id %d successfully found", id),
		Error:   nil,
		Data:    user,
	})
}

func UserUpdate(c *gin.Context) {
	var userRequest req.UserRequest
	id, _ := strconv.Atoi(c.Param("id"))

	err := c.BindJSON(&userRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusOK, structs.Payload{
			Message: "Invalid JSON data",
			Error:   "Bad Request",
			Data:    nil,
		})
		return
	}

	v := validator.New()
	v.Required(userRequest.Name, "name")
	v.Required(userRequest.Email, "email")
	v.Required(userRequest.Role, "role")
	v.Required(userRequest.Phone, "phone")
	v.Required(userRequest.Address, "address")
	if v.Errors() {
		c.AbortWithStatusJSON(http.StatusUnprocessableEntity, structs.Payload{
			Message: "Validation error",
			Error:   "Unprocessable Entity",
			Data:    v,
		})
		return
	}

	user, err := repo.UpdateUser(configs.DB, id, userRequest)
	if err == sql.ErrNoRows {
		c.AbortWithStatusJSON(http.StatusNotFound, structs.Payload{
			Message: fmt.Sprintf("User with id %d not found", id),
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
	
	redis.DelKey("users:all")
	redis.DelKey(fmt.Sprintf("user:%d", id))

	c.JSON(http.StatusOK, structs.Payload{
		Message: fmt.Sprintf("User with id %d successfully updated", id),
		Error:   nil,
		Data:    user,
	})
}

func UserDestroy(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	err := repo.DeleteUser(configs.DB, id)
	if err == sql.ErrNoRows {
		c.AbortWithStatusJSON(http.StatusNotFound, structs.Payload{
			Message: fmt.Sprintf("User with id %d not found", id),
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

	redis.DelKey("users:all")
	redis.DelKey(fmt.Sprintf("user:%d", id))

	c.JSON(http.StatusOK, structs.Payload{
		Message: fmt.Sprintf("User with id %d successfully deleted", id),
		Error:   nil,
		Data:    nil,
	})
}

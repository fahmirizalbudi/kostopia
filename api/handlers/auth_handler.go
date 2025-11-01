package handlers

import (
	"api/configs"
	"api/constants"
	"api/database/redis"
	"api/helpers"
	repo "api/repositories"
	"api/types/structs"
	req "api/types/structs/requests"
	"api/utils/password"
	"api/utils/validator"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var userRequest req.UserRequest

	err := c.BindJSON(&userRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, structs.Payload{
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
	if v.Errors() {
		c.AbortWithStatusJSON(http.StatusUnprocessableEntity, structs.Payload{
			Message: "Validation error",
			Error:   "Unprocessable Entity",
			Data:    v,
		})
		return
	}

	userRequest.Role = constants.TENANT_ROLE
	userRequest.Password = password.Hash(userRequest.Password)

	_, err = repo.CreateUser(configs.DB, userRequest)
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
		Message: "Registered successfully",
		Error:   nil,
		Data:    nil,
	})
}

func Login(c *gin.Context) {
	var loginRequest req.LoginRequest

	err := c.BindJSON(&loginRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, structs.Payload{
			Message: "Invalid JSON data",
			Error:   "Bad Request",
			Data:    nil,
		})
		return
	}

	v := validator.New()
	v.Required(loginRequest.Email, "email")
	v.Required(loginRequest.Password, "password")
	if v.Errors() {
		c.AbortWithStatusJSON(http.StatusUnprocessableEntity, structs.Payload{
			Message: "Validation error",
			Error:   "Unprocessable Entity",
			Data:    v,
		})
		return
	}

	user, hashedPassword, err := repo.GetUserByEmail(configs.DB, loginRequest)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, structs.Payload{
			Message: "Invalid email or password",
			Error:   "Unauthorized",
			Data:    nil,
		})
		return
	}

	ok := password.Verify(loginRequest.Password, hashedPassword)
	if !ok {
		c.AbortWithStatusJSON(http.StatusUnauthorized, structs.Payload{
			Message: "Invalid email or password",
			Error:   "Unauthorized",
			Data:    nil,
		})
		return
	}

	token, err := helpers.GenerateJWT(user)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Payload{
		Message: "Logged in successfully",
		Error:   nil,
		Data:    token,
	})
}

func Me(c *gin.Context) {
	claims, _ := c.Get("claims")
	auth := claims.(*helpers.Claims)

	user, err := repo.GetUserByID(configs.DB, auth.ID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, structs.Payload{
			Message: "Internal server error",
			Error:   "Internal Server Error",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Payload{
		Message: "User profile retrieved successfully",
		Error:   nil,
		Data:    user,
	})
}

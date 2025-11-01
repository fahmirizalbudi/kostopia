package handlers

import (
	"api/configs"
	"api/repositories"
	"api/types/structs"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ReportIndex(c *gin.Context) {
	report := repositories.GetReport(configs.DB)
	c.JSON(http.StatusOK, structs.Payload{
		Message: "Report retrieved successfully",
		Error:   nil,
		Data:    report,
	})
}

package router

import (
	"api/handlers"
	"api/middlewares"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Setup() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://192.168.43.205:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.Static("/uploads", "./public/uploads")

	api := router.Group("/api")

	api.POST("/auth/register", handlers.Register)
	api.POST("/auth/login", handlers.Login)
	api.POST("/auth/me", handlers.Me)

	api.GET("/users", middlewares.AuthMiddleware, handlers.UserIndex)
	api.POST("/users", middlewares.AuthMiddleware, handlers.UserStore)
	api.GET("/users/:id", middlewares.AuthMiddleware, handlers.UserFind)
	api.PUT("/users/:id", middlewares.AuthMiddleware, handlers.UserUpdate)
	api.DELETE("/users/:id", middlewares.AuthMiddleware, handlers.UserDestroy)

	api.GET("/dormitories", handlers.DormitoryIndex)
	api.POST("/dormitories", middlewares.AuthMiddleware, handlers.DormitoryStore)
	api.GET("/dormitories/:id", handlers.DormitoryFind)
	api.PUT("/dormitories/:id", middlewares.AuthMiddleware, handlers.DormitoryUpdate)
	api.DELETE("/dormitories/:id", middlewares.AuthMiddleware, handlers.DormitoryDestroy)

	api.GET("/dormitories/previews", handlers.DormitoryAttachPreviews)
	api.GET("/dormitories/:id/previews", handlers.DormitoryPreviewIndex)

	api.POST("/dormitory-previews", middlewares.AuthMiddleware, handlers.DormitoryPreviewStore)
	api.DELETE("/dormitory-previews/:id", middlewares.AuthMiddleware, handlers.DormitoryPreviewDestroy)

	api.GET("/dormitories/:id/rooms", handlers.RoomByDormitory)

	api.GET("/rooms", middlewares.AuthMiddleware, handlers.RoomIndex)
	api.POST("/rooms", middlewares.AuthMiddleware, handlers.RoomStore)
	api.GET("/rooms/:id", middlewares.AuthMiddleware, handlers.RoomFind)
	api.PUT("/rooms/:id", middlewares.AuthMiddleware, handlers.RoomUpdate)
	api.DELETE("/rooms/:id", middlewares.AuthMiddleware, handlers.RoomDestroy)

	api.GET("/rentals", handlers.RentalIndex)
	api.POST("/rentals", middlewares.AuthMiddleware, handlers.RentalStore)
	api.PATCH("/rentals/:id/status", middlewares.AuthMiddleware, handlers.RentalStatus)
	api.PATCH("/rentals/:id/duration", middlewares.AuthMiddleware, handlers.RentalAddDuration)
	api.GET("/rentals/me", middlewares.AuthMiddleware, handlers.RentalByAuthenticated)
	api.GET("/rentals/:id", handlers.RentalFind)

	api.GET("/transactions", handlers.TransactionIndex)
	api.POST("/transactions/midtrans", handlers.TransactionMidtrans)
	api.GET("/transactions/midtrans/:id/cache", handlers.TransactionMidtransCache)
	api.POST("/transactions", handlers.TransactionStore)
	api.POST("/transactions/:id/proof", handlers.TransactionAttachProof)
	api.PATCH("/transactions/:id/status", handlers.TransactionStatus)
	api.GET("/transactions/:id", handlers.TransactionFind)
	api.GET("/transactions/rental/:id/status", handlers.TransactionCheckLastStatus)
	api.GET("/transactions/:id/receipt", handlers.TransactionReceipt)
	api.GET("/transactions/me", middlewares.AuthMiddleware, handlers.TransactionByAuthenticated)

	api.GET("/reviews", handlers.ReviewIndex)
	api.GET("/reviews/:id/dormitory", handlers.ReviewDormitory)
	api.POST("/reviews", handlers.ReviewStore)

	api.GET("/report", handlers.ReportIndex)

	return router
}

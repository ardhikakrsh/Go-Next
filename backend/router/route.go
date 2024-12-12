package router

import (
	"leave-manager/handler"
	"leave-manager/middleware"
	"leave-manager/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Init(r *gin.Engine, db *gorm.DB) {
	setAuthRoute(r, db)

	protectedRoutes := r.Group("/")
	protectedRoutes.Use(middleware.VerifyLogin)
	{
		protectedRoutes.GET("/", func(c *gin.Context) {
			c.String(200, "Hello, World!")
		})
		setLeaveRoute(protectedRoutes, db)
		setUserRoute(protectedRoutes, db)
	}
}

func setLeaveRoute(r *gin.RouterGroup, db *gorm.DB) {
	leaveHandler := handler.NewLeaveHandler(service.NewLeaveService(db))
	r.POST("/leaves", leaveHandler.AddLeave)
	r.GET("/leaves/me", leaveHandler.GetUserLeaves)
	r.PUT("/leaves/:id", leaveHandler.EditLeave)
	r.DELETE("/leaves/:id", leaveHandler.DeleteLeave)

	adminGroup := r.Group("/leaves")
	adminGroup.Use(middleware.RoleRequired("admin"))
	{
		adminGroup.GET("/", leaveHandler.GetLeaves)
		adminGroup.PUT("/accept/:id", leaveHandler.ApproveLeave)
		adminGroup.PUT("/reject/:id", leaveHandler.RejectLeave)
	}
}

func setUserRoute(r *gin.RouterGroup, db *gorm.DB) {
	userHandler := handler.NewUserHandler(service.NewUserService(db))

	r.GET("/users/me", userHandler.GetMe)

	adminGroup := r.Group("/users")
	adminGroup.Use(middleware.RoleRequired("admin"))
	{
		adminGroup.GET("/", userHandler.GetUsers)
		adminGroup.POST("/", userHandler.AddUser)
		adminGroup.PUT("/:id", userHandler.EditUser)
		adminGroup.DELETE("/:id", userHandler.DeleteUser)
	}
}

func setAuthRoute(r *gin.Engine, db *gorm.DB) {
	authHandler := handler.NewAuthHandler(service.NewAuthService(db))

	r.POST("/auth/register", authHandler.Signup)
	r.POST("/auth/login", authHandler.Login)
	r.POST("/auth/logout", authHandler.Logout)
}

package router

import (
	"leave-manager/handler"
	"leave-manager/service"

	"leave-manager/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Init(r *gin.Engine, db *gorm.DB) {
	r.Use(middleware.VerifyLogin)
	r.GET("/", func(c *gin.Context) {
		c.String(200, "Hello, World!")
	})
	setLeaveRoute(r, db)
}

func setLeaveRoute(r *gin.Engine, db *gorm.DB) {
	leaveHandler := handler.NewLeaveHandler(service.NewLeaveService(db))
	r.GET("/leaves", leaveHandler.GetLeaves)
	r.POST("/leaves", leaveHandler.AddLeave)
	r.GET("/leaves/me", leaveHandler.GetUserLeaves)

	adminGroup := r.Group("/leaves")
	adminGroup.Use(middleware.RoleRequired("admin"))
	{
		adminGroup.PUT("/accept/:id", leaveHandler.ApproveLeave)
		adminGroup.PUT("/reject/:id", leaveHandler.RejectLeave)
	}
}

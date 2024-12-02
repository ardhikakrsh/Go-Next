package router

import (
	"leave-manager/handler"
	"leave-manager/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Init(r *gin.Engine, db *gorm.DB) {
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
	r.PUT("/leaves/accept/:id", leaveHandler.ApproveLeave)
	r.PUT("/leaves/reject/:id", leaveHandler.RejectLeave)
	// Uncomment when needed
	// r.PUT("/leaves/:id", leaveHandler.UpdateLeave)
	// r.DELETE("/leaves/:id", leaveHandler.DeleteLeave)
}

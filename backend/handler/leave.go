package handler

import (
	"leave-manager/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type leaveHandler struct {
	leaveService service.LeaveService
}

func NewLeaveHandler(leaveService service.LeaveService) *leaveHandler {
	return &leaveHandler{
		leaveService: leaveService,
	}
}

func (h *leaveHandler) AddLeave(c *gin.Context) {
	var req service.AddLeaveRequest
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "User ID not found in context"})
		return
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := h.leaveService.AddLeave(req, userId.(uint))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *leaveHandler) GetUserLeaves(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "User ID not found in context"})
		return
	}

	leaves, err := h.leaveService.GetLeavesByUser(userId.(uint))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, leaves)
}

func (h *leaveHandler) GetLeaves(c *gin.Context) {
	leaves, err := h.leaveService.GetLeaves()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, leaves)
}

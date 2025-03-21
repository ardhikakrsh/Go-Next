package handler

import (
	"leave-manager/service"
	"net/http"
	"strconv"

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
	userId, exists := c.Get("userID")
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
	userId, exists := c.Get("userID")
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

func (h *leaveHandler) ApproveLeave(c *gin.Context) {
	leaveId := c.Param("id")
	id, err := strconv.ParseUint(leaveId, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid leave ID"})
		return
	}
	err = h.leaveService.ApproveLeave(uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Leave approved"})
}

func (h *leaveHandler) RejectLeave(c *gin.Context) {
	leaveId := c.Param("id")
	id, err := strconv.ParseUint(leaveId, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid leave ID"})
		return
	}
	err = h.leaveService.RejectLeave(uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Leave rejected"})
}

func (h *leaveHandler) EditLeave(c *gin.Context) {
	var req service.EditLeaveRequest
	leaveId := c.Param("id")
	id, err := strconv.ParseUint(leaveId, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid leave ID"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "User ID not found in context"})
		return
	}

	roles, exists := c.Get("roles")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "Roles not found in context"})
		return
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	leaveIdUint := uint(id)

	res, err := h.leaveService.EditLeave(userID.(uint), leaveIdUint, roles.(string), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *leaveHandler) DeleteLeave(c *gin.Context) {
	leaveId := c.Param("id")
	id, err := strconv.ParseUint(leaveId, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid leave ID"})
		return
	}

	userId, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "User ID not found in context"})
		return
	}

	roles, exists := c.Get("roles")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"Error": "Roles not found in context"})
		return
	}

	err = h.leaveService.DeleteLeave(uint(id), userId.(uint), roles.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Leave deleted"})
}

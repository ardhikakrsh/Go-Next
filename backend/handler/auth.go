package handler

import (
	"leave-manager/service"

	"github.com/gin-gonic/gin"
)

type authHandler struct {
	service service.AuthService
}

func NewAuthHandler(service service.AuthService) *authHandler {
	return &authHandler{
		service: service,
	}
}

func (h *authHandler) Signup(c *gin.Context) {
	var req service.NewSignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	res, err := h.service.Signup(req)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, res)
}

func (h *authHandler) Login(c *gin.Context) {
	var req service.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	res, err := h.service.Login(req)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Set access token in cookies
	c.SetCookie("access_token", res.Token, 600, "/", "", false, true)
	c.JSON(200, res)
}

func (h *authHandler) Logout(c *gin.Context) {
	// Clear the access token cookie
	c.SetCookie("access_token", "", -1, "/", "", false, true)
	c.String(200, "Logged out successfully")
}
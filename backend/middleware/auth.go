package middleware

import (
	"leave-manager/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

// VerifyLogin checks if the access token is valid.
func VerifyLogin(c *gin.Context) {
	// Retrieve the access token from cookies
	cookie, err := c.Cookie("access_token")
	if err != nil || cookie == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		c.Abort()
		return
	}

	// Initialize JWT service and verify the token
	jwtService := service.NewJwtService()
	decodedToken, err := jwtService.VerifyToken(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		c.Abort()
		return
	}

	// Extract user details (ID, username, role) from the token
	userId, username, role, err := jwtService.ExtractAccessToken(decodedToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		c.Abort()
		return
	}

	// Set user information in context for downstream handlers
	c.Set("userId", userId)
	c.Set("username", username)
	c.Set("roles", role)

	c.Next()
}

// RoleRequired is a middleware that checks if the user has the required role.
func RoleRequired(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Retrieve the access token from cookies
		tokenString, err := c.Cookie("access_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}

		// Initialize JWT service and verify the token
		jwtService := service.NewJwtService()
		decodedToken, err := jwtService.VerifyToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		// Extract user details (ID, username, role) from the token
		userID, username, userRole, err := jwtService.ExtractAccessToken(decodedToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}

		// Check if the user's role matches the required role
		if userRole != role {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			c.Abort()
			return
		}

		// Store user information in context for downstream handlers
		c.Set("userID", userID)
		c.Set("username", username)
		c.Set("role", userRole)

		c.Next()
	}
}

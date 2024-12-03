package middleware

import (
	"leave-manager/helper"
	"net/http"

	"github.com/gin-gonic/gin"
)

func VerifyLogin(c *gin.Context) {
	cookie, err := c.Cookie("access_token")
	if err != nil || cookie == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		c.Abort()
		return
	}

	userID, roles, err := helper.ExtractToken(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		c.Abort()
		return
	}

	c.Set("userID", userID)
	c.Set("roles", roles)

	c.Next()
}

func RoleRequired(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("access_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}

		userID, userRole, err := helper.ExtractToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		if userRole != requiredRole {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			c.Abort()
			return
		}

		c.Set("userID", userID)
		c.Set("roles", userRole)

		c.Next()
	}
}

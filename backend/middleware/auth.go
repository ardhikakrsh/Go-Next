package middleware

import (
	"fmt"
	"leave-manager/helper"
	"net/http"

	"github.com/gin-gonic/gin"
)

func VerifyLogin(c *gin.Context) {
	cookie, err := c.Cookie("access_token")
	fmt.Println("Cookie:", cookie)
	if err != nil || cookie == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		c.Abort()
		return
	}

	userID, roles, err := helper.ExtractToken(cookie)
	if err != nil {
		fmt.Println("Error extracting token:", err)
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

		fmt.Println("Extracted userRole:", userRole)
		fmt.Println("Extracted userID:", userID)

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

func RedirectByRole(c *gin.Context) {
	roles, exists := c.Get("roles")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		c.Abort()
		return
	}

	role, ok := roles.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid role type"})
		c.Abort()
		return
	}

	switch role {
	case "admin":
		c.Redirect(http.StatusMovedPermanently, "/admin")
	case "user":
		c.Redirect(http.StatusMovedPermanently, "/user")
	default:
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		c.Abort()
	}
}

	

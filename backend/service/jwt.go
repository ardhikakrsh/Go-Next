package service

import (
	"errors"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type JwtService interface {
	GenerateToken(payload interface{}, expiresIn uint) (string, error)
	VerifyToken(tokenString string) (*jwt.Token, error)
	// GenerateTokenBySession(session *model.Session, expiresIn uint) (string, error)
	ExtractAccessToken(decodedAccessToken *jwt.Token) (uint, string, string, error)
	// ExtractRefreshToken(decodedRefreshToken *jwt.Token) (uint, error)
}

type jwtService struct {
	secretKey string
}

func NewJwtService() JwtService {
	return &jwtService{
		secretKey: "very-secret",
	}
}

func (service *jwtService) GenerateToken(payload interface{}, expiresIn uint) (string, error) {
	claims := jwt.MapClaims{
		"user": payload,
		"exp":  time.Now().Add((time.Second * time.Duration(expiresIn))).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(service.secretKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (service *jwtService) ExtractAccessToken(decodedAccessToken *jwt.Token) (uint, string, string, error) {
	// Extract the payload from the token
	payload, ok := decodedAccessToken.Claims.(jwt.MapClaims)
	if !ok {
		return 0, "", "", errors.New("invalid token claims")
	}
	// Extract the user ID and username from the payload
	userPayload, ok := payload["user"].(map[string]interface{})
	if !ok {
		return 0, "", "", errors.New("invalid user payload in token")
	}

	userIDFloat, ok := userPayload["user_id"].(float64)
	if !ok {
		return 0, "", "", errors.New("invalid user ID in token")
	}

	username, ok := userPayload["username"].(string)
	if !ok {
		return 0, "", "", errors.New("invalid username in token")
	}

	// Extract role from token
	roles, ok := userPayload["roles"].(string)
	if !ok {
		return 0, "", "", errors.New("invalid role in token")
	}

	userID := uint(userIDFloat)
	return userID, username, roles, nil
}

func (service *jwtService) VerifyToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if token.Method != jwt.SigningMethodHS256 {
			return nil, fmt.Errorf("invalid signing method")
		}
		return []byte(service.secretKey), nil
	})

	if err != nil {
		return nil, err
	}
	return token, nil
}

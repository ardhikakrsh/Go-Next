package service

import (
	"errors"
	"leave-manager/model"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type authService struct {
	db         *gorm.DB
	jwtService JwtService
}

func NewAuthService(db *gorm.DB) AuthService {
	return &authService{
		db:         db,
		jwtService: NewJwtService(),
	}
}

func (s *authService) Signup(req NewSignupRequest) (*NewSignupResponse, error) {
	user := model.User{}
	s.db.First(&user, "username = ?", req.Username)
	if user.Username != "" {
		return nil, errors.New("username already exists")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	newUser := model.User{
		Username:  req.Username,
		Password:  string(hash),
		FirstName: req.FirstName,
		LastName:  req.LastName,
	}

	s.db.Create(&newUser)
	return &NewSignupResponse{
		ID:        newUser.ID,
		Username:  newUser.Username,
		FirstName: newUser.FirstName,
		LastName:  newUser.LastName,
	}, nil
}

func (s authService) Login(req LoginRequest) (*LoginResponse, error) {
	user := model.User{}
	s.db.Preload("Leaves").First(&user, "username = ?", req.Username)
	if user.Username == "" {
		return nil, errors.New("username does not exist")
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("wrong password")
	}
	accessTokenInfo := AccessTokenInfo{
		UserId:   user.ID,
		Username: user.Username,
	}
	accessToken, err := s.jwtService.GenerateToken(accessTokenInfo, 3600000)
	if err != nil {
		return nil, err
	}
	countSick := 0
	countBusiness := 0
	countVacation := 0
	LeaveResponses := []LeaveResponse{}
	for _, leave := range user.Leaves {
		if leave.Type == "ลาป่วย" {
			countSick += 1
		} else if leave.Type == "ลากิจ" {
			countBusiness += 1
		} else if leave.Type == "ลาพักร้อน" {
			countVacation += 1
		}
		LeaveResponses = append(LeaveResponses, LeaveResponse{
			ID:        leave.ID,
			Type:      leave.Type,
			Detail:    leave.Detail,
			TimeStart: leave.TimeStart.Format("2006-01-02"),
			TimeEnd:   leave.TimeEnd.Format("2006-01-02"),
			CreatedAt: leave.CreatedAt.Format("2006-01-02 15:04:05"),
			UpdatedAt: leave.UpdatedAt.Format("2006-01-02 15:04:05"),
		})
	}
	return &LoginResponse{
		Username:  user.Username,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		LeaveResponsesWithCount: LeaveResponseWithCount{
			LeaveResponse: LeaveResponses,
			CountSick:     uint(countSick),
			CountBusiness: uint(countBusiness),
			CountVacation: uint(countVacation),
		},
		Token: accessToken,
	}, nil
}

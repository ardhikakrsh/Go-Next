package service

import (
	"errors"
	"fmt"

	"leave-manager/model"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type userService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) UserService {
	db.AutoMigrate(&model.User{})
	return &userService{
		db: db,
	}
}

func (s userService) GetUsers() ([]GetUserResponse, error) {
	var users []model.User
	s.db.Preload("Leaves").Find(&users)
	var res []GetUserResponse
	for _, user := range users {
		res = append(res, GetUserResponse{
			ID:        user.ID,
			Username:  user.Username,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Leaves:    user.Leaves,
			Roles:     user.Roles,
		})
	}
	fmt.Println(res)
	return res, nil
}

func (s *userService) GetUserById(userId uint) (*GetUserResponse, error) {
	var user model.User
	if err := s.db.Preload("Leaves").First(&user, userId).Error; err != nil {
		fmt.Printf("Error finding user record: %v\n", err)
		return nil, fmt.Errorf("user not found: %v", err)
	}

	return &GetUserResponse{
		ID:        user.ID,
		Username:  user.Username,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Leaves:    user.Leaves,
		Roles:     user.Roles,
	}, nil
}

func (s *userService) AddUser(req AddUserRequest) (*GetUserResponse, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("Error hashing password: %v\n", err)
		return nil, err
	}

	user := model.User{
		Username:  req.Username,
		Password:  string(hash),
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Roles:     req.Roles,
	}
	if err := s.db.Create(&user).Error; err != nil {
		fmt.Printf("Error creating user record: %v\n", err)
		return nil, err
	}
	return &GetUserResponse{
		ID:        user.ID,
		Username:  user.Username,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Roles:     user.Roles,
	}, nil
}

func (s *userService) EditUser(req AddUserRequest, userId uint) (*GetUserResponseSimple, error) {
	var user model.User
	if err := s.db.First(&user, userId).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("user with id %d not found", userId)
		}
		fmt.Printf("Error finding user record: %v\n", err)
		return nil, err
	}

	user.Username = req.Username
	user.FirstName = req.FirstName
	user.LastName = req.LastName
	user.Roles = req.Roles

	if err := s.db.Save(&user).Error; err != nil {
		fmt.Printf("Error saving user record: %v\n", err)
		return nil, err
	}

	return &GetUserResponseSimple{
		ID:        user.ID,
		Username:  user.Username,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Roles:     user.Roles,
	}, nil
}

func (s *userService) DeleteUser(userId uint) error {
	var user model.User
	if err := s.db.First(&user, userId).Error; err != nil {
		fmt.Printf("Error finding user record: %v\n", err)
		return err
	}
	if err := s.db.Delete(&user).Error; err != nil {
		fmt.Printf("Error deleting user record: %v\n", err)
		return err
	}
	return nil
}

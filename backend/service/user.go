package service

import "leave-manager/model"

type UserService interface {
	GetUsers() ([]GetUserResponse, error)
	GetUserById(userId uint) (*GetUserResponse, error)
	AddUser(req AddUserRequest) (*GetUserResponse, error)
	EditUser(req AddUserRequest, userId uint) (*GetUserResponseSimple, error)
	DeleteUser(userId uint) error
}

type GetUserResponse struct {
	ID        uint          `json:"id"`
	Username  string        `json:"username"`
	FirstName string        `json:"first_name"`
	LastName  string        `json:"last_name"`
	Roles     string        `json:"roles"`
	Leaves    []model.Leave `json:"leaves"`
}

type GetUserResponseSimple struct {
	ID        uint   `json:"id"`
	Username  string `json:"username"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Roles     string `json:"roles"`
}

type AddUserRequest struct {
	Username  string `json:"username"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Roles     string `json:"roles"`
}

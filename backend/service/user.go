package service

import "leave-manager/model"

type UserService interface {
	GetUsers() ([]GetUserResponse, error)
}

type GetUserResponse struct {
	ID        uint               `json:"id"`
	Username  string             `json:"username"`
	FirstName string             `json:"first_name"`
	LastName  string             `json:"last_name"`
	Leaves    []model.Leave `json:"leaves"`
	Roles	 string 		   `json:"roles"`
}

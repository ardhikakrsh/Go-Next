package model

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID        uint    `gorm:"primaryKey" json:"id"`
	Username  string  `gorm:"unique" json:"username"`
	Password  string  `json:"-"`
	FirstName string  `json:"firstName"`
	LastName  string  `json:"lastName"`
	Role      string  `json:"role"`
	Leaves    []Leave `gorm:"foreignKey:UserID" json:"leaves"`
}

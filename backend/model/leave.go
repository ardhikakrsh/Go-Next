package model

import (
	"time"

	"gorm.io/gorm"
)

type Leave struct {
	gorm.Model
	TimeStart time.Time `json:"timeStart"`
	TimeEnd   time.Time `json:"timeEnd"`
	Type      string    `json:"type"`
	Status    string    `json:"status" gorm:"default:requested"` // default abis nambahin itu requested
	Detail    string    `json:"detail"`
	UserID    uint      `json:"userId"`
	LeaveDay  uint      `json:"leaveDay"`
}

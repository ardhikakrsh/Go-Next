package service

import (
	"fmt"
	"leave-manager/model"
	"time"

	"gorm.io/gorm"
)

type leaveService struct {
	db *gorm.DB
}

func NewLeaveService(db *gorm.DB) LeaveService {
	db.AutoMigrate(&model.Leave{})
	return &leaveService{
		db: db,
	}
}

func (s *leaveService) AddLeave(req AddLeaveRequest, userId uint) (*LeaveResponse, error) {
	timeStartDate, err := time.Parse(time.RFC3339, req.TimeStart)
	if err != nil {
		fmt.Printf("Error parsing start date: %v\n", err)
		return nil, err
	}
	timeEndDate, err := time.Parse(time.RFC3339, req.TimeEnd)
	if err != nil {
		fmt.Printf("Error parsing end date: %v\n", err)
		return nil, err
	}
	fmt.Printf("Parsed end date: %v\n", timeEndDate)

	leave := model.Leave{
		TimeStart: timeStartDate,
		TimeEnd:   timeEndDate,
		Type:      req.Type,
		Detail:    req.Detail,
		UserID:    userId,
		LeaveDay:  uint(timeEndDate.Sub(timeStartDate).Hours() / 24),
		Status:    "requested",
	}

	if err := s.db.Create(&leave).Error; err != nil {
		fmt.Printf("Error creating leave record: %v\n", err)
		return nil, err
	}
	return &LeaveResponse{
		ID:        leave.ID,
		Type:      leave.Type,
		Detail:    leave.Detail,
		TimeStart: leave.TimeStart.Format(time.RFC3339),
		TimeEnd:   leave.TimeEnd.Format(time.RFC3339),
		CreatedAt: leave.CreatedAt.Format(time.RFC3339),
		UpdatedAt: leave.UpdatedAt.Format(time.RFC3339),
		LeaveDay:  leave.LeaveDay,
		Status:    leave.Status,
	}, nil
}

func (s *leaveService) GetLeavesByUser(userId uint) (*LeaveResponseWithCount, error) {
	var leaves []model.Leave
	if err := s.db.Where("user_id = ?", userId).Find(&leaves).Error; err != nil {
		fmt.Printf("Error getting leaves by user %d: %v\n", userId, err)
		return nil, err
	}

	countSick := 0
	countBusiness := 0
	countVacation := 0

	for _, leave := range leaves {
		switch leave.Type {
		case "sick":
			countSick++
		case "business":
			countBusiness++
		case "vacation":
			countVacation++
		}
	}

	var res []LeaveResponse
	for _, leave := range leaves {
		res = append(res, LeaveResponse{
			ID:        leave.ID,
			Type:      leave.Type,
			Detail:    leave.Detail,
			TimeStart: leave.TimeStart.Format(time.RFC3339),
			TimeEnd:   leave.TimeEnd.Format(time.RFC3339),
			CreatedAt: leave.CreatedAt.Format(time.RFC3339),
			UpdatedAt: leave.UpdatedAt.Format(time.RFC3339),
			LeaveDay:  leave.LeaveDay,
			Status:    leave.Status,
		})
	}

	return &LeaveResponseWithCount{
		LeaveResponse: res,
		CountSick:     uint(countSick),
		CountBusiness: uint(countBusiness),
		CountVacation: uint(countVacation),
	}, nil
}

func (s *leaveService) GetLeaves() ([]LeaveResponse, error) {
	var leaves []model.Leave
	if err := s.db.Find(&leaves).Error; err != nil {
		fmt.Printf("Error finding leaves: %v\n", err)
		return nil, err
	}

	if len(leaves) == 0 {
		fmt.Println("No leaves found")
		return nil, nil
	}

	var res []LeaveResponse
	for _, leave := range leaves {
		res = append(res, LeaveResponse{
			ID:        leave.ID,
			Type:      leave.Type,
			Detail:    leave.Detail,
			TimeStart: leave.TimeStart.Format(time.RFC3339),
			TimeEnd:   leave.TimeEnd.Format(time.RFC3339),
			CreatedAt: leave.CreatedAt.Format(time.RFC3339),
			UpdatedAt: leave.UpdatedAt.Format(time.RFC3339),
			LeaveDay:  leave.LeaveDay,
			Status:    leave.Status,
		})
	}

	return res, nil
}

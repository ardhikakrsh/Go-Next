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
		if leave.Type == "sakit" {
			countSick += 1
		} else if leave.Type == "absen" {
			countBusiness += 1
		} else if leave.Type == "liburan" {
			countVacation += 1
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
		fmt.Println(leaves)
		res = append(res, LeaveResponse{
			ID:        leave.ID,
			UserID:    leave.UserID,
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

func (s *leaveService) ApproveLeave(leaveId uint) error {
	var leave model.Leave
	if err := s.db.First(&leave, leaveId).Error; err != nil {
		fmt.Printf("Error finding leave with ID %d: %v\n", leaveId, err)
		return err
	}

	leave.Status = "approved"
	if err := s.db.Save(&leave).Error; err != nil {
		fmt.Printf("Error approving leave with ID %d: %v\n", leaveId, err)
		return err
	}

	return nil
}

func (s *leaveService) RejectLeave(leaveId uint) error {
	var leave model.Leave
	if err := s.db.First(&leave, leaveId).Error; err != nil {
		fmt.Printf("Error finding leave with ID %d: %v\n", leaveId, err)
		return err
	}

	leave.Status = "rejected"
	if err := s.db.Save(&leave).Error; err != nil {
		fmt.Printf("Error rejecting leave with ID %d: %v\n", leaveId, err)
		return err
	}

	return nil
}

func (s *leaveService) EditLeave(leaveId uint, req EditLeaveRequest) (*LeaveResponse, error) {
	var leave model.Leave
	if err := s.db.First(&leave, leaveId).Error; err != nil {
		fmt.Printf("Error finding leave with ID %d: %v\n", leaveId, err)
		return nil, err
	}

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

	leave.TimeStart = timeStartDate
	leave.TimeEnd = timeEndDate
	leave.Type = req.Type
	leave.Detail = req.Detail
	leave.LeaveDay = uint(timeEndDate.Sub(timeStartDate).Hours() / 24)
	leave.UpdatedAt = time.Now()

	if err := s.db.Save(&leave).Error; err != nil {
		fmt.Printf("Error saving leave with ID %d: %v\n", leaveId, err)
		return nil, err
	}

	return &LeaveResponse{
		ID:        leave.ID,
		UserID:    leave.UserID,
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

func (s *leaveService) DeleteLeave(leaveId uint) error {
	var leave model.Leave
	if err := s.db.First(&leave, leaveId).Error; err != nil {
		fmt.Printf("Error finding leave with ID %d: %v\n", leaveId, err)
		return err
	}

	if err := s.db.Delete(&leave).Error; err != nil {
		fmt.Printf("Error deleting leave with ID %d: %v\n", leaveId, err)
		return err
	}

	return nil
}

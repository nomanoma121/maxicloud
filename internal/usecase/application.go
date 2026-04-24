package usecase

import (
	"context"

	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

type ApplicationService interface {
	CreateApplication(ctx context.Context, spec domain.ApplicationSpec, ownerID string) (*domain.Application, error)
	GetApplication(ctx context.Context, id string) (*domain.Application, error)
	ListApplications(ctx context.Context, projectID string) ([]domain.Application, error)
	UpdateApplication(ctx context.Context, id string, spec domain.ApplicationSpec) (*domain.Application, error)
	DeleteApplication(ctx context.Context, id string) error
}

type applicationService struct {
	appRepo domain.ApplicationRepository
}

func NewApplicationService(repo domain.ApplicationRepository) ApplicationService {
	return &applicationService{appRepo: repo}
}

func (u *applicationService) CreateApplication(ctx context.Context, spec domain.ApplicationSpec, ownerID string) (*domain.Application, error) {
	if err := spec.Validate(); err != nil {
		return nil, err
	}
	app := domain.Application{
		ProjectID: spec.ProjectID,
		Name:      spec.Name,
		Source:    spec.Source,
		OwnerID:   ownerID,
	}
	createdApp, err := u.appRepo.CreateApplication(ctx, app)
	if err != nil {
		return nil, err
	}
	return u.appRepo.GetApplication(ctx, createdApp.ID)
}

func (u *applicationService) GetApplication(ctx context.Context, id string) (*domain.Application, error) {
	return u.appRepo.GetApplication(ctx, id)
}

func (u *applicationService) ListApplications(ctx context.Context, projectID string) ([]domain.Application, error) {
	return u.appRepo.ListApplications(ctx, projectID)
}

func (u *applicationService) UpdateApplication(ctx context.Context, id string, spec domain.ApplicationSpec) (*domain.Application, error) {
	if err := spec.Validate(); err != nil {
		return nil, err
	}
	existing, err := u.appRepo.GetApplication(ctx, id)
	if err != nil {
		return nil, err
	}
	existing.ProjectID = spec.ProjectID
	existing.Name = spec.Name
	existing.Source = spec.Source
	if err := u.appRepo.UpdateApplication(ctx, *existing); err != nil {
		return nil, err
	}
	return u.appRepo.GetApplication(ctx, id)
}

func (u *applicationService) DeleteApplication(ctx context.Context, id string) error {
	return u.appRepo.DeleteApplication(ctx, id)
}

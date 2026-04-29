package usecase

import (
	"context"

	"github.com/google/uuid"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

type ApplicationService interface {
	CreateApplication(ctx context.Context, params CreateApplicationParams) (*domain.Application, error)
	GetApplication(ctx context.Context, id string) (*domain.Application, error)
	ListApplications(ctx context.Context, projectID string) ([]domain.Application, error)
	UpdateApplication(ctx context.Context, params UpdateApplicationParams) (*domain.Application, error)
	DeleteApplication(ctx context.Context, id string) error
}

type applicationService struct {
	appRepo domain.ApplicationRepository
}

func NewApplicationService(repo domain.ApplicationRepository) ApplicationService {
	return &applicationService{appRepo: repo}
}

type CreateApplicationParams struct {
	Name    string
	OwnerID string
	Spec    domain.ApplicationSpec
}

func (u *applicationService) CreateApplication(ctx context.Context, params CreateApplicationParams) (*domain.Application, error) {
	spec := domain.ApplicationSpec{
		ProjectID:            params.Spec.ProjectID,
		Source:               params.Spec.Source,
		BuildConfig:          params.Spec.BuildConfig,
		AccessMode:           params.Spec.AccessMode,
		Domain:               params.Spec.Domain,
		EnvironmentVariables: params.Spec.EnvironmentVariables,
		Secrets:              params.Spec.Secrets,
	}
	if err := spec.Validate(); err != nil {
		return nil, err
	}
	createdApp, err := u.appRepo.CreateApplication(ctx, domain.CreateApplicationParams{
		ID:      uuid.New().String(),
		Name:    params.Name,
		OwnerID: params.OwnerID,
		Spec:    spec,
	})
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

type UpdateApplicationParams struct {
	ID      string
	Name    string
	OwnerID string
	Spec    domain.ApplicationSpec
}

func (u *applicationService) UpdateApplication(ctx context.Context, params UpdateApplicationParams) (*domain.Application, error) {
	if err := params.Spec.Validate(); err != nil {
		return nil, err
	}
	existing, err := u.appRepo.GetApplication(ctx, params.ID)
	if err != nil {
		return nil, err
	}
	existing.ProjectID = params.Spec.ProjectID
	existing.Name = params.Name
	existing.OwnerID = params.OwnerID
	existing.Source = params.Spec.Source
	if err := u.appRepo.UpdateApplication(ctx, *existing); err != nil {
		return nil, err
	}
	return u.appRepo.GetApplication(ctx, params.ID)
}

func (u *applicationService) DeleteApplication(ctx context.Context, id string) error {
	return u.appRepo.DeleteApplication(ctx, id)
}

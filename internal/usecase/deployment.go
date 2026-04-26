package usecase

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

type DeploymentService struct {
	deployRepo   domain.DeploymentRepository
	pipelineRepo domain.DeploymentPipelineRepository
	appRepo      domain.ApplicationRepository
}

type DeploymentServiceInterface interface {
	CreateDeployment(ctx context.Context, params CreateDeploymentParams) (string, error)
}

func NewDeploymentService(deployRepo domain.DeploymentRepository, pipelineRepo domain.DeploymentPipelineRepository, appRepo domain.ApplicationRepository) *DeploymentService {
	return &DeploymentService{
		deployRepo:   deployRepo,
		pipelineRepo: pipelineRepo,
		appRepo:      appRepo,
	}
}

type CreateDeploymentParams struct {
	ApplicationID string
	OwnerUserID   string
	Repo          domain.Repository
	Commit        domain.Commit
	PrNumber      *int
}

func (s *DeploymentService) CreateDeployment(ctx context.Context, params CreateDeploymentParams) (string, error) {
	deployID, err := s.deployRepo.CreateDeployment(domain.Deployment{
		ID:            uuid.New().String(),
		ApplicationID: params.ApplicationID,
		OwnerUserID:   params.OwnerUserID,
		Repo:          params.Repo,
		Commit:        params.Commit,
		PRNumber:      params.PrNumber,
		Status:        domain.DeploymentStatusQueued,
	})
	if err != nil {
		return "", err
	}

	s.pipelineRepo.CreatePipeline(ctx, domain.DeploymentPipeline{
		ID:            deployID,
		ApplicationID: params.ApplicationID,
		OwnerUserID:   params.OwnerUserID,
		Repo:          params.Repo,
		Commit:        params.Commit,
		PRNumber:      params.PrNumber,
		Status:        domain.DeploymentStatusQueued,
		StartedAt:     time.Now(),
	})

	return deployID, nil
}

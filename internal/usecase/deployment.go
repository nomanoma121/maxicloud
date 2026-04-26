package usecase

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

const (
	MaxPreviewPipelineHistory    = 1
	MaxProductionPipelineHistory = 3
)

type deploymentService struct {
	deployRepo   domain.DeploymentRepository
	pipelineRepo domain.DeploymentPipelineRepository
	appRepo      domain.ApplicationRepository
}

type DeploymentService interface {
	CreateDeployment(ctx context.Context, params CreateDeploymentParams) (string, error)
}

func NewDeploymentService(deployRepo domain.DeploymentRepository, pipelineRepo domain.DeploymentPipelineRepository, appRepo domain.ApplicationRepository) *deploymentService {
	return &deploymentService{
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
	PRNumber      *int
}

func (s *deploymentService) CreateDeployment(ctx context.Context, params CreateDeploymentParams) (string, error) {
	deployID, err := s.deployRepo.CreateDeployment(ctx, domain.Deployment{
		ID:            uuid.New().String(),
		ApplicationID: params.ApplicationID,
		OwnerUserID:   params.OwnerUserID,
		Repo:          params.Repo,
		Commit:        params.Commit,
		PRNumber:      params.PRNumber,
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
		PRNumber:      params.PRNumber,
		Status:        domain.DeploymentStatusQueued,
		StartedAt:     time.Now(),
	})

	// PRNumberがある場合はPreview環境
	isPreview := params.PRNumber != nil
	maxHistory := MaxProductionPipelineHistory
	if isPreview {
		maxHistory = MaxPreviewPipelineHistory
	}

	err = s.pipelineRepo.DeleteOldPipelines(ctx, params.ApplicationID, maxHistory, isPreview)
	if err != nil {
		return "", fmt.Errorf("failed to delete old pipelines: %w", err)
	}

	return deployID, nil
}

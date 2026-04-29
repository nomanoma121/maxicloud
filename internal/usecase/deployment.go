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
	HandleGitHubEvent(ctx context.Context, event domain.DeploymentEvent) error
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

	if _, err := s.pipelineRepo.CreatePipeline(ctx, domain.DeploymentPipeline{
		ID:            deployID,
		ApplicationID: params.ApplicationID,
		OwnerUserID:   params.OwnerUserID,
		Repo:          params.Repo,
		Commit:        params.Commit,
		PRNumber:      params.PRNumber,
		Status:        domain.DeploymentStatusQueued,
		StartedAt:     time.Now(),
	}); err != nil {
		return "", fmt.Errorf("create deployment pipeline: %w", err)
	}

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

func (s *deploymentService) HandleGitHubEvent(ctx context.Context, event domain.DeploymentEvent) error {
	switch event.Type {
	case domain.DeploymentEventTypeProductionRequested:
		return s.handleRepoDeploymentEvent(ctx, event, nil)
	case domain.DeploymentEventTypePreviewRequested:
		if event.PRNumber == nil {
			return domain.ValidationError{Message: "PR number is required for preview deployment"}
		}
		return s.handleRepoDeploymentEvent(ctx, event, event.PRNumber)
	case domain.DeploymentEventTypePreviewDeleted:
		// TODO: いつか実装する
		return nil
	default:
		return domain.ValidationError{Message: fmt.Sprintf("unsupported deployment event type: %s", event.Type)}
	}
}

func (s *deploymentService) handleRepoDeploymentEvent(ctx context.Context, event domain.DeploymentEvent, prNumber *int) error {
	apps, err := s.appRepo.GetApplicationsByRepo(ctx, event.Repo.Owner, event.Repo.Name, event.Branch)
	if err != nil {
		return fmt.Errorf("get applications by repo: %w", err)
	}
	for _, app := range apps {
		deployID, err := s.CreateDeployment(ctx, CreateDeploymentParams{
			ApplicationID: app.ID,
			OwnerUserID:   app.OwnerID,
			Repo:          event.Repo,
			Commit:        event.Commit,
			PRNumber:      prNumber,
		})
		if err != nil {
			return fmt.Errorf("create deployment for application %s: %w", app.ID, err)
		}

		if _, err := s.pipelineRepo.CreatePipeline(ctx, domain.DeploymentPipeline{
			ID:            deployID,
			ApplicationID: app.ID,
			OwnerUserID:   app.OwnerID,
			Repo:          event.Repo,
			Commit:        event.Commit,
			PRNumber:      prNumber,
			Status:        domain.DeploymentStatusQueued,
			StartedAt:     time.Now(),
		}); err != nil {
			return fmt.Errorf("create deployment pipeline for application %s: %w", app.ID, err)
		}
	}
	return nil
}

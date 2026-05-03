package usecase

import (
	"context"
	"fmt"
	"strings"
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
	RetryDeployment(ctx context.Context, deploymentID string) (*domain.Deployment, error)
	GetDeployment(ctx context.Context, deploymentID string) (*domain.Deployment, error)
	ListDeployments(ctx context.Context, applicationID string) ([]domain.Deployment, error)
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
		StartedAt:     time.Now(),
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

func (s *deploymentService) RetryDeployment(ctx context.Context, deploymentID string) (*domain.Deployment, error) {
	deploy, err := s.deployRepo.GetDeployment(ctx, deploymentID)
	if err != nil {
		return nil, fmt.Errorf("get deployment: %w", err)
	}
	if deploy == nil {
		return nil, domain.ValidationError{Message: "deployment not found"}
	}

	newDeployID, err := s.CreateDeployment(ctx, CreateDeploymentParams{
		ApplicationID: deploy.ApplicationID,
		OwnerUserID:   deploy.OwnerUserID,
		Repo:          deploy.Repo,
		Commit:        deploy.Commit,
		PRNumber:      deploy.PRNumber,
	})
	if err != nil {
		return nil, fmt.Errorf("create deployment: %w", err)
	}
	return s.deployRepo.GetDeployment(ctx, newDeployID)
}

func (s *deploymentService) GetDeployment(ctx context.Context, deploymentID string) (*domain.Deployment, error) {
	deploy, err := s.deployRepo.GetDeployment(ctx, deploymentID)
	if err != nil {
		if isNotFoundError(err) {
			return nil, nil
		}
		return nil, err
	}
	return s.withPipelineStatus(ctx, deploy)
}

func (s *deploymentService) ListDeployments(ctx context.Context, applicationID string) ([]domain.Deployment, error) {
	if applicationID == "" {
		return nil, domain.ValidationError{Message: "application_id is required"}
	}
	deployments, err := s.deployRepo.ListDeploymentsByApplication(ctx, applicationID)
	if err != nil {
		return nil, err
	}
	result := make([]domain.Deployment, 0, len(deployments))
	for i := range deployments {
		merged, err := s.withPipelineStatus(ctx, &deployments[i])
		if err != nil {
			return nil, err
		}
		if merged != nil {
			result = append(result, *merged)
		}
	}
	return result, nil
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
		_, err := s.CreateDeployment(ctx, CreateDeploymentParams{
			ApplicationID: app.ID,
			OwnerUserID:   app.OwnerID,
			Repo:          event.Repo,
			Commit:        event.Commit,
			PRNumber:      prNumber,
		})
		if err != nil {
			return fmt.Errorf("create deployment for application %s: %w", app.ID, err)
		}
	}
	return nil
}

func isNotFoundError(err error) bool {
	return err != nil && strings.Contains(strings.ToLower(err.Error()), "not found")
}

func (s *deploymentService) withPipelineStatus(ctx context.Context, deploy *domain.Deployment) (*domain.Deployment, error) {
	if deploy == nil {
		return nil, nil
	}
	pipeline, err := s.pipelineRepo.GetPipeline(ctx, deploy.ID)
	if err != nil {
		return nil, fmt.Errorf("get deployment pipeline: %w", err)
	}
	if pipeline == nil {
		return deploy, nil
	}

	merged := *deploy
	merged.Status = pipeline.Status
	if !pipeline.StartedAt.IsZero() {
		merged.StartedAt = pipeline.StartedAt
	}
	merged.FinishedAt = pipeline.FinishedAt
	return &merged, nil
}

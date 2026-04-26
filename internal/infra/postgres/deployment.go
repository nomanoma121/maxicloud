package postgres

import (
	"context"
	"fmt"
	"sync"

	"github.com/google/uuid"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

type deploymentRepository struct {
	mu   sync.RWMutex
	data map[string]domain.Deployment
}

var _ domain.DeploymentRepository = (*deploymentRepository)(nil)

func NewDeploymentRepository() domain.DeploymentRepository {
	return &deploymentRepository{
		data: make(map[string]domain.Deployment),
	}
}

func (r *deploymentRepository) CreateDeployment(ctx context.Context, deployment domain.Deployment) (string, error) {
	id := uuid.NewString()
	deployment.ID = id
	r.mu.Lock()
	r.data[id] = deployment
	r.mu.Unlock()
	return id, nil
}

func (r *deploymentRepository) GetDeployment(ctx context.Context, id string) (*domain.Deployment, error) {
	r.mu.RLock()
	d, ok := r.data[id]
	r.mu.RUnlock()
	if !ok {
		return nil, fmt.Errorf("deployment %s not found", id)
	}
	return &d, nil
}

func (r *deploymentRepository) UpdateDeployment(ctx context.Context, deployment domain.Deployment) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.data[deployment.ID]; !ok {
		return fmt.Errorf("deployment %s not found", deployment.ID)
	}
	r.data[deployment.ID] = deployment
	return nil
}

func (r *deploymentRepository) RecordDeploymentStatus(ctx context.Context, params domain.RecordDeploymentStatusParams) error {
	if err := params.Validate(); err != nil {
		return err
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.data[params.ID]; !ok {
		return fmt.Errorf("deployment %s not found", params.ID)
	}
	r.data[params.ID] = domain.Deployment{
		ID:            params.ID,
		ApplicationID: r.data[params.ID].ApplicationID,
		OwnerUserID:   r.data[params.ID].OwnerUserID,
		Repo:          r.data[params.ID].Repo,
		Commit:        r.data[params.ID].Commit,
		PRNumber:      r.data[params.ID].PRNumber,
		Status:        params.Status,
		StartedAt:     r.data[params.ID].StartedAt,
		FinishedAt:    params.FinishedAt,
	}
	return nil
}

func (r *deploymentRepository) DeleteDeployment(ctx context.Context, id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.data[id]; !ok {
		return fmt.Errorf("deployment %s not found", id)
	}
	delete(r.data, id)
	return nil
}

func (r *deploymentRepository) ListDeploymentsByApplication(ctx context.Context, applicationID string) ([]domain.Deployment, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var result []domain.Deployment
	for _, d := range r.data {
		if d.ApplicationID == applicationID {
			result = append(result, d)
		}
	}
	return result, nil
}

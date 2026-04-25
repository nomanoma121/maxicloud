package postgres

import (
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

func (r *deploymentRepository) CreateDeployment(deployment domain.Deployment) (string, error) {
	id := uuid.NewString()
	deployment.ID = id
	r.mu.Lock()
	r.data[id] = deployment
	r.mu.Unlock()
	return id, nil
}

func (r *deploymentRepository) GetDeployment(id string) (*domain.Deployment, error) {
	r.mu.RLock()
	d, ok := r.data[id]
	r.mu.RUnlock()
	if !ok {
		return nil, fmt.Errorf("deployment %s not found", id)
	}
	return &d, nil
}

func (r *deploymentRepository) UpdateDeployment(deployment domain.Deployment) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.data[deployment.ID]; !ok {
		return fmt.Errorf("deployment %s not found", deployment.ID)
	}
	r.data[deployment.ID] = deployment
	return nil
}

func (r *deploymentRepository) DeleteDeployment(id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.data[id]; !ok {
		return fmt.Errorf("deployment %s not found", id)
	}
	delete(r.data, id)
	return nil
}

func (r *deploymentRepository) ListDeploymentsByApplication(applicationID string) ([]domain.Deployment, error) {
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

package usecase

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

type ProjectUsecase interface {
	CreateProject(ctx context.Context, name, description, ownerID string) (*domain.Project, error)
	GetProject(ctx context.Context, id string) (*domain.Project, error)
	ListProjects(ctx context.Context) ([]*domain.Project, error)
	UpdateProject(ctx context.Context, params UpdateProjectParams) (*domain.Project, error)
	DeleteProject(ctx context.Context, id string) error
}

type projectUsecase struct {
	repo domain.ProjectRepository
}

func NewProjectUsecase(repo domain.ProjectRepository) ProjectUsecase {
	return &projectUsecase{repo: repo}
}

func (u *projectUsecase) CreateProject(ctx context.Context, name, description, ownerID string) (*domain.Project, error) {
	id, err := u.repo.CreateProject(ctx, domain.Project{
		ID:          uuid.New().String(),
		Name:        name,
		Description: description,
		OwnerID:     ownerID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	})
	if err != nil {
		return nil, err
	}
	return u.repo.GetProject(ctx, id)
}

func (u *projectUsecase) GetProject(ctx context.Context, id string) (*domain.Project, error) {
	return u.repo.GetProject(ctx, id)
}

func (u *projectUsecase) ListProjects(ctx context.Context) ([]*domain.Project, error) {
	return u.repo.ListProjects(ctx)
}

type UpdateProjectParams struct {
	ID          string
	Name        *string
	Description *string
	OwnerID     *string
}

func (u *projectUsecase) UpdateProject(ctx context.Context, params UpdateProjectParams) (*domain.Project, error) {
	if err := u.repo.UpdateProject(ctx, domain.UpdateProjectParams{
		ID:          params.ID,
		Name:        params.Name,
		Description: params.Description,
		OwnerID:     params.OwnerID,
		UpdatedAt:   time.Now(),
	}); err != nil {
		return nil, err
	}
	return u.repo.GetProject(ctx, params.ID)
}

func (u *projectUsecase) DeleteProject(ctx context.Context, id string) error {
	return u.repo.DeleteProject(ctx, id)
}

package usecase

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

type ProjectUsecase interface {
	CreateProject(ctx context.Context, name, description, ownerUserID string) (*domain.Project, error)
	GetProject(ctx context.Context, id string) (*domain.Project, error)
	ListProjects(ctx context.Context) ([]*domain.Project, error)
	UpdateProject(ctx context.Context, id, name, description, ownerUserID string) (*domain.Project, error)
	DeleteProject(ctx context.Context, id string) error
}

type projectUsecase struct {
	repo domain.ProjectRepository
}

func NewProjectUsecase(repo domain.ProjectRepository) ProjectUsecase {
	return &projectUsecase{repo: repo}
}

func (u *projectUsecase) CreateProject(ctx context.Context, name, description, ownerUserID string) (*domain.Project, error) {
	id, err := u.repo.CreateProject(ctx, domain.Project{
		ID:          uuid.New().String(),
		Name:        name,
		Description: description,
		OwnerUserID: ownerUserID,
		CreatedAt:   time.Now().UTC().Format(time.RFC3339),
		UpdatedAt:   time.Now().UTC().Format(time.RFC3339),
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

func (u *projectUsecase) UpdateProject(ctx context.Context, id, name, description, ownerUserID string) (*domain.Project, error) {
	if err := u.repo.UpdateProject(ctx, domain.Project{
		ID:          id,
		Name:        name,
		Description: description,
		OwnerUserID: ownerUserID,
		UpdatedAt:   time.Now().UTC().Format(time.RFC3339),
	}); err != nil {
		return nil, err
	}
	return u.repo.GetProject(ctx, id)
}

func (u *projectUsecase) DeleteProject(ctx context.Context, id string) error {
	return u.repo.DeleteProject(ctx, id)
}

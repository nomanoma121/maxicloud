package domain

import (
	"context"
	"time"
)

type Project struct {
	ID          string
	Name        string
	Description string
	OwnerUserID string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type ProjectRepository interface {
	CreateProject(ctx context.Context, project Project) (string, error)
	GetProject(ctx context.Context, id string) (*Project, error)
	ListProjects(ctx context.Context) ([]*Project, error)
	UpdateProject(ctx context.Context, project Project) error
	DeleteProject(ctx context.Context, id string) error
}

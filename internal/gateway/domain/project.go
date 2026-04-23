package domain

import "context"

type Project struct {
	ID          string
	Name        string
	Description string
	OwnerUserID string
	CreatedAt   string
	UpdatedAt   string
}

type ProjectRepository interface {
	CreateProject(ctx context.Context, project Project) (string, error)
	GetProject(ctx context.Context, id string) (*Project, error)
	UpdateProject(ctx context.Context, project Project) error
	DeleteProject(ctx context.Context, id string) error
}

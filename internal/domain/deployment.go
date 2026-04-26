package domain

import (
	"context"
	"time"
)

type DeploymentStatus string

const (
	DeploymentStatusQueued    DeploymentStatus = "QUEUED"
	DeploymentStatusRunning   DeploymentStatus = "RUNNING"
	DeploymentStatusSucceeded DeploymentStatus = "SUCCESS"
	DeploymentStatusFailed    DeploymentStatus = "FAILED"
)

type Deployment struct {
	ID            string
	ApplicationID string
	OwnerUserID   string
	Repo          Repository
	Commit        Commit
	PRNumber      *int // Previewの時に使う
	Status        DeploymentStatus
	StartedAt     time.Time
	Duration      time.Duration
}

type DeploymentRepository interface {
	CreateDeployment(deployment Deployment) (string, error)
	GetDeployment(id string) (*Deployment, error)
	UpdateDeployment(deployment Deployment) error
	DeleteDeployment(id string) error
	ListDeploymentsByApplication(applicationID string) ([]Deployment, error)
}

type DeploymentPipeline struct {
	ID            string
	ApplicationID string
	OwnerUserID   string
	Repo          Repository
	Commit        Commit
	PRNumber      *int // Previewの時に使う
	Status        DeploymentStatus
	StartedAt     time.Time
	FinishedAt    *time.Time
}

type DeploymentPipelineRepository interface {
	CreatePipeline(ctx context.Context, pipeline DeploymentPipeline) (string, error)
	GetPipeline(ctx context.Context, id string) (*DeploymentPipeline, error)
	UpdatePipeline(ctx context.Context, pipeline DeploymentPipeline) error
	DeletePipeline(ctx context.Context, id string) error
	ListPipelinesByApplication(ctx context.Context, applicationID string) ([]DeploymentPipeline, error)
}

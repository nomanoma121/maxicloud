package domain

import (
	"time"
)

type DeploymentStatus string

const (
	DeploymentStatusQueued    DeploymentStatus = "QUEUED"
	DeploymentStatusRunning   DeploymentStatus = "RUNNING"
	DeploymentStatusSucceeded DeploymentStatus = "SUCCESS"
	DeploymentStatusFailed    DeploymentStatus = "FAILED"
)

type Commit struct {
	SHA        string
	Message    string
	AuthorName string
	Timestamp  time.Time
}

type Deployment struct {
	ID            string
	ApplicationID string
	OwnerUserID   string
	Commit        Commit
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
	Commit        Commit
	Status        DeploymentStatus
	StartedAt     time.Time
	FinishedAt    *time.Time
	Image         string
}

type DeploymentPipelineRepository interface {
	CreatePipeline(pipeline DeploymentPipeline) (string, error)
	GetPipeline(id string) (*DeploymentPipeline, error)
	UpdatePipeline(pipeline DeploymentPipeline) error
	DeletePipeline(id string) error
	ListPipelinesByApplication(applicationID string) ([]DeploymentPipeline, error)
}

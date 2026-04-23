package domain

import "time"

type DeploymentStatus string

const (
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

type DeploymentRun struct {
	ID            string
	ApplicationID string
	OwnerUserID   string
	Commit        Commit
	Status        DeploymentStatus
	StartedAt     time.Time
	Duration      time.Duration
}

type DeploymentRepository interface {
	CreateDeploymentRun(run DeploymentRun) (string, error)
	GetDeploymentRun(id string) (*DeploymentRun, error)
	UpdateDeploymentRun(run DeploymentRun) error
	DeleteDeploymentRun(id string) error
	ListDeploymentRunsByApplication(applicationID string) ([]DeploymentRun, error)
}
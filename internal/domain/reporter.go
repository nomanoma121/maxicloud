package domain

import "context"

type CheckStatus string
type CheckConclusion string

const (
	CheckStatusInProgress CheckStatus = "in_progress"
	CheckStatusCompleted  CheckStatus = "completed"

	CheckConclusionSuccess CheckConclusion = "success"
	CheckConclusionFailure CheckConclusion = "failure"
)

type CreateStatusOptions struct {
	Name    string
	HeadSHA string
	Status  CheckStatus
	Title   string
	Summary string
	Text    string
}

type CreateCommitStatusParams struct {
	InstallationID        int64
	Owner                 string
	Repo                  string
	CreateStatusOptions CreateStatusOptions
}

type UpdateCommitStatusOptions struct {
	Name       string
	Status     CheckStatus
	Conclusion CheckConclusion
	Title      string
	Summary    string
	Text       string
}

type UpdateCommitStatusParams struct {
	InstallationID        int64
	Owner                 string
	Repo                  string
	CheckRunID            int64
	UpdateStatusOptions UpdateCommitStatusOptions
}

type DeploymentSummary struct {
	ID   int64
	Body string
}

type CreateDeploymentSummaryParams struct {
	InstallationID int64
	Owner          string
	Repo           string
	PrNumber       int
	Comment        string
}

type UpdateDeploymentSummaryParams struct {
	InstallationID int64
	Owner          string
	Repo           string
	CommentID      int64
	Comment        string
}

// もしかしたらGitHub以外使う予定ないだろうから抽象化する必要ないかも
type DeploymentReporter interface {
	CreateCommitStatus(ctx context.Context, params CreateCommitStatusParams) (int64, error)
	UpdateCommitStatus(ctx context.Context, params UpdateCommitStatusParams) error
	GetDeploymentSummary(ctx context.Context, installationID int64, owner, repo string, commentID int64) (*DeploymentSummary, error)
	CreateDeploymentSummary(ctx context.Context, params CreateDeploymentSummaryParams) (int64, error)
	UpdateDeploymentSummary(ctx context.Context, params UpdateDeploymentSummaryParams) error
}

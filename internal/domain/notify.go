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

type CreateStatusParams struct {
	InstallationID        int64
	Owner                 string
	Repo                  string
	CreateStatusOptions CreateStatusOptions
}

type UpdateStatusOptions struct {
	Name       string
	Status     CheckStatus
	Conclusion CheckConclusion
	Title      string
	Summary    string
	Text       string
}

type UpdateStatusParams struct {
	InstallationID        int64
	Owner                 string
	Repo                  string
	CheckRunID            int64
	UpdateStatusOptions UpdateStatusOptions
}

type IssueComment struct {
	ID   int64
	Body string
}

type CreateCommentParams struct {
	InstallationID int64
	Owner          string
	Repo           string
	PrNumber       int
	Comment        string
}

type UpdateCommentParams struct {
	InstallationID int64
	Owner          string
	Repo           string
	CommentID      int64
	Comment        string
}

type DeploymentNotifier interface {
	CreateStatus(ctx context.Context, params CreateStatusParams) (int64, error)
	UpdateStatus(ctx context.Context, params UpdateStatusParams) error
	GetComment(ctx context.Context, installationID int64, owner, repo string, commentID int64) (*IssueComment, error)
	CreateComment(ctx context.Context, params CreateCommentParams) (int64, error)
	UpdateComment(ctx context.Context, params UpdateCommentParams) error
}

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

type CreateCheckRunOptions struct {
	Name    string
	HeadSHA string
	Status  CheckStatus
	Title   string
	Summary string
	Text    string
}

type CreateCheckRunParams struct {
	InstallationID        int64
	Owner                 string
	Repo                  string
	CreateCheckRunOptions CreateCheckRunOptions
}

type UpdateCheckRunOptions struct {
	Name       string
	Status     CheckStatus
	Conclusion CheckConclusion
	Title      string
	Summary    string
	Text       string
}

type UpdateCheckRunParams struct {
	InstallationID        int64
	Owner                 string
	Repo                  string
	CheckRunID            int64
	UpdateCheckRunOptions UpdateCheckRunOptions
}

type IssueComment struct {
	ID   int64
	Body string
}

type CreateIssueCommentParams struct {
	InstallationID int64
	Owner          string
	Repo           string
	PrNumber       int
	Comment        string
}

type UpdateIssueCommentParams struct {
	InstallationID int64
	Owner          string
	Repo           string
	CommentID      int64
	Comment        string
}

type DeploymentNotifier interface {
	CreateStatus(ctx context.Context, params CreateCheckRunParams) (int64, error)
	UpdateStatus(ctx context.Context, params UpdateCheckRunParams) error
	GetComment(ctx context.Context, installationID int64, owner, repo string, commentID int64) (*IssueComment, error)
	CreateComment(ctx context.Context, params CreateIssueCommentParams) (int64, error)
	UpdateComment(ctx context.Context, params UpdateIssueCommentParams) error
}

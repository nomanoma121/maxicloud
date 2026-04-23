package github

import (
	"context"
	"net/http"

	"github.com/bradleyfalzon/ghinstallation/v2"

	gh "github.com/google/go-github/v72/github"
)

type Client interface {
	GetInstallationAccessToken(ctx context.Context, installationID int64) (string, error)
	CreateCheckRun(ctx context.Context, params CreateCheckRunParams) (int64, error)
	UpdateCheckRun(ctx context.Context, params UpdateCheckRunParams) error
	GetIssueComment(ctx context.Context, installationID int64, owner, repo string, commentId int64) (*gh.IssueComment, error)
	CreateIssueComment(ctx context.Context, params CreateIssueCommentParams) (int64, error)
	UpdateIssueComment(ctx context.Context, params UpdateIssueCommentParams) error
}

type client struct {
	appID      int64
	privateKey []byte
}

func NewGitHubClient(appID int64, privateKey []byte) Client {
	return &client{appID: appID, privateKey: privateKey}
}

func (c *client) GetInstallationAccessToken(ctx context.Context, installationID int64) (string, error) {
	itr, err := ghinstallation.New(http.DefaultTransport, c.appID, installationID, c.privateKey)
	if err != nil {
		return "", err
	}
	return itr.Token(ctx)
}

func (c *client) newClient(installationID int64) (*gh.Client, error) {
	itr, err := ghinstallation.New(http.DefaultTransport, c.appID, installationID, c.privateKey)
	if err != nil {
		return nil, err
	}
	return gh.NewClient(&http.Client{Transport: itr}), nil
}

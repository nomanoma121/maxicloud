package github

import (
	"context"
	"net/http"

	"github.com/bradleyfalzon/ghinstallation/v2"
	gh "github.com/google/go-github/v72/github"
)

func (c *client) GetIssueComment(ctx context.Context, installationID int64, owner, repo string, commentId int64) (*gh.IssueComment, error) {
	itr, err := ghinstallation.New(http.DefaultTransport, c.appID, installationID, c.privateKey)
	if err != nil {
		return nil, err
	}
	client := gh.NewClient(&http.Client{Transport: itr})

	comment, _, err := client.Issues.GetComment(ctx, owner, repo, commentId)
	if err != nil {
		return nil, err
	}
	return comment, nil
}

type CreateIssueCommentParams struct {
	InstallationID int64
	Owner          string
	Repo           string
	PrNumber       int
	Comment        string
}

func (c *client) CreateIssueComment(ctx context.Context, params CreateIssueCommentParams) (int64, error) {
	itr, err := ghinstallation.New(http.DefaultTransport, c.appID, params.InstallationID, c.privateKey)
	if err != nil {
		return 0, err
	}
	client := gh.NewClient(&http.Client{Transport: itr})

	result, _, err := client.Issues.CreateComment(ctx, params.Owner, params.Repo, params.PrNumber, &gh.IssueComment{
		Body: gh.Ptr(params.Comment),
	})
	return result.GetID(), err
}

type UpdateIssueCommentParams struct {
	InstallationID int64
	Owner          string
	Repo           string
	CommentID      int64
	Comment        string
}

func (c *client) UpdateIssueComment(ctx context.Context, params UpdateIssueCommentParams) error {
	itr, err := ghinstallation.New(http.DefaultTransport, c.appID, params.InstallationID, c.privateKey)
	if err != nil {
		return err
	}
	client := gh.NewClient(&http.Client{Transport: itr})

	_, _, err = client.Issues.EditComment(ctx, params.Owner, params.Repo, params.CommentID, &gh.IssueComment{
		Body: gh.Ptr(params.Comment),
	})
	return err
}

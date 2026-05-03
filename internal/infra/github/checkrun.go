package github

import (
	"context"
	"log"

	gh "github.com/google/go-github/v72/github"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

func (c *client) CreateCommitStatus(ctx context.Context, params domain.CreateCommitStatusParams) (int64, error) {
	ghClient, err := c.newGHClient()
	if err != nil {
		return 0, err
	}

	run, _, err := ghClient.Checks.CreateCheckRun(ctx, params.Owner, params.Repo, gh.CreateCheckRunOptions{
		Name:    params.CreateStatusOptions.Name,
		HeadSHA: params.CreateStatusOptions.HeadSHA,
		Status:  gh.Ptr(string(params.CreateStatusOptions.Status)),
		Output: &gh.CheckRunOutput{
			Title:   gh.Ptr(params.CreateStatusOptions.Title),
			Summary: gh.Ptr(params.CreateStatusOptions.Summary),
			Text:    gh.Ptr(params.CreateStatusOptions.Text),
		},
	})
	if err != nil {
		return 0, err
	}
	log.Printf("created check run with ID: %d", run.GetID())
	return run.GetID(), nil
}

func (c *client) UpdateCommitStatus(ctx context.Context, params domain.UpdateCommitStatusParams) error {
	ghClient, err := c.newGHClient()
	if err != nil {
		return err
	}

	_, _, err = ghClient.Checks.UpdateCheckRun(ctx, params.Owner, params.Repo, params.CheckRunID, gh.UpdateCheckRunOptions{
		Name:       params.UpdateStatusOptions.Name,
		Status:     gh.Ptr(string(params.UpdateStatusOptions.Status)),
		Conclusion: gh.Ptr(string(params.UpdateStatusOptions.Conclusion)),
		Output: &gh.CheckRunOutput{
			Title:   gh.Ptr(params.UpdateStatusOptions.Title),
			Summary: gh.Ptr(params.UpdateStatusOptions.Summary),
			Text:    gh.Ptr(params.UpdateStatusOptions.Text),
		},
	})
	log.Printf("updated check run with ID: %d, conclusion: %s", params.CheckRunID, params.UpdateStatusOptions.Conclusion)
	return err
}

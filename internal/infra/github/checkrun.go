package github

import (
	"context"
	"log"

	gh "github.com/google/go-github/v72/github"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

func (c *client) CreateStatus(ctx context.Context, params domain.CreateCheckRunParams) (int64, error) {
	ghClient, err := c.newGHClient(params.InstallationID)
	if err != nil {
		return 0, err
	}

	run, _, err := ghClient.Checks.CreateCheckRun(ctx, params.Owner, params.Repo, gh.CreateCheckRunOptions{
		Name:    params.CreateCheckRunOptions.Name,
		HeadSHA: params.CreateCheckRunOptions.HeadSHA,
		Status:  gh.Ptr(string(params.CreateCheckRunOptions.Status)),
		Output: &gh.CheckRunOutput{
			Title:   gh.Ptr(params.CreateCheckRunOptions.Title),
			Summary: gh.Ptr(params.CreateCheckRunOptions.Summary),
			Text:    gh.Ptr(params.CreateCheckRunOptions.Text),
		},
	})
	if err != nil {
		return 0, err
	}
	log.Printf("created check run with ID: %d", run.GetID())
	return run.GetID(), nil
}

func (c *client) UpdateStatus(ctx context.Context, params domain.UpdateCheckRunParams) error {
	ghClient, err := c.newGHClient(params.InstallationID)
	if err != nil {
		return err
	}

	_, _, err = ghClient.Checks.UpdateCheckRun(ctx, params.Owner, params.Repo, params.CheckRunID, gh.UpdateCheckRunOptions{
		Name:       params.UpdateCheckRunOptions.Name,
		Status:     gh.Ptr(string(params.UpdateCheckRunOptions.Status)),
		Conclusion: gh.Ptr(string(params.UpdateCheckRunOptions.Conclusion)),
		Output: &gh.CheckRunOutput{
			Title:   gh.Ptr(params.UpdateCheckRunOptions.Title),
			Summary: gh.Ptr(params.UpdateCheckRunOptions.Summary),
			Text:    gh.Ptr(params.UpdateCheckRunOptions.Text),
		},
	})
	log.Printf("updated check run with ID: %d, conclusion: %s", params.CheckRunID, params.UpdateCheckRunOptions.Conclusion)
	return err
}

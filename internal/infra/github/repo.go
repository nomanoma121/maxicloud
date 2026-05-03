package github

import (
	"context"
	"errors"
	"net/url"
	"strings"

	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

func (c *client) GetRepositories(ctx context.Context) ([]domain.Repository, error) {
	ghClient, err := c.newGHClient()
	if err != nil {
		return nil, err
	}
	res, _, err := ghClient.Apps.ListRepos(ctx, nil)
	if err != nil {
		return nil, err
	}
	result := make([]domain.Repository, len(res.Repositories))
	for i, r := range res.Repositories {
		result[i] = domain.Repository{
			Owner: r.GetOwner().GetLogin(),
			Name:  r.GetName(),
		}
	}
	return result, nil
}

func ParseRepoURL(repoURL string) (owner, repo string, err error) {
	u, err := url.Parse(repoURL)
	if err != nil {
		return "", "", err
	}
	path := strings.TrimPrefix(u.Path, "/")
	parts := strings.Split(path, "/")
	if len(parts) < 2 {
		return "", "", errors.New("invalid GitHub repository URL")
	}
	return parts[0], parts[1], nil
}

func CompareRepositoryURL(repoURL1, repoURL2 string) bool {
	owner1, repo1, err1 := ParseRepoURL(repoURL1)
	owner2, repo2, err2 := ParseRepoURL(repoURL2)
	if err1 != nil || err2 != nil {
		return false
	}
	return owner1 == owner2 && repo1 == repo2
}

func ShortSHA(sha string) string {
	if len(sha) < 8 {
		return sha
	}
	return sha[:8]
}

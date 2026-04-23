package github

import (
	"errors"
	"net/url"
	"strings"
)

// ParseRepoURL extracts owner and repo from a GitHub URL.
// e.g. "https://github.com/owner/repo" -> ("owner", "repo")
func ParseRepoURL(repoURL string) (owner, repo string, err error) {
	url, err := url.Parse(repoURL)
	if err != nil {
		return "", "", err
	}
	path := strings.TrimPrefix(url.Path, "/")
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

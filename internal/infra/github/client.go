package github

import (
	"context"
	"net/http"
	"sync"

	"github.com/bradleyfalzon/ghinstallation/v2"
	gh "github.com/google/go-github/v72/github"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

type client struct {
	appID      int64
	privateKey []byte

	mu         sync.Mutex
	transports map[int64]*ghinstallation.Transport
}

var _ domain.DeploymentReporter = (*client)(nil)

func NewGitHubClient(appID int64, privateKey []byte) *client {
	return &client{
		appID:      appID,
		privateKey: privateKey,
		transports: make(map[int64]*ghinstallation.Transport),
	}
}

func (c *client) transportFor(installationID int64) (*ghinstallation.Transport, error) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if itr, ok := c.transports[installationID]; ok {
		return itr, nil
	}
	itr, err := ghinstallation.New(http.DefaultTransport, c.appID, installationID, c.privateKey)
	if err != nil {
		return nil, err
	}
	c.transports[installationID] = itr
	return itr, nil
}

func (c *client) GetInstallationAccessToken(ctx context.Context, installationID int64) (string, error) {
	itr, err := c.transportFor(installationID)
	if err != nil {
		return "", err
	}
	return itr.Token(ctx)
}

func (c *client) newGHClient(installationID int64) (*gh.Client, error) {
	itr, err := c.transportFor(installationID)
	if err != nil {
		return nil, err
	}
	return gh.NewClient(&http.Client{Transport: itr}), nil
}

package github

import (
	"context"
	"net/http"

	"github.com/bradleyfalzon/ghinstallation/v2"
	gh "github.com/google/go-github/v72/github"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

type client struct {
	appID          int64
	privateKey     []byte
	installationID int64
}

var _ domain.DeploymentReporter = (*client)(nil)
var _ domain.SourceRepository = (*client)(nil)

func NewClient(appID int64, privateKey []byte, installationID int64) *client {
	return &client{
		appID:          appID,
		privateKey:     privateKey,
		installationID: installationID,
	}
}

func (c *client) newTransport() (*ghinstallation.Transport, error) {
	return ghinstallation.New(http.DefaultTransport, c.appID, c.installationID, c.privateKey)
}

func (c *client) GetInstallationAccessToken(ctx context.Context) (string, error) {
	itr, err := c.newTransport()
	if err != nil {
		return "", err
	}
	return itr.Token(ctx)
}

func (c *client) newGHClient() (*gh.Client, error) {
	itr, err := c.newTransport()
	if err != nil {
		return nil, err
	}
	return gh.NewClient(&http.Client{Transport: itr}), nil
}

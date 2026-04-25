package domain

import "context"

type SecretRepository interface {
	SaveRepositoryIntegrationID(ctx context.Context, integrationID string) error
	GetRepositoryIntegrationID(ctx context.Context) (string, error)
}

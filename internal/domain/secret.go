package domain

import "context"

type SecretRepository interface {
	SaveRepositoryIntegrationID(ctx context.Context, integrationID int64) error
	GetRepositoryIntegrationID(ctx context.Context) (int64, error)
}

package usecase

import (
	"context"

	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

type GitHubService interface {
	SaveInstallation(ctx context.Context, installationID int64) error
}

type gitHubService struct {
	secretRepo domain.SecretRepository
}

func NewGitHubService(
	secretRepo domain.SecretRepository,
) GitHubService {
	return &gitHubService{
		secretRepo: secretRepo,
	}
}

func (s *gitHubService) SaveInstallation(ctx context.Context, installationID int64) error {
	return s.secretRepo.SaveRepositoryIntegrationID(ctx, installationID)
}

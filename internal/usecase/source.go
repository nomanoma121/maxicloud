package usecase

import (
	"context"

	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

type SourceService interface {
	GetRepositories(ctx context.Context) ([]domain.Repository, error)
	GetBranches(ctx context.Context, repo domain.Repository) ([]string, error)
	GetHeadCommit(ctx context.Context, repo domain.Repository, branch string) (domain.Commit, error)
}

type sourceService struct {
	srcRepo domain.SourceRepository
}

func NewSourceService(srcRepo domain.SourceRepository) SourceService {
	return &sourceService{
		srcRepo: srcRepo,
	}
}

func (s *sourceService) GetRepositories(ctx context.Context) ([]domain.Repository, error) {
	return s.srcRepo.GetRepositories(ctx)
}

func (s *sourceService) GetBranches(ctx context.Context, repo domain.Repository) ([]string, error) {
	return s.srcRepo.GetBranches(ctx, repo)
}

func (s *sourceService) GetHeadCommit(ctx context.Context, repo domain.Repository, branch string) (domain.Commit, error) {
	return s.srcRepo.GetHeadCommit(ctx, repo, branch)
}

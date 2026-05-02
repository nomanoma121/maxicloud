package usecase

import (
	"context"

	"github.com/saitamau-maximum/maxicloud/internal/domain"
)

type DomainService interface {
	ListAvailableDomains(ctx context.Context) ([]string, error)
	CheckDomainAvailability(ctx context.Context, d domain.Domain) (bool, error)
}

type domainService struct {
	AvailableDomains []string
	appRepo          domain.ApplicationRepository
}

func NewDomainService() *domainService {
	return &domainService{}
}

func (s *domainService) ListAvailableDomains(ctx context.Context) ([]string, error) {
	return s.AvailableDomains, nil
}

// 現在管理しているアプリケーションがそのドメインを使用していないかどうかを確認する。
func (s *domainService) CheckDomainAvailability(ctx context.Context, d domain.Domain) (bool, error) {
	isAvailable, err := s.appRepo.ExistsByDomain(ctx, d.FQDN())
	if err != nil {
		return false, err
	}
	return !isAvailable, nil
}

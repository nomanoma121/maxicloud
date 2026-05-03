package handler

import (
	"context"

	v1 "github.com/saitamau-maximum/maxicloud/gen/maxicloud/v1"
	"github.com/saitamau-maximum/maxicloud/gen/maxicloud/v1/maxicloudv1connect"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
	"github.com/saitamau-maximum/maxicloud/internal/usecase"
)

type DomainHandler struct {
	maxicloudv1connect.UnimplementedDomainServiceHandler
	uc usecase.DomainService
}

func NewDomainHandler(domainService usecase.DomainService) *DomainHandler {
	return &DomainHandler{
		uc: domainService,
	}
}

func (h *DomainHandler) ListAvailableDomains(ctx context.Context, req *v1.ListAvailableDomainsRequest) (*v1.ListAvailableDomainsResponse, error) {
	domains, err := h.uc.ListAvailableDomains(ctx)
	if err != nil {
		return nil, err
	}
	return &v1.ListAvailableDomainsResponse{Domains: domains}, nil
}

func (h *DomainHandler) CheckDomainAvailability(ctx context.Context, req *v1.CheckDomainAvailabilityRequest) (*v1.CheckDomainAvailabilityResponse, error) {
	if req.Domain == nil {
		return &v1.CheckDomainAvailabilityResponse{Available: false}, nil
	}
	isAvailable, err := h.uc.CheckDomainAvailability(ctx, domain.Domain{
		Subdomain:  req.Domain.Subdomain,
		RootDomain: req.Domain.RootDomain,
	})
	if err != nil {
		return nil, err
	}
	return &v1.CheckDomainAvailabilityResponse{Available: isAvailable}, nil
}

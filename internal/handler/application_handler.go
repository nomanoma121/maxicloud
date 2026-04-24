package handler

import (
	"context"

	"connectrpc.com/connect"
	v1 "github.com/saitamau-maximum/maxicloud/gen/maxicloud/v1"
	"github.com/saitamau-maximum/maxicloud/gen/maxicloud/v1/maxicloudv1connect"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
	"github.com/saitamau-maximum/maxicloud/internal/usecase"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type ApplicationHandler struct {
	maxicloudv1connect.UnimplementedApplicationServiceHandler
	uc usecase.ApplicationService
}

func NewApplicationHandler(uc usecase.ApplicationService) *ApplicationHandler {
	return &ApplicationHandler{uc: uc}
}

func (h *ApplicationHandler) CreateApplication(ctx context.Context, req *connect.Request[v1.CreateApplicationRequest]) (*connect.Response[v1.CreateApplicationResponse], error) {
	spec := protoToApplicationSpec(req.Msg.Spec)
	app, err := h.uc.CreateApplication(ctx, spec, "")
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&v1.CreateApplicationResponse{Application: toProtoApplication(app)}), nil
}

func (h *ApplicationHandler) GetApplication(ctx context.Context, req *connect.Request[v1.GetApplicationRequest]) (*connect.Response[v1.GetApplicationResponse], error) {
	app, err := h.uc.GetApplication(ctx, req.Msg.ApplicationId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if app == nil {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}
	return connect.NewResponse(&v1.GetApplicationResponse{Application: toProtoApplication(app)}), nil
}

func (h *ApplicationHandler) ListApplications(ctx context.Context, req *connect.Request[v1.ListApplicationsRequest]) (*connect.Response[v1.ListApplicationsResponse], error) {
	apps, err := h.uc.ListApplications(ctx, req.Msg.ProjectId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	var protoApps []*v1.Application
	for i := range apps {
		protoApps = append(protoApps, toProtoApplication(&apps[i]))
	}
	return connect.NewResponse(&v1.ListApplicationsResponse{Applications: protoApps}), nil
}

func (h *ApplicationHandler) UpdateApplication(ctx context.Context, req *connect.Request[v1.UpdateApplicationRequest]) (*connect.Response[v1.UpdateApplicationResponse], error) {
	spec := protoToApplicationSpec(req.Msg.Spec)
	app, err := h.uc.UpdateApplication(ctx, req.Msg.ApplicationId, spec)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&v1.UpdateApplicationResponse{Application: toProtoApplication(app)}), nil
}

func (h *ApplicationHandler) DeleteApplication(ctx context.Context, req *connect.Request[v1.DeleteApplicationRequest]) (*connect.Response[v1.DeleteApplicationResponse], error) {
	if err := h.uc.DeleteApplication(ctx, req.Msg.ApplicationId); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&v1.DeleteApplicationResponse{}), nil
}

func toProtoApplication(a *domain.Application) *v1.Application {
	return &v1.Application{
		Id:          a.ID,
		ProjectId:   a.ProjectID,
		Name:        a.Name,
		OwnerUserId: a.OwnerID,
		Url:         a.URL,
		Source: &v1.ApplicationSource{
			RepositoryId:       a.Source.RepositoryID,
			RepositoryFullName: a.Source.RepositoryFullName,
			Branch:             a.Source.Branch,
		},
		CreatedAt: timestamppb.New(a.CreatedAt),
		UpdatedAt: timestamppb.New(a.UpdatedAt),
	}
}

func protoToApplicationSpec(s *v1.ApplicationSpec) domain.ApplicationSpec {
	if s == nil {
		return domain.ApplicationSpec{}
	}
	spec := domain.ApplicationSpec{
		ProjectID: s.ProjectId,
		Name:      s.Name,
	}
	if s.Source != nil {
		spec.Source = domain.ApplicationSource{
			RepositoryID:       s.Source.RepositoryId,
			RepositoryFullName: s.Source.RepositoryFullName,
			Branch:             s.Source.Branch,
		}
	}
	for _, kv := range s.EnvironmentVariables {
		spec.EnvironmentVariables = append(spec.EnvironmentVariables, domain.KeyValue{Key: kv.Key, Value: kv.Value})
	}
	for _, kv := range s.Secrets {
		spec.Secrets = append(spec.Secrets, domain.KeyValue{Key: kv.Key, Value: kv.Value})
	}
	return spec
}

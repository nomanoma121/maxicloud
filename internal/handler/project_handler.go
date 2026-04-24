package handler

import (
	"context"
	"time"

	"connectrpc.com/connect"
	v1 "github.com/saitamau-maximum/maxicloud/gen/maxicloud/v1"
	"github.com/saitamau-maximum/maxicloud/gen/maxicloud/v1/maxicloudv1connect"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
	"github.com/saitamau-maximum/maxicloud/internal/usecase"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type ProjectHandler struct {
	maxicloudv1connect.UnimplementedProjectServiceHandler
	uc usecase.ProjectUsecase
}

func NewProjectHandler(uc usecase.ProjectUsecase) *ProjectHandler {
	return &ProjectHandler{uc: uc}
}

func (h *ProjectHandler) CreateProject(ctx context.Context, req *connect.Request[v1.CreateProjectRequest]) (*connect.Response[v1.CreateProjectResponse], error) {
	project, err := h.uc.CreateProject(ctx, req.Msg.Name, req.Msg.Description, req.Msg.OwnerUserId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&v1.CreateProjectResponse{Project: toProtoProject(project)}), nil
}

func (h *ProjectHandler) GetProject(ctx context.Context, req *connect.Request[v1.GetProjectRequest]) (*connect.Response[v1.GetProjectResponse], error) {
	project, err := h.uc.GetProject(ctx, req.Msg.ProjectId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	if project == nil {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}
	return connect.NewResponse(&v1.GetProjectResponse{Project: toProtoProject(project)}), nil
}

func (h *ProjectHandler) ListProjects(ctx context.Context, req *connect.Request[v1.ListProjectsRequest]) (*connect.Response[v1.ListProjectsResponse], error) {
	projects, err := h.uc.ListProjects(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	var protoProjects []*v1.Project
	for _, p := range projects {
		protoProjects = append(protoProjects, toProtoProject(p))
	}
	return connect.NewResponse(&v1.ListProjectsResponse{Projects: protoProjects}), nil
}

func (h *ProjectHandler) UpdateProject(ctx context.Context, req *connect.Request[v1.UpdateProjectRequest]) (*connect.Response[v1.UpdateProjectResponse], error) {
	project, err := h.uc.UpdateProject(ctx, req.Msg.ProjectId, req.Msg.Name, req.Msg.Description, req.Msg.OwnerUserId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&v1.UpdateProjectResponse{Project: toProtoProject(project)}), nil
}

func (h *ProjectHandler) DeleteProject(ctx context.Context, req *connect.Request[v1.DeleteProjectRequest]) (*connect.Response[v1.DeleteProjectResponse], error) {
	if err := h.uc.DeleteProject(ctx, req.Msg.ProjectId); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return connect.NewResponse(&v1.DeleteProjectResponse{}), nil
}

func toProtoProject(p *domain.Project) *v1.Project {
	proj := &v1.Project{
		Id:          p.ID,
		Name:        p.Name,
		Description: p.Description,
		OwnerUserId: p.OwnerUserID,
	}
	if t, err := time.Parse(time.RFC3339, p.CreatedAt); err == nil {
		proj.CreatedAt = timestamppb.New(t)
	}
	if t, err := time.Parse(time.RFC3339, p.UpdatedAt); err == nil {
		proj.UpdatedAt = timestamppb.New(t)
	}
	return proj
}

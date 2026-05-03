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

type DeploymentHandler struct {
	maxicloudv1connect.UnimplementedDeploymentServiceHandler
	uc usecase.DeploymentService
}

func NewDeploymentHandler(deployService usecase.DeploymentService) *DeploymentHandler {
	return &DeploymentHandler{
		uc: deployService,
	}
}

func (h *DeploymentHandler) RetryDeployment(ctx context.Context, req *v1.RetryDeploymentRequest) (*v1.RetryDeploymentResponse, error) {
	deploy, err := h.uc.RetryDeployment(ctx, req.GetDeploymentId())
	if err != nil {
		return nil, toConnectError(err)
	}
	if deploy == nil {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}
	return &v1.RetryDeploymentResponse{Deployment: toProtoDeployment(deploy)}, nil
}

func (h *DeploymentHandler) GetDeployment(ctx context.Context, req *v1.GetDeploymentRequest) (*v1.GetDeploymentResponse, error) {
	deploy, err := h.uc.GetDeployment(ctx, req.GetDeploymentId())
	if err != nil {
		return nil, toConnectError(err)
	}
	if deploy == nil {
		return nil, connect.NewError(connect.CodeNotFound, nil)
	}
	return &v1.GetDeploymentResponse{Deployment: toProtoDeployment(deploy)}, nil
}

func (h *DeploymentHandler) ListDeployments(ctx context.Context, req *v1.ListDeploymentsRequest) (*v1.ListDeploymentsResponse, error) {
	deploys, err := h.uc.ListDeployments(ctx, req.GetApplicationId())
	if err != nil {
		return nil, toConnectError(err)
	}

	protoDeploys := make([]*v1.Deployment, 0, len(deploys))
	for i := range deploys {
		protoDeploys = append(protoDeploys, toProtoDeployment(&deploys[i]))
	}
	return &v1.ListDeploymentsResponse{Deployments: protoDeploys}, nil
}

func toProtoDeployment(d *domain.Deployment) *v1.Deployment {
	if d == nil {
		return nil
	}
	var finishedAt *timestamppb.Timestamp
	if d.FinishedAt != nil {
		finishedAt = timestamppb.New(*d.FinishedAt)
	}
	return &v1.Deployment{
		Id:            d.ID,
		ApplicationId: d.ApplicationID,
		OwnerUserId:   d.OwnerUserID,
		Commit: &v1.Commit{
			Sha:        d.Commit.SHA,
			Message:    d.Commit.Message,
			AuthorName: d.Commit.AuthorName,
			Timestamp:  timestamppb.New(d.Commit.Timestamp),
		},
		Status:     toProtoDeploymentStatus(d.Status),
		StartedAt:  timestamppb.New(d.StartedAt),
		FinishedAt: finishedAt,
	}
}

func toProtoDeploymentStatus(status domain.DeploymentStatus) v1.DeploymentStatus {
	switch status {
	case domain.DeploymentStatusQueued:
		return v1.DeploymentStatus_DEPLOYMENT_STATUS_RUNNING
	case domain.DeploymentStatusSucceeded:
		return v1.DeploymentStatus_DEPLOYMENT_STATUS_SUCCESS
	case domain.DeploymentStatusRunning:
		return v1.DeploymentStatus_DEPLOYMENT_STATUS_RUNNING
	case domain.DeploymentStatusFailed:
		return v1.DeploymentStatus_DEPLOYMENT_STATUS_FAILED
	default:
		return v1.DeploymentStatus_DEPLOYMENT_STATUS_UNSPECIFIED
	}
}

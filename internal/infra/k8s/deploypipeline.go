package k8s

import (
	"context"
	"fmt"
	"sort"
	"strconv"
	"time"

	maxicloudv1alpha1 "github.com/saitamau-maximum/maxicloud/api/v1alpha1"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

const (
	labelPipelineID  = "pipeline-id"
	labelAppID       = "app-id"
	labelOwnerUserID = "owner-user-id"
	labelPreview     = "preview"
)

type deploymentPipelineRepository struct {
	client client.Client
}

var _ domain.DeploymentPipelineRepository = (*deploymentPipelineRepository)(nil)

func NewDeploymentPipelineRepository(c client.Client) *deploymentPipelineRepository {
	return &deploymentPipelineRepository{client: c}
}

func (r *deploymentPipelineRepository) CreatePipeline(ctx context.Context, pipeline domain.DeploymentPipeline) (string, error) {
	var appList maxicloudv1alpha1.ApplicationList
	if err := r.client.List(ctx, &appList, client.MatchingLabels{"app-id": pipeline.ApplicationID}); err != nil {
		return "", fmt.Errorf("list applications: %w", err)
	}
	if len(appList.Items) == 0 {
		return "", fmt.Errorf("application not found: %s", pipeline.ApplicationID)
	}
	namespace := appList.Items[0].Namespace

	cr := &maxicloudv1alpha1.DeploymentPipeline{
		ObjectMeta: metav1.ObjectMeta{
			Name:      pipeline.ID,
			Namespace: namespace,
			Labels: map[string]string{
				labelPipelineID:  pipeline.ID,
				labelAppID:       pipeline.ApplicationID,
				labelOwnerUserID: pipeline.OwnerUserID,
				labelPreview:     strconv.FormatBool(pipeline.PRNumber != nil),
			},
		},
		Spec: maxicloudv1alpha1.DeploymentPipelineSpec{
			ApplicationName: pipeline.ApplicationID,
			Owner:           pipeline.Repo.Owner,
			Repo:            pipeline.Repo.Name,
			SHA:             pipeline.Commit.SHA,
			PRNumber:        pipeline.PRNumber,
		},
	}
	if err := r.client.Create(ctx, cr); err != nil {
		return "", fmt.Errorf("create deployment pipeline: %w", err)
	}
	return pipeline.ID, nil
}

func (r *deploymentPipelineRepository) GetPipeline(ctx context.Context, id string) (*domain.DeploymentPipeline, error) {
	var list maxicloudv1alpha1.DeploymentPipelineList
	if err := r.client.List(ctx, &list, client.MatchingLabels{labelPipelineID: id}); err != nil {
		return nil, fmt.Errorf("list deployment pipelines: %w", err)
	}
	if len(list.Items) == 0 {
		return nil, nil
	}
	return crToPipeline(&list.Items[0]), nil
}

func (r *deploymentPipelineRepository) DeleteOldPipelines(ctx context.Context, applicationID string, maxHistory int, isPreview bool) error {
	var list maxicloudv1alpha1.DeploymentPipelineList
	if err := r.client.List(ctx, &list, client.MatchingLabels{labelAppID: applicationID, labelPreview: strconv.FormatBool(isPreview)}); err != nil {
		return fmt.Errorf("list deployment pipelines: %w", err)
	}
	type itemWithTime struct {
		cr   maxicloudv1alpha1.DeploymentPipeline
		time time.Time
	}
	items := filterByPreview(list, isPreview)
	if len(items) <= maxHistory {
		return nil
	}
	// 古い順にソート
	sort.Slice(items, func(i, j int) bool {
		// StartedAtはnilの可能性があるので、CreationTimestampで比較する
		return items[i].CreationTimestamp.Time.Before(items[j].CreationTimestamp.Time)
	})
	// maxHistory件を残して古いものから削除
	for i := 0; i < len(items)-maxHistory; i++ {
		if err := r.client.Delete(ctx, &items[i]); err != nil {
			return fmt.Errorf("delete old deployment pipeline: %w", err)
		}
	}
	return nil
}

func filterByPreview(list maxicloudv1alpha1.DeploymentPipelineList, isPreview bool) []maxicloudv1alpha1.DeploymentPipeline {
	var result []maxicloudv1alpha1.DeploymentPipeline
	for _, p := range list.Items {
		if isPreview && p.Spec.PRNumber != nil {
			result = append(result, p)
		}
		if !isPreview && p.Spec.PRNumber == nil {
			result = append(result, p)
		}
	}
	return result
}

func crToPipeline(cr *maxicloudv1alpha1.DeploymentPipeline) *domain.DeploymentPipeline {
	var startedAt time.Time
	if cr.Status.StartedAt != nil {
		startedAt = cr.Status.StartedAt.Time
	}
	var finishedAt *time.Time
	if cr.Status.FinishedAt != nil {
		t := cr.Status.FinishedAt.Time
		finishedAt = &t
	}
	return &domain.DeploymentPipeline{
		ID:            cr.Labels[labelPipelineID],
		ApplicationID: cr.Spec.ApplicationName,
		OwnerUserID:   cr.Labels[labelOwnerUserID],
		Repo: domain.Repository{
			Owner: cr.Spec.Owner,
			Name:  cr.Spec.Repo,
		},
		Commit: domain.Commit{
			SHA: cr.Spec.SHA,
		},
		PRNumber:   cr.Spec.PRNumber,
		Status:     phaseToStatus(cr.Status.Phase),
		StartedAt:  startedAt,
		FinishedAt: finishedAt,
	}
}

func phaseToStatus(phase maxicloudv1alpha1.DeploymentPipelinePhase) domain.DeploymentStatus {
	switch phase {
	case maxicloudv1alpha1.DeploymentPipelinePhaseBuilding, maxicloudv1alpha1.DeploymentPipelinePhaseDeploying:
		return domain.DeploymentStatusRunning
	case maxicloudv1alpha1.DeploymentPipelinePhaseSucceeded:
		return domain.DeploymentStatusSucceeded
	case maxicloudv1alpha1.DeploymentPipelinePhaseFailed:
		return domain.DeploymentStatusFailed
	default:
		return domain.DeploymentStatusQueued
	}
}

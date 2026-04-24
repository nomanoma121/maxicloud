package k8s

import (
	"context"
	"fmt"

	maxicloudv1alpha1 "github.com/saitamau-maximum/maxicloud/api/v1alpha1"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

type applicationRepository struct {
	client.Client
}

var _ domain.ApplicationRepository = (*applicationRepository)(nil)

func NewApplicationRepository(c client.Client) *applicationRepository {
	return &applicationRepository{Client: c}
}

func (r *applicationRepository) CreateApplication(ctx context.Context, app domain.Application) (*domain.Application, error) {
	cr := r.newApplication()
	return crToApplication(cr), r.Create(ctx, cr)
}

func (r *applicationRepository) newApplication() *maxicloudv1alpha1.Application {
	return &maxicloudv1alpha1.Application{}
}

func (r *applicationRepository) GetApplication(ctx context.Context, id string) (*domain.Application, error) {
	var list maxicloudv1alpha1.ApplicationList
	if err := r.List(ctx, &list, client.MatchingLabels{"app-id": id}); err != nil {
		return nil, fmt.Errorf("list applications: %w", err)
	}
	if len(list.Items) == 0 {
		return nil, nil
	}
	return crToApplication(&list.Items[0]), nil
}

func (r *applicationRepository) ListApplications(ctx context.Context, projectID string) ([]domain.Application, error) {
	var list maxicloudv1alpha1.ApplicationList
	opts := []client.ListOption{}
	if projectID != "" {
		opts = append(opts, client.InNamespace(projectID))
	}
	if err := r.List(ctx, &list, opts...); err != nil {
		return nil, fmt.Errorf("list applications: %w", err)
	}
	apps := make([]domain.Application, 0, len(list.Items))
	for i := range list.Items {
		apps = append(apps, *crToApplication(&list.Items[i]))
	}
	return apps, nil
}

func (r *applicationRepository) UpdateApplication(ctx context.Context, app domain.Application) error {
	var list maxicloudv1alpha1.ApplicationList
	if err := r.List(ctx, &list, client.MatchingLabels{"app-id": app.ID}); err != nil {
		return fmt.Errorf("list applications: %w", err)
	}
	if len(list.Items) == 0 {
		return fmt.Errorf("application not found: %s", app.ID)
	}
	cr := list.Items[0]
	cr.Labels["app-name"] = app.Name
	cr.Labels["owner-user-id"] = app.OwnerID
	return r.Update(ctx, &cr)
}

func (r *applicationRepository) DeleteApplication(ctx context.Context, id string) error {
	var list maxicloudv1alpha1.ApplicationList
	if err := r.List(ctx, &list, client.MatchingLabels{"app-id": id}); err != nil {
		return fmt.Errorf("list applications: %w", err)
	}
	if len(list.Items) == 0 {
		return nil
	}
	return client.IgnoreNotFound(r.Delete(ctx, &list.Items[0]))
}

func crToApplication(cr *maxicloudv1alpha1.Application) *domain.Application {
	return &domain.Application{
		ID:        cr.Name,
		ProjectID: cr.Namespace,
		Name:      cr.Labels["app-name"],
		OwnerID:   cr.Labels["owner-user-id"],
		URL:       cr.Status.URL,
		CreatedAt: cr.CreationTimestamp.Time,
		UpdatedAt: cr.CreationTimestamp.Time,
	}
}

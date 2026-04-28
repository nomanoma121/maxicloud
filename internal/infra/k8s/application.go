package k8s

import (
	"context"
	"fmt"

	maxicloudv1alpha1 "github.com/saitamau-maximum/maxicloud/api/v1alpha1"
	"github.com/saitamau-maximum/maxicloud/internal/config"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

const (
	labelApplicationID    = config.LabelPrefix + "app-id"
	labelApplicationName  = config.LabelPrefix + "app-name"
	labelApplicationOwner = config.LabelPrefix + "owner-user-id"
	labelSourceRepoOwner  = config.LabelPrefix + "source-repo-owner"
	labelSourceRepoName   = config.LabelPrefix + "source-repo-name"
	labelSourceBranch     = config.LabelPrefix + "source-branch"
)

type applicationRepository struct {
	client.Client
}

var _ domain.ApplicationRepository = (*applicationRepository)(nil)

func NewApplicationRepository(c client.Client) domain.ApplicationRepository {
	return &applicationRepository{Client: c}
}

func (r *applicationRepository) CreateApplication(ctx context.Context, app domain.Application) (*domain.Application, error) {
	cr := &maxicloudv1alpha1.Application{
		ObjectMeta: metav1.ObjectMeta{
			GenerateName: app.Name + "-",
			Namespace:    app.ProjectID,
			Labels: map[string]string{
				labelApplicationName:  app.Name,
				labelApplicationOwner: app.OwnerID,
				labelSourceRepoOwner:  app.Source.Repo.Owner,
				labelSourceRepoName:   app.Source.Repo.Name,
				labelSourceBranch:     app.Source.Branch,
			},
		},
	}
	if err := r.Create(ctx, cr); err != nil {
		return nil, fmt.Errorf("create application: %w", err)
	}
	cr.Labels[labelApplicationID] = cr.Name
	if err := r.Update(ctx, cr); err != nil {
		return nil, fmt.Errorf("set app-id label: %w", err)
	}
	return crToApplication(cr), nil
}

func (r *applicationRepository) GetApplication(ctx context.Context, id string) (*domain.Application, error) {
	var list maxicloudv1alpha1.ApplicationList
	if err := r.List(ctx, &list, client.MatchingLabels{labelApplicationID: id}); err != nil {
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
	if err := r.List(ctx, &list, client.MatchingLabels{labelApplicationID: app.ID}); err != nil {
		return fmt.Errorf("list applications: %w", err)
	}
	if len(list.Items) == 0 {
		return fmt.Errorf("application not found: %s", app.ID)
	}
	cr := list.Items[0]
	cr.Labels[labelApplicationName] = app.Name
	cr.Labels[labelApplicationOwner] = app.OwnerID
	return r.Update(ctx, &cr)
}

func (r *applicationRepository) DeleteApplication(ctx context.Context, id string) error {
	var list maxicloudv1alpha1.ApplicationList
	if err := r.List(ctx, &list, client.MatchingLabels{labelApplicationID: id}); err != nil {
		return fmt.Errorf("list applications: %w", err)
	}
	if len(list.Items) == 0 {
		return nil
	}
	return client.IgnoreNotFound(r.Delete(ctx, &list.Items[0]))
}

func (r *applicationRepository) GetApplicationsByRepo(ctx context.Context, owner, name, branch string) ([]domain.Application, error) {
	matchLabels := client.MatchingLabels{
		labelSourceRepoOwner: owner,
		labelSourceRepoName:  name,
	}
	if branch != "" {
		matchLabels[labelSourceBranch] = branch
	}
	var list maxicloudv1alpha1.ApplicationList
	if err := r.List(ctx, &list, matchLabels); err != nil {
		return nil, fmt.Errorf("list applications by repo: %w", err)
	}
	apps := make([]domain.Application, 0, len(list.Items))
	for i := range list.Items {
		apps = append(apps, *crToApplication(&list.Items[i]))
	}
	return apps, nil
}

func crToApplication(cr *maxicloudv1alpha1.Application) *domain.Application {
	return &domain.Application{
		ID:        cr.Name,
		ProjectID: cr.Namespace,
		Name:      cr.Labels[labelApplicationName],
		OwnerID:   cr.Labels[labelApplicationOwner],
		Source: domain.ApplicationSource{
			Repo: domain.Repository{
				Owner: cr.Labels[labelSourceRepoOwner],
				Name:  cr.Labels[labelSourceRepoName],
			},
			Branch: cr.Labels[labelSourceBranch],
		},
		URL:       cr.Status.URL,
		CreatedAt: cr.CreationTimestamp.Time,
		UpdatedAt: cr.CreationTimestamp.Time,
	}
}

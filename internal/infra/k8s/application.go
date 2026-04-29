package k8s

import (
	"context"
	"crypto/sha1"
	"fmt"
	"regexp"
	"strings"

	maxicloudv1alpha1 "github.com/saitamau-maximum/maxicloud/api/v1alpha1"
	"github.com/saitamau-maximum/maxicloud/internal/config"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
	corev1 "k8s.io/api/core/v1"
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

	annotationSourceBranch = config.AnnotationPrefix + "source-branch"
)

type applicationRepository struct {
	client.Client
}

var _ domain.ApplicationRepository = (*applicationRepository)(nil)

func NewApplicationRepository(c client.Client) domain.ApplicationRepository {
	return &applicationRepository{Client: c}
}

func (r *applicationRepository) CreateApplication(ctx context.Context, app domain.CreateApplicationParams) (*domain.Application, error) {
	branchLabel := normalizeBranchForLabel(app.Spec.Source.Branch)
	cr := &maxicloudv1alpha1.Application{
		ObjectMeta: metav1.ObjectMeta{
			GenerateName: app.Name + "-",
			Namespace:    projectNamespace(app.Spec.ProjectID),
			Labels: map[string]string{
				labelApplicationName:  app.Name,
				labelApplicationOwner: app.OwnerID,
				labelSourceRepoOwner:  app.Spec.Source.Repo.Owner,
				labelSourceRepoName:   app.Spec.Source.Repo.Name,
				labelSourceBranch:     branchLabel,
			},
			Annotations: map[string]string{
				annotationSourceBranch: app.Spec.Source.Branch,
			},
		},
		Spec: maxicloudv1alpha1.ApplicationSpec{
			Env: buildApplicationEnvVar(app.Spec),
		},
	}
	if app.Spec.Domain != nil {
		cr.Spec.Expose.Domain = app.Spec.Domain.FullDomain()
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
		opts = append(opts, client.InNamespace(projectNamespace(projectID)))
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
		matchLabels[labelSourceBranch] = normalizeBranchForLabel(branch)
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
		ProjectID: projectIDFromNamespace(cr.Namespace),
		Name:      cr.Labels[labelApplicationName],
		OwnerID:   cr.Labels[labelApplicationOwner],
		Source: domain.ApplicationSource{
			Repo: domain.Repository{
				Owner: cr.Labels[labelSourceRepoOwner],
				Name:  cr.Labels[labelSourceRepoName],
			},
			Branch: cr.Annotations[annotationSourceBranch],
		},
		URL:       cr.Status.URL,
		CreatedAt: cr.CreationTimestamp.Time,
		UpdatedAt: cr.CreationTimestamp.Time,
	}
}

func buildApplicationEnvVar(spec domain.ApplicationSpec) []corev1.EnvVar {
	env := make([]corev1.EnvVar, 0, len(spec.EnvironmentVariables)+len(spec.Secrets))
	for _, kv := range spec.EnvironmentVariables {
		env = append(env, corev1.EnvVar{
			Name:  kv.Key,
			Value: kv.Value,
		})
	}
	for _, kv := range spec.Secrets {
		env = append(env, corev1.EnvVar{
			Name:  kv.Key,
			Value: kv.Value,
		})
	}
	return env
}

var nonLabelChar = regexp.MustCompile(`[^A-Za-z0-9._-]+`)
var edgeNonAlnum = regexp.MustCompile(`^[^A-Za-z0-9]+|[^A-Za-z0-9]+$`)

// Labelには/を使用することができないため正規化する
func normalizeBranchForLabel(branch string) string {
	const (
		maxLabelLen = 63
		hashBytes   = 4
	)

	raw := strings.TrimSpace(branch)
	normalized := nonLabelChar.ReplaceAllString(raw, "-")
	normalized = edgeNonAlnum.ReplaceAllString(normalized, "")
	if normalized == "" {
		normalized = "branch"
	}

	sum := sha1.Sum([]byte(raw))
	suffix := fmt.Sprintf("-%x", sum[:hashBytes])
	maxBaseLen := maxLabelLen - len(suffix)
	if maxBaseLen < 1 {
		maxBaseLen = 1
	}

	if len(normalized) > maxBaseLen {
		normalized = normalized[:maxBaseLen]
		normalized = edgeNonAlnum.ReplaceAllString(normalized, "")
	}

	return normalized + suffix
}

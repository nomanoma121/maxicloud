package k8s

import (
	"context"
	"fmt"

	"github.com/saitamau-maximum/maxicloud/internal/gateway/domain"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

const projectLabelKey = "maxicloud.saitamau-maximum.github.io/project"

const (
	OwnerUserIDLabelKey = "owner-user-id"
	ProjectNameLabelKey = "project-name"

	ProjectDescriptionAnnotationKey = "project-description"
	CreatedAtAnnotationKey          = "created-at"
	UpdatedAtAnnotationKey          = "updated-at"
)

type projectRepository struct {
	client.Client
}

var _ domain.ProjectRepository = (*projectRepository)(nil)

func NewProjectRepository(c client.Client) *projectRepository {
	return &projectRepository{Client: c}
}

func (r *projectRepository) CreateProject(ctx context.Context, project domain.Project) (string, error) {
	ns := &corev1.Namespace{
		ObjectMeta: metav1.ObjectMeta{
			Name: project.ID,
			Labels: map[string]string{
				projectLabelKey: "true",
				// OwnerUserID, ProjectNameは検索のためにラベルにする
				OwnerUserIDLabelKey: project.OwnerUserID,
				ProjectNameLabelKey:  project.Name,
			},
			Annotations: map[string]string{
				ProjectDescriptionAnnotationKey: project.Description,
				CreatedAtAnnotationKey:          project.CreatedAt,
				UpdatedAtAnnotationKey:          project.UpdatedAt,
			},
		},
	}
	if err := r.Create(ctx, ns); err != nil {
		return "", fmt.Errorf("create namespace: %w", err)
	}
	return ns.Name, nil
}

func (r *projectRepository) GetProject(ctx context.Context, id string) (*domain.Project, error) {
	var ns corev1.Namespace
	if err := r.Get(ctx, client.ObjectKey{Name: id}, &ns); err != nil {
		return nil, client.IgnoreNotFound(err)
	}
	return nsToProject(&ns), nil
}

func (r *projectRepository) ListProjects(ctx context.Context) ([]*domain.Project, error) {
	var nsList corev1.NamespaceList
	if err := r.List(ctx, &nsList, client.MatchingLabels{projectLabelKey: "true"}); err != nil {
		return nil, fmt.Errorf("list namespaces: %w", err)
	}
	projects := make([]*domain.Project, 0, len(nsList.Items))
	for i := range nsList.Items {
		projects = append(projects, nsToProject(&nsList.Items[i]))
	}
	return projects, nil
}

func (r *projectRepository) UpdateProject(ctx context.Context, project domain.Project) error {
	var ns corev1.Namespace
	if err := r.Get(ctx, client.ObjectKey{Name: project.ID}, &ns); err != nil {
		return fmt.Errorf("get namespace: %w", err)
	}
	ns.Labels[OwnerUserIDLabelKey] = project.OwnerUserID
	ns.Labels[ProjectNameLabelKey] = project.Name
	if ns.Annotations == nil {
		ns.Annotations = make(map[string]string)
	}
	ns.Annotations[ProjectDescriptionAnnotationKey] = project.Description
	ns.Annotations[UpdatedAtAnnotationKey] = project.UpdatedAt
	return r.Update(ctx, &ns)
}

func (r *projectRepository) DeleteProject(ctx context.Context, id string) error {
	ns := &corev1.Namespace{ObjectMeta: metav1.ObjectMeta{Name: id}}
	return client.IgnoreNotFound(r.Delete(ctx, ns))
}

func nsToProject(ns *corev1.Namespace) *domain.Project {
	return &domain.Project{
		ID:          ns.Name,
		Name:        ns.Labels[ProjectNameLabelKey],
		Description: ns.Annotations[ProjectDescriptionAnnotationKey],
		OwnerUserID: ns.Labels[OwnerUserIDLabelKey],
		CreatedAt:   ns.Annotations[CreatedAtAnnotationKey],
		UpdatedAt:   ns.Annotations[UpdatedAtAnnotationKey],
	}
}

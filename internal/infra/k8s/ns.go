package k8s

import (
	"context"
	"fmt"
	"time"

	"github.com/saitamau-maximum/maxicloud/internal/config"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

const (
	NamespacePrefix = "maxicloud-"

	projectLabelKey = config.LabelPrefix + "project"

	OwnerUserIDLabelKey = config.LabelPrefix + "owner-user-id"
	ProjectNameLabelKey = config.LabelPrefix + "project-name"

	ProjectDescriptionAnnotationKey = config.AnnotationPrefix + "project-description"
	CreatedAtAnnotationKey          = config.AnnotationPrefix + "created-at"
	UpdatedAtAnnotationKey          = config.AnnotationPrefix + "updated-at"
)

type projectRepository struct {
	client.Client
}

var _ domain.ProjectRepository = (*projectRepository)(nil)

func NewProjectRepository(c client.Client) domain.ProjectRepository {
	return &projectRepository{Client: c}
}

func (r *projectRepository) CreateProject(ctx context.Context, project domain.Project) (string, error) {
	ns := &corev1.Namespace{
		ObjectMeta: metav1.ObjectMeta{
			Name: NamespacePrefix + project.ID,
			Labels: map[string]string{
				projectLabelKey:     "true",
				OwnerUserIDLabelKey: project.OwnerUserID,
				ProjectNameLabelKey: project.Name,
			},
			Annotations: map[string]string{
				ProjectDescriptionAnnotationKey: project.Description,
				CreatedAtAnnotationKey:          project.CreatedAt.Format(time.RFC3339),
				UpdatedAtAnnotationKey:          project.UpdatedAt.Format(time.RFC3339),
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
	if err := r.Get(ctx, client.ObjectKey{Name: NamespacePrefix + id}, &ns); err != nil {
		return nil, client.IgnoreNotFound(err)
	}
	return nsToProject(&ns)
}

func (r *projectRepository) ListProjects(ctx context.Context) ([]*domain.Project, error) {
	var nsList corev1.NamespaceList
	if err := r.List(ctx, &nsList, client.MatchingLabels{projectLabelKey: "true"}); err != nil {
		return nil, fmt.Errorf("list namespaces: %w", err)
	}
	projects := make([]*domain.Project, 0, len(nsList.Items))
	for i := range nsList.Items {
		project, err := nsToProject(&nsList.Items[i])
		if err != nil {
			return nil, fmt.Errorf("convert namespace to project: %w", err)
		}
		projects = append(projects, project)
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
	ns.Annotations[UpdatedAtAnnotationKey] = project.UpdatedAt.Format(time.RFC3339)
	return r.Update(ctx, &ns)
}

func (r *projectRepository) DeleteProject(ctx context.Context, id string) error {
	ns := &corev1.Namespace{ObjectMeta: metav1.ObjectMeta{Name: id}}
	return client.IgnoreNotFound(r.Delete(ctx, ns))
}

func nsToProject(ns *corev1.Namespace) (*domain.Project, error) {
	createdAt, err := time.Parse(time.RFC3339, ns.Annotations[CreatedAtAnnotationKey])
	if err != nil {
		return nil, fmt.Errorf("parse createdAt: %w", err)
	}
	updatedAt, err := time.Parse(time.RFC3339, ns.Annotations[UpdatedAtAnnotationKey])
	if err != nil {
		return nil, fmt.Errorf("parse updatedAt: %w", err)
	}
	return &domain.Project{
		ID:          ns.Name,
		Name:        ns.Labels[ProjectNameLabelKey],
		OwnerUserID: ns.Labels[OwnerUserIDLabelKey],
		Description: ns.Annotations[ProjectDescriptionAnnotationKey],
		CreatedAt:   createdAt,
		UpdatedAt:   updatedAt,
	}, nil
}

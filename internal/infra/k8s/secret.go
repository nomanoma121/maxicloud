package k8s

import (
	"context"
	"fmt"

	"github.com/saitamau-maximum/maxicloud/internal/config"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

type secretRepository struct {
	client    client.Client
	namespace string
}

var _ domain.SecretRepository = (*secretRepository)(nil)

func NewSecretRepository(c client.Client, namespace string) domain.SecretRepository {
	return &secretRepository{client: c, namespace: namespace}
}

func (s *secretRepository) GetRepositoryIntegrationID(ctx context.Context) (string, error) {
	var secret corev1.Secret
	if err := s.client.Get(ctx, types.NamespacedName{Name: config.SecretName, Namespace: s.namespace}, &secret); err != nil {
		return "", fmt.Errorf("get secret: %w", err)
	}
	return string(secret.Data[config.InstallationIDKey]), nil
}

func (s *secretRepository) SaveRepositoryIntegrationID(ctx context.Context, integrationID string) error {
	var secret corev1.Secret
	err := s.client.Get(ctx, types.NamespacedName{Name: config.SecretName, Namespace: s.namespace}, &secret)
	if client.IgnoreNotFound(err) != nil {
		return fmt.Errorf("get secret: %w", err)
	}
	if err != nil {
		return s.client.Create(ctx, &corev1.Secret{
			ObjectMeta: metav1.ObjectMeta{
				Name:      config.SecretName,
				Namespace: s.namespace,
			},
			Data: map[string][]byte{
				config.InstallationIDKey: []byte(integrationID),
			},
		})
	}
	secret.Data[config.InstallationIDKey] = []byte(integrationID)
	return s.client.Update(ctx, &secret)
}

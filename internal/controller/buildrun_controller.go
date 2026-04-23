/*
Copyright 2026.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package controller

import (
	"context"
	"fmt"
	"strconv"

	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/types"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	logf "sigs.k8s.io/controller-runtime/pkg/log"

	maxicloudv1alpha1 "github.com/saitamau-maximum/maxicloud/api/v1alpha1"
	"github.com/saitamau-maximum/maxicloud/internal/config"
	"github.com/saitamau-maximum/maxicloud/internal/github"
	batchv1 "k8s.io/api/batch/v1"
)

type BuildRunReconcilerConfig struct {
	// Applicattionごとに保持するBuildRunの履歴の最大数
	MaxHistory int
}

type BuildRunReconciler struct {
	client.Client
	Scheme       *runtime.Scheme
	Registry     Registry
	GitHubClient github.Client
	Config       BuildRunReconcilerConfig
}

// +kubebuilder:rbac:groups=maxicloud.maximum.vc,resources=buildruns,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=maxicloud.maximum.vc,resources=buildruns/status,verbs=get;update;patch
// +kubebuilder:rbac:groups=maxicloud.maximum.vc,resources=buildruns/finalizers,verbs=update

func (r *BuildRunReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	log := logf.FromContext(ctx)

	var buildRun maxicloudv1alpha1.BuildRun
	if err := r.Get(ctx, req.NamespacedName, &buildRun); err != nil {
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}

	if err := r.reconcileSecret(ctx, &buildRun); err != nil {
		log.Error(err, "failed to reconcile secret")
		return ctrl.Result{}, err
	}

	if err := r.reconcileJob(ctx, &buildRun); err != nil {
		log.Error(err, "failed to reconcile job")
		return ctrl.Result{}, err
	}

	if err := r.cleanupOldJobs(ctx, &buildRun); err != nil {
		log.Error(err, "failed to cleanup old jobs")
		return ctrl.Result{}, err
	}

	return ctrl.Result{}, nil
}

func (r *BuildRunReconciler) reconcileSecret(ctx context.Context, buildRun *maxicloudv1alpha1.BuildRun) error {
	log := logf.FromContext(ctx)

	installationID, err := getInstallationID(ctx, r.Client, buildRun.Namespace)
	if err != nil {
		return fmt.Errorf("failed to get installation ID: %w", err)
	}
	token, err := r.GitHubClient.GetInstallationAccessToken(ctx, installationID)
	if err != nil {
		log.Error(err, "failed to get installation access token", "installationID", installationID)
		return err
	}

	secret := &corev1.Secret{}
	key := types.NamespacedName{Name: config.SecretName, Namespace: buildRun.Namespace}
	err = r.Get(ctx, key, secret)
	if errors.IsNotFound(err) {
		return r.Create(ctx, newBuildRunSecret(buildRun, r.Registry.DockerConfig(), token))
	}
	if err != nil {
		log.Error(err, "failed to get repo secret", "secret", config.SecretName)
		return err
	}

	secret.Data[config.InstallationAccessTokenKey] = []byte(token)
	secret.Data[corev1.DockerConfigJsonKey] = []byte(r.Registry.DockerConfig())
	return r.Update(ctx, secret)
}

func (r *BuildRunReconciler) reconcileJob(ctx context.Context, buildRun *maxicloudv1alpha1.BuildRun) error {
	owner, repo, err := github.ParseRepoURL(buildRun.Spec.Source.RepoURL)
	if err != nil {
		return fmt.Errorf("failed to parse repository URL: %w", err)
	}
	destination := fmt.Sprintf("%s/%s:%s", r.Registry.Host(), repo, github.ShortSHA(buildRun.Spec.Source.SHA))

	var job batchv1.Job
	if err := r.Get(ctx, types.NamespacedName{Name: buildRun.Name, Namespace: buildRun.Namespace}, &job); err != nil {
		if errors.IsNotFound(err) {
			return r.Create(ctx, newBuildJob(BuildJobParams{
				buildRun:       buildRun,
				jobName:        buildRun.Name,
				sha:            buildRun.Spec.Source.SHA,
				repoSecretName: config.SecretName,
				owner:          owner,
				repo:           repo,
				destination:    destination,
			}))
		}
		return err
	}
	return nil
}

func (r *BuildRunReconciler) cleanupOldJobs(ctx context.Context, buildRun *maxicloudv1alpha1.BuildRun) error {
	appName, ok := buildRun.Labels[config.ApplicationLabelKey]
	if !ok {
		return nil
	}

	var jobList batchv1.JobList
	if err := r.List(ctx, &jobList, client.InNamespace(buildRun.Namespace), client.MatchingLabels{config.ApplicationLabelKey: appName}); err != nil {
		return fmt.Errorf("failed to list jobs: %w", err)
	}

	if len(jobList.Items) <= r.Config.MaxHistory {
		return nil
	}

	for i := 0; i < len(jobList.Items)-r.Config.MaxHistory; i++ {
		job := jobList.Items[i]
		if err := r.Delete(ctx, &job); err != nil {
			return fmt.Errorf("failed to delete old job %s: %w", job.Name, err)
		}
	}
	return nil
}

func getInstallationID(ctx context.Context, k8sClient client.Client, namespace string) (int64, error) {
	var secret corev1.Secret
	if err := k8sClient.Get(ctx, types.NamespacedName{Name: config.SecretName, Namespace: namespace}, &secret); err != nil {
		return 0, fmt.Errorf("failed to get installation ID secret: %w", err)
	}
	return strconv.ParseInt(string(secret.Data[config.InstallationIDKey]), 10, 64)
}

// SetupWithManager sets up the controller with the Manager.
func (r *BuildRunReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&maxicloudv1alpha1.BuildRun{}).
		Named("buildrun").
		Owns(&corev1.Secret{}).
		Owns(&batchv1.Job{}).
		Complete(r)
}

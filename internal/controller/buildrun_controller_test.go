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

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/reconcile"

	maxicloudv1alpha1 "github.com/saitamau-maximum/maxicloud/api/v1alpha1"
	"github.com/saitamau-maximum/maxicloud/internal/config"

	gh "github.com/google/go-github/v72/github"
	githubpkg "github.com/saitamau-maximum/maxicloud/internal/github"
)

type fakeRegistry struct{}

func (f *fakeRegistry) DockerConfig() string { return `{"auths":{}}` }
func (f *fakeRegistry) Host() string         { return "ghcr.io/test" }
func (f *fakeRegistry) Token() string        { return "token" }

type fakeGitHubClient struct{}

func (f *fakeGitHubClient) GetInstallationAccessToken(_ context.Context, _ int64) (string, error) {
	return "fake-token", nil
}
func (f *fakeGitHubClient) CreateCheckRun(_ context.Context, _ githubpkg.CreateCheckRunParams) (int64, error) {
	return 0, nil
}
func (f *fakeGitHubClient) UpdateCheckRun(_ context.Context, _ githubpkg.UpdateCheckRunParams) error {
	return nil
}
func (f *fakeGitHubClient) GetIssueComment(_ context.Context, _ int64, _, _ string, _ int64) (*gh.IssueComment, error) {
	return nil, nil
}
func (f *fakeGitHubClient) CreateIssueComment(_ context.Context, _ githubpkg.CreateIssueCommentParams) (int64, error) {
	return 0, nil
}
func (f *fakeGitHubClient) UpdateIssueComment(_ context.Context, _ githubpkg.UpdateIssueCommentParams) error {
	return nil
}

// helpers

func newTestReconciler(maxHistory int) *BuildRunReconciler {
	return &BuildRunReconciler{
		Client:       k8sClient,
		Scheme:       k8sClient.Scheme(),
		Registry:     &fakeRegistry{},
		GitHubClient: &fakeGitHubClient{},
		Config:       BuildRunReconcilerConfig{MaxHistory: maxHistory},
	}
}

func createInstallationSecret(ctx context.Context, namespace string) {
	secret := &corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name:      config.SecretName,
			Namespace: namespace,
		},
		Data: map[string][]byte{
			config.InstallationIDKey: []byte("12345"),
		},
	}
	_ = k8sClient.Create(ctx, secret)
}

func newTestBuildRun(name, namespace, appName string) *maxicloudv1alpha1.BuildRun {
	labels := map[string]string{}
	if appName != "" {
		labels[config.ApplicationLabelKey] = appName
	}
	return &maxicloudv1alpha1.BuildRun{
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
			Labels:    labels,
		},
		Spec: maxicloudv1alpha1.BuildRunSpec{
			Source: maxicloudv1alpha1.BuildSource{
				RepoURL: "https://github.com/saitamau-maximum/maxicloud",
				SHA:     "abc1234567890",
			},
		},
	}
}

var _ = Describe("BuildRun Controller", func() {
	ctx := context.Background()
	const ns = "default"

	BeforeEach(func() {
		createInstallationSecret(ctx, ns)
	})

	AfterEach(func() {
		_ = k8sClient.Delete(ctx, &corev1.Secret{
			ObjectMeta: metav1.ObjectMeta{Name: config.SecretName, Namespace: ns},
		})
	})

	Context("Jobの作成", func() {
		const name = "buildrun-job-create"

		BeforeEach(func() {
			Expect(k8sClient.Create(ctx, newTestBuildRun(name, ns, "my-app"))).To(Succeed())
		})

		AfterEach(func() {
			_ = k8sClient.Delete(ctx, &maxicloudv1alpha1.BuildRun{
				ObjectMeta: metav1.ObjectMeta{Name: name, Namespace: ns},
			})
		})

		It("ReconcileでJobが作成される", func() {
			r := newTestReconciler(3)
			_, err := r.Reconcile(ctx, reconcile.Request{
				NamespacedName: types.NamespacedName{Name: name, Namespace: ns},
			})
			Expect(err).NotTo(HaveOccurred())

			var job batchv1.Job
			Expect(k8sClient.Get(ctx, types.NamespacedName{Name: name, Namespace: ns}, &job)).To(Succeed())
		})

		It("2回Reconcileしても重複してJobが作られない", func() {
			r := newTestReconciler(3)
			for i := 0; i < 2; i++ {
				_, err := r.Reconcile(ctx, reconcile.Request{
					NamespacedName: types.NamespacedName{Name: name, Namespace: ns},
				})
				Expect(err).NotTo(HaveOccurred())
			}

			var jobList batchv1.JobList
			Expect(k8sClient.List(ctx, &jobList,
				client.InNamespace(ns),
				client.MatchingLabels{config.ApplicationLabelKey: "my-app"},
			)).To(Succeed())
			Expect(jobList.Items).To(HaveLen(1))
		})

		It("Secretが作成される", func() {
			r := newTestReconciler(3)
			_, err := r.Reconcile(ctx, reconcile.Request{
				NamespacedName: types.NamespacedName{Name: name, Namespace: ns},
			})
			Expect(err).NotTo(HaveOccurred())

			var secret corev1.Secret
			Expect(k8sClient.Get(ctx, types.NamespacedName{Name: config.SecretName, Namespace: ns}, &secret)).To(Succeed())
			Expect(secret.Data).To(HaveKey(config.InstallationAccessTokenKey))
			Expect(secret.Data).To(HaveKey(corev1.DockerConfigJsonKey))
		})
	})

	Context("古いJobの削除", func() {
		const baseName = "buildrun-gc"

		AfterEach(func() {
			var jobList batchv1.JobList
			_ = k8sClient.List(ctx, &jobList, client.InNamespace(ns))
			for i := range jobList.Items {
				_ = k8sClient.Delete(ctx, &jobList.Items[i])
			}
		})

		It("MaxHistoryを超えた古いJobが削除される", func() {
			const maxHistory = 2
			r := newTestReconciler(maxHistory)

			const appName = "gc-app"
			brName := fmt.Sprintf("%s-multi", baseName)
			br := newTestBuildRun(brName, ns, appName)
			Expect(k8sClient.Create(ctx, br)).To(Succeed())

			for i := 0; i < maxHistory+1; i++ {
				job := &batchv1.Job{
					ObjectMeta: metav1.ObjectMeta{
						Name:      fmt.Sprintf("%s-job-%d", brName, i),
						Namespace: ns,
						Labels:    map[string]string{config.ApplicationLabelKey: appName},
					},
					Spec: batchv1.JobSpec{
						Template: corev1.PodTemplateSpec{
							Spec: corev1.PodSpec{
								RestartPolicy: corev1.RestartPolicyNever,
								Containers: []corev1.Container{
									{Name: "dummy", Image: "busybox"},
								},
							},
						},
					},
				}
				Expect(k8sClient.Create(ctx, job)).To(Succeed())
			}

			err := r.cleanupOldJobs(ctx, br)
			Expect(err).NotTo(HaveOccurred())

			var jobList batchv1.JobList
			Expect(k8sClient.List(ctx, &jobList,
				client.InNamespace(ns),
				client.MatchingLabels{config.ApplicationLabelKey: appName},
			)).To(Succeed())
			active := 0
			for _, j := range jobList.Items {
				if j.DeletionTimestamp == nil {
					active++
				}
			}
			Expect(active).To(BeNumerically("<=", maxHistory))
		})
	})

	Context("BuildRunが存在しない場合", func() {
		It("NotFoundは無視してエラーにならない", func() {
			r := newTestReconciler(3)
			_, err := r.Reconcile(ctx, reconcile.Request{
				NamespacedName: types.NamespacedName{Name: "nonexistent", Namespace: ns},
			})
			Expect(err).NotTo(HaveOccurred())
		})
	})
})

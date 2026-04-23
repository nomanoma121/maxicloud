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

	"github.com/saitamau-maximum/maxicloud/internal/github"
	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	logf "sigs.k8s.io/controller-runtime/pkg/log"

	maxicloudv1alpha1 "github.com/saitamau-maximum/maxicloud/api/v1alpha1"
)

type ReconcilerConfig struct {
	Namespace    string
	IngressClass string
	BaseDomain   string
}

// ApplicationReconciler reconciles a Application object
type ApplicationReconciler struct {
	client.Client
	Scheme       *runtime.Scheme
	Registry     Registry
	GitHubClient github.Client
	Config       ReconcilerConfig
}

// +kubebuilder:rbac:groups=maxicloud.maximum.vc,resources=applications,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=maxicloud.maximum.vc,resources=applications/status,verbs=get;update;patch
// +kubebuilder:rbac:groups=maxicloud.maximum.vc,resources=applications/finalizers,verbs=update

func (r *ApplicationReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	log := logf.FromContext(ctx)

	var application maxicloudv1alpha1.Application
	if err := r.Get(ctx, req.NamespacedName, &application); err != nil {
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}

	_ = log
	_ = application

	return ctrl.Result{}, nil
}

func (r *ApplicationReconciler) reconcileDeployments(ctx context.Context, application *maxicloudv1alpha1.Application) error {
	_ = ctx
	_ = application
	return nil
}

func (r *ApplicationReconciler) reconcileServices(ctx context.Context, application *maxicloudv1alpha1.Application) error {
	_ = ctx
	_ = application
	return nil
}

func (r *ApplicationReconciler) reconcileIngresses(ctx context.Context, application *maxicloudv1alpha1.Application) error {
	_ = ctx
	_ = application
	return nil
}

// SetupWithManager sets up the controller with the Manager.
func (r *ApplicationReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&maxicloudv1alpha1.Application{}).
		Named("application").
		Complete(r)
}

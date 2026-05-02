package main

import (
	"os"

	"github.com/caarlos0/env/v11"
	"github.com/spf13/cobra"
	ctrl "sigs.k8s.io/controller-runtime"
	client "sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/healthz"
	"sigs.k8s.io/controller-runtime/pkg/log/zap"
	metricsserver "sigs.k8s.io/controller-runtime/pkg/metrics/server"

	"github.com/saitamau-maximum/maxicloud/internal/controller"
	"github.com/saitamau-maximum/maxicloud/internal/infra/github"
	"github.com/saitamau-maximum/maxicloud/internal/infra/k8s"
	"github.com/saitamau-maximum/maxicloud/internal/infra/postgres"
	"github.com/saitamau-maximum/maxicloud/internal/infra/registry"
)

var controllerCmd = &cobra.Command{
	Use:   "controller",
	Short: "Start the Kubernetes controller manager",
	RunE:  runController,
}

func runController(cmd *cobra.Command, args []string) error {
	ctrl.SetLogger(zap.New(zap.UseDevMode(true)))
	setupLog := ctrl.Log.WithName("setup")

	var cfg ControllerConfig
	if err := env.Parse(&cfg); err != nil {
		return err
	}

	privateKey, err := os.ReadFile(cfg.GitHubPrivateKeyPath)
	if err != nil {
		return err
	}
	ghClient := github.NewClient(cfg.GitHubAppID, privateKey)

	k8sClient, err := client.New(ctrl.GetConfigOrDie(), client.Options{Scheme: scheme})
	secretRepo := k8s.NewSecretRepository(k8sClient, cfg.Namespace)
	deployRepo := postgres.NewDeploymentRepository()

	mgr, err := ctrl.NewManager(ctrl.GetConfigOrDie(), ctrl.Options{
		Scheme:                 scheme,
		Metrics:                metricsserver.Options{BindAddress: "0"},
		HealthProbeBindAddress: cfg.HealthProbeBindAddress,
	})
	if err != nil {
		return err
	}
	registry, err := registry.NewFromConfig(registry.Config{
		Provider: registry.ProviderLocalRegistry,
		Host:     cfg.RegistryHost,
		Password: cfg.RegistryPassword,
	})
	if err != nil {
		return err
	}

	if err := (&controller.ApplicationReconciler{
		Client:   mgr.GetClient(),
		Scheme:   mgr.GetScheme(),
		Registry: registry,
		Config: controller.ReconcilerConfig{
			IngressClass: cfg.IngressClass,
			BaseDomain:   cfg.BaseDomain,
		},
	}).SetupWithManager(mgr); err != nil {
		return err
	}
	if err := (&controller.BuildRunReconciler{
		Client:       mgr.GetClient(),
		Scheme:       mgr.GetScheme(),
		Registry:     registry,
		SecretRepo:   secretRepo,
		GitHubClient: ghClient,
	}).SetupWithManager(mgr); err != nil {
		return err
	}
	if err := (&controller.DeploymentPipelineReconciler{
		Client:     mgr.GetClient(),
		Scheme:     mgr.GetScheme(),
		Reporter:   ghClient,
		DeployRepo: deployRepo,
		SecretRepo: secretRepo,
	}).SetupWithManager(mgr); err != nil {
		return err
	}
	// +kubebuilder:scaffold:builder

	if err := mgr.AddHealthzCheck("healthz", healthz.Ping); err != nil {
		return err
	}
	if err := mgr.AddReadyzCheck("readyz", healthz.Ping); err != nil {
		return err
	}

	setupLog.Info("Starting controller manager")
	return mgr.Start(ctrl.SetupSignalHandler())
}

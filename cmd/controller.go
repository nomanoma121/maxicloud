package main

import (
	"os"

	"github.com/spf13/cobra"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/healthz"
	"sigs.k8s.io/controller-runtime/pkg/log/zap"
	metricsserver "sigs.k8s.io/controller-runtime/pkg/metrics/server"

	"github.com/saitamau-maximum/maxicloud/internal/controller"
	"github.com/saitamau-maximum/maxicloud/internal/infra/github"
	"github.com/saitamau-maximum/maxicloud/internal/infra/registry"
)

var (
	probeAddr            string
	githubAppID          int64
	githubPrivateKeyPath string
	ghcrHost             string
	ghcrToken            string
	ingressClass         string
	baseDomain           string
)

var controllerCmd = &cobra.Command{
	Use:   "controller",
	Short: "Start the Kubernetes controller manager",
	RunE:  runController,
}

func init() {
	controllerCmd.Flags().StringVar(&probeAddr, "health-probe-bind-address", ":8081", "The address the probe endpoint binds to.")
	controllerCmd.Flags().Int64Var(&githubAppID, "github-app-id", 0, "GitHub App ID")
	controllerCmd.Flags().StringVar(&githubPrivateKeyPath, "github-private-key-path", "", "Path to the GitHub App private key PEM file")
	controllerCmd.Flags().StringVar(&ghcrHost, "ghcr-host", "", "GHCR host")
	controllerCmd.Flags().StringVar(&ghcrToken, "ghcr-token", "", "GitHub token for GHCR authentication")
	controllerCmd.Flags().StringVar(&ingressClass, "ingress-class", "", "Ingress class")
	controllerCmd.Flags().StringVar(&baseDomain, "base-domain", "", "Base domain for Ingress resources")
}

func runController(cmd *cobra.Command, args []string) error {
	ctrl.SetLogger(zap.New(zap.UseDevMode(true)))
	setupLog := ctrl.Log.WithName("setup")

	privateKey, err := os.ReadFile(githubPrivateKeyPath)
	if err != nil {
		return err
	}
	ghClient := github.NewClient(githubAppID, privateKey)

	mgr, err := ctrl.NewManager(ctrl.GetConfigOrDie(), ctrl.Options{
		Scheme:                 scheme,
		Metrics:                metricsserver.Options{BindAddress: "0"},
		HealthProbeBindAddress: probeAddr,
	})
	if err != nil {
		return err
	}

	if err := (&controller.ApplicationReconciler{
		Client:   mgr.GetClient(),
		Scheme:   mgr.GetScheme(),
		Registry: registry.NewGHCR(ghcrHost, ghcrToken),
		Config: controller.ReconcilerConfig{
			IngressClass: ingressClass,
			BaseDomain:   baseDomain,
		},
	}).SetupWithManager(mgr); err != nil {
		return err
	}
	if err := (&controller.BuildRunReconciler{
		Client:       mgr.GetClient(),
		Scheme:       mgr.GetScheme(),
		Registry:     registry.NewGHCR(ghcrHost, ghcrToken),
		GitHubClient: ghClient,
	}).SetupWithManager(mgr); err != nil {
		return err
	}
	if err := (&controller.DeploymentPipelineReconciler{
		Client:   mgr.GetClient(),
		Scheme:   mgr.GetScheme(),
		Reporter: ghClient,
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

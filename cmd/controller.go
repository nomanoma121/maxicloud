package main

import (
	"os"

	"github.com/spf13/cobra"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/healthz"
	"sigs.k8s.io/controller-runtime/pkg/log/zap"
	metricsserver "sigs.k8s.io/controller-runtime/pkg/metrics/server"

	"github.com/saitamau-maximum/maxicloud/internal/controller"
	infragithub "github.com/saitamau-maximum/maxicloud/internal/infra/github"
)

var (
	probeAddr            string
	githubAppID          int64
	githubPrivateKeyPath string
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
}

func runController(cmd *cobra.Command, args []string) error {
	ctrl.SetLogger(zap.New(zap.UseDevMode(true)))
	setupLog := ctrl.Log.WithName("setup")

	privateKey, err := os.ReadFile(githubPrivateKeyPath)
	if err != nil {
		return err
	}
	ghClient := infragithub.NewClient(githubAppID, privateKey)

	mgr, err := ctrl.NewManager(ctrl.GetConfigOrDie(), ctrl.Options{
		Scheme:                 scheme,
		Metrics:                metricsserver.Options{BindAddress: "0"},
		HealthProbeBindAddress: probeAddr,
	})
	if err != nil {
		return err
	}

	if err := (&controller.ApplicationReconciler{
		Client: mgr.GetClient(),
		Scheme: mgr.GetScheme(),
	}).SetupWithManager(mgr); err != nil {
		return err
	}
	if err := (&controller.BuildRunReconciler{
		Client: mgr.GetClient(),
		Scheme: mgr.GetScheme(),
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

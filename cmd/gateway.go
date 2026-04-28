package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/caarlos0/env/v11"
	"github.com/spf13/cobra"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/log/zap"

	"github.com/saitamau-maximum/maxicloud/gen/maxicloud/v1/maxicloudv1connect"
	"github.com/saitamau-maximum/maxicloud/internal/handler"
	"github.com/saitamau-maximum/maxicloud/internal/infra/k8s"
	"github.com/saitamau-maximum/maxicloud/internal/infra/postgres"
	"github.com/saitamau-maximum/maxicloud/internal/usecase"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

var gatewayCmd = &cobra.Command{
	Use:   "gateway",
	Short: "Start the API gateway server",
	RunE:  runGateway,
}

func runGateway(cmd *cobra.Command, args []string) error {
	ctrl.SetLogger(zap.New(zap.UseDevMode(true)))
	log := ctrl.Log.WithName("gateway")

	var cfg GatewayConfig
	if err := env.Parse(&cfg); err != nil {
		return err
	}

	k8sClient, err := client.New(ctrl.GetConfigOrDie(), client.Options{Scheme: scheme})
	if err != nil {
		return err
	}

	appRepo := k8s.NewApplicationRepository(k8sClient)
	prjRepo := k8s.NewProjectRepository(k8sClient)
	deployRepo := postgres.NewDeploymentRepository()
	deployPipelineRepo := k8s.NewDeploymentPipelineRepository(k8sClient)
	secretRepo := k8s.NewSecretRepository(k8sClient, cfg.Namespace)

	deploySvc := usecase.NewDeploymentService(deployRepo, deployPipelineRepo, appRepo)
	appSvc := usecase.NewApplicationService(appRepo)
	prjSvc := usecase.NewProjectUsecase(prjRepo)
	ghSvc := usecase.NewGitHubService(secretRepo)

	ghHandler := handler.NewGitHubHandler(ghSvc, deploySvc, handler.GitHubHandlerConfig{
		GitHubAppName: cfg.GitHubAppName,
		WebhookSecret: cfg.GitHubWebhookSecret,
		ClientID:      cfg.GitHubClientID,
		ClientSecret:  cfg.GitHubClientSecret,
	})
	prjHandler := handler.NewProjectHandler(prjSvc)
	appHandler := handler.NewApplicationHandler(appSvc)

	mux := http.NewServeMux()
	mux.Handle(maxicloudv1connect.NewApplicationServiceHandler(appHandler))
	mux.Handle(maxicloudv1connect.NewProjectServiceHandler(prjHandler))
	// GitHub App 関連のエンドポイント
	mux.HandleFunc("github/install", ghHandler.Install)
	mux.HandleFunc("github/webhook", ghHandler.Webhook)
	mux.HandleFunc("github/callback", ghHandler.Callback)

	srv := &http.Server{
		Addr:    cfg.Addr,
		Handler: mux,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		log.Info("Starting gateway server", "addr", cfg.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Error(err, "Failed to start gateway server")
		}
	}()

	<-ctx.Done()
	log.Info("Shutting down gateway server")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return srv.Shutdown(shutdownCtx)
}

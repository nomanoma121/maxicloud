package handler

import (
	"net/http"

	"github.com/saitamau-maximum/maxicloud/internal/usecase"
)

type GitHubHandler struct {
	deployService usecase.DeploymentService
}

func NewGitHubHandler(deploySvc usecase.DeploymentService) *GitHubHandler {
	return &GitHubHandler{deployService: deploySvc}
}

func (h *GitHubHandler) Webhook(w http.ResponseWriter, r *http.Request) {
	return
}

func (h *GitHubHandler) Install(w http.ResponseWriter, r *http.Request) {
	return
}

func (h *GitHubHandler) Callback(w http.ResponseWriter, r *http.Request) {
	return
}

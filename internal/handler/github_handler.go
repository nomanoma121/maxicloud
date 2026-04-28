package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	gh "github.com/google/go-github/v72/github"
	"github.com/saitamau-maximum/maxicloud/internal/domain"
	"github.com/saitamau-maximum/maxicloud/internal/usecase"
	"golang.org/x/oauth2"
)

type GitHubHandlerConfig struct {
	GitHubAppName string
	WebhookSecret string
	ClientSecret  string
	ClientID      string
}

type GitHubHandler struct {
	gitHubService usecase.GitHubService
	deployService usecase.DeploymentService
	config        GitHubHandlerConfig
	oauthCfg      *oauth2.Config
}

func NewGitHubHandler(gitHubSvc usecase.GitHubService, deploySvc usecase.DeploymentService, config GitHubHandlerConfig) *GitHubHandler {
	oauthCfg := &oauth2.Config{
		ClientID:     config.ClientID,
		ClientSecret: config.ClientSecret,
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://github.com/login/oauth/authorize",
			TokenURL: "https://github.com/login/oauth/access_token",
		},
	}
	return &GitHubHandler{
		gitHubService: gitHubSvc,
		deployService: deploySvc,
		config:        config,
		oauthCfg:      oauthCfg,
	}
}

func (h *GitHubHandler) Install(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, fmt.Sprintf("https://github.com/apps/%s/installations/new", h.config.GitHubAppName), http.StatusFound)
}

func (h *GitHubHandler) Callback(w http.ResponseWriter, r *http.Request) {
	if code := r.URL.Query().Get("code"); code != "" {
		if _, err := h.oauthCfg.Exchange(r.Context(), code); err != nil {
			http.Error(w, "failed to exchange code for token", http.StatusInternalServerError)
			return
		}
	}

	installationIDStr := r.URL.Query().Get("installation_id")
	if installationIDStr == "" {
		http.Error(w, "installation_id query parameter is required", http.StatusBadRequest)
		return
	}
	installationID, err := strconv.ParseInt(installationIDStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid installation_id", http.StatusBadRequest)
		return
	}
	if err := h.gitHubService.SaveInstallation(r.Context(), installationID); err != nil {
		http.Error(w, "failed to save installation", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *GitHubHandler) Webhook(w http.ResponseWriter, r *http.Request) {
	payload, err := gh.ValidatePayload(r, []byte(h.config.WebhookSecret))
	if err != nil {
		http.Error(w, "invalid signature", http.StatusUnauthorized)
		return
	}
	event, err := gh.ParseWebHook(gh.WebHookType(r), payload)
	if err != nil {
		http.Error(w, "failed to parse webhook payload", http.StatusBadRequest)
		return
	}

	deployEvent, handled, err := toDeploymentEvent(event)
	if err != nil {
		http.Error(w, "failed to convert webhook event", http.StatusBadRequest)
		return
	}
	if !handled {
		w.WriteHeader(http.StatusOK)
		return
	}
	if err := h.deployService.HandleGitHubEvent(r.Context(), *deployEvent); err != nil {
		http.Error(w, "failed to handle deployment event", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func toDeploymentEvent(event interface{}) (*domain.DeploymentEvent, bool, error) {
	switch e := event.(type) {
	case *gh.PushEvent:
		if e.GetDeleted() {
			return nil, false, nil
		}
		const refPrefix = "refs/heads/"
		if !strings.HasPrefix(e.GetRef(), refPrefix) {
			return nil, false, nil
		}
		branch := strings.TrimPrefix(e.GetRef(), refPrefix)
		return &domain.DeploymentEvent{
			Type: domain.DeploymentEventTypeProductionRequested,
			Repo: domain.Repository{
				Owner: e.GetRepo().GetOwner().GetLogin(),
				Name:  e.GetRepo().GetName(),
			},
			Branch: branch,
			Commit: domain.Commit{
				SHA:        e.GetAfter(),
				Message:    e.GetHeadCommit().GetMessage(),
				AuthorName: e.GetHeadCommit().GetAuthor().GetName(),
			},
		}, true, nil
	case *gh.PullRequestEvent:
		var eventType domain.DeploymentEventType
		switch e.GetAction() {
		case "opened", "synchronize", "reopened":
			eventType = domain.DeploymentEventTypePreviewRequested
		case "closed":
			eventType = domain.DeploymentEventTypePreviewDeleted
		default:
			return nil, false, nil
		}
		pr := e.GetPullRequest()
		prNumber := pr.GetNumber()
		return &domain.DeploymentEvent{
			Type: eventType,
			Repo: domain.Repository{
				Owner: e.GetRepo().GetOwner().GetLogin(),
				Name:  e.GetRepo().GetName(),
			},
			Branch: pr.GetHead().GetRef(),
			Commit: domain.Commit{
				SHA:        pr.GetHead().GetSHA(),
				Message:    pr.GetTitle(),
				AuthorName: pr.GetUser().GetLogin(),
			},
			PRNumber: &prNumber,
		}, true, nil
	default:
		return nil, false, nil
	}
}

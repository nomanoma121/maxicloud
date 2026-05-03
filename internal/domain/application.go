package domain

import (
	"context"
	"fmt"
	"time"
)

const (
	MinPort = 1
	MaxPort = 65535
)

type Application struct {
	ID        string
	ProjectID string
	Name      string
	Source    ApplicationSource
	OwnerID   string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type ApplicationStatus struct {
	Phase            string
	URL              string
	LatestDeploymentID string
}

type ApplicationSource struct {
	Repo   Repository
	Branch string
}

type AccessMode string

const (
	AccessModePublic      AccessMode = "Public"
	AccessModePrivate     AccessMode = "Private"
	AccessModeMembersOnly AccessMode = "MembersOnly"
)

type Domain struct {
	Subdomain  string
	RootDomain string
}

func (d Domain) Validate() error {
	if d.Subdomain == "" {
		return ValidationError{Message: "subdomain is required for public access mode"}
	}
	if d.RootDomain == "" {
		return ValidationError{Message: "root domain is required for public access mode"}
	}
	return nil
}

// FQDN returns the full domain name in the format "subdomain.rootdomain"
func (d Domain) FQDN() string {
	return d.Subdomain + "." + d.RootDomain
}

type KeyValue struct {
	Key   string
	Value string
}

func (k KeyValue) Validate() error {
	if k.Key == "" {
		return ValidationError{Message: "key is required"}
	}
	if k.Value == "" {
		return ValidationError{Message: "value is required"}
	}
	return nil
}

type ApplicationSpec struct {
	ProjectID   string
	Source      ApplicationSource
	BuildConfig BuildConfig
	AccessMode  AccessMode
	Domain      *Domain
	Port        int32
	Env         []KeyValue
	Secrets     []KeyValue
}

func (s ApplicationSpec) Validate() error {
	if s.ProjectID == "" {
		return ValidationError{Message: "project_id is required"}
	}
	if s.Source.Branch == "" {
		return ValidationError{Message: "source.branch is required"}
	}
	if s.Port < MinPort || s.Port > MaxPort {
		return ValidationError{Message: fmt.Sprintf("port must be between %d and %d", MinPort, MaxPort)}
	}
	for _, kv := range s.Env {
		if err := kv.Validate(); err != nil {
			return fmt.Errorf("invalid environment variable: %w", err)
		}
	}
	for _, kv := range s.Secrets {
		if err := kv.Validate(); err != nil {
			return fmt.Errorf("invalid secret: %w", err)
		}
	}
	switch s.AccessMode {
	case AccessModePublic, AccessModeMembersOnly:
		if s.Domain == nil {
			return ValidationError{Message: "domain is required"}
		}
	case AccessModePrivate:
		if s.Domain != nil {
			return ValidationError{Message: "domain must be nil for private access mode"}
		}
	default:
		return ValidationError{Message: "invalid access mode"}
	}
	return nil
}

type CreateApplicationParams struct {
	ID      string
	Name    string
	OwnerID string
	Spec    ApplicationSpec
}

type ApplicationRepository interface {
	CreateApplication(ctx context.Context, params CreateApplicationParams) (*Application, error)
	GetApplication(ctx context.Context, id string) (*Application, error)
	ListApplications(ctx context.Context, projectID string) ([]Application, error)
	UpdateApplication(ctx context.Context, app Application) error
	DeleteApplication(ctx context.Context, id string) error
	GetApplicationsByRepo(ctx context.Context, owner, name, branch string) ([]Application, error)
	ExistsByDomain(ctx context.Context, domain string) (bool, error)
}

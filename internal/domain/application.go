package domain

import (
	"context"
	"errors"
	"fmt"
	"time"
)

var (
	ErrInvalidProjectID                     = errors.New("invalid project ID")
	ErrInvalidApplicationName               = errors.New("invalid application name")
	ErrInvalidRepositoryID                  = errors.New("invalid repository ID")
	ErrInvalidRepositoryFullName            = errors.New("invalid repository full name")
	ErrInvalidBranch                        = errors.New("invalid branch")
	ErrInvalidPort                          = errors.New("invalid port")
	ErrInvalidSecret                        = errors.New("invalid secret")
	ErrInvalidEnvVar                        = errors.New("invalid environment variable")
	ErrSubdomainRequired                    = errors.New("subdomain is required for public access mode")
	ErrRootDomainRequired                   = errors.New("root domain is required for public access mode")
	ErrInvalidAccessMode                    = errors.New("invalid access mode")
	ErrDomainRequired                       = errors.New("domain is required")
	ErrDomainNotAllowedForPrivateAccessMode = errors.New("domain must be nil for private access mode")
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
	URL       string
	CreatedAt time.Time
	UpdatedAt time.Time
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
		return ErrSubdomainRequired
	}
	if d.RootDomain == "" {
		return ErrRootDomainRequired
	}
	return nil
}

// FullDomain returns the full domain name in the format "subdomain.rootdomain"
func (d Domain) FullDomain() string {
	return d.Subdomain + "." + d.RootDomain
}

type KeyValue struct {
	Key   string
	Value string
}

func (k KeyValue) Validate() error {
	if k.Key == "" {
		return errors.New("key is required")
	}
	if k.Value == "" {
		return errors.New("value is required")
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
		return ErrInvalidProjectID
	}
	if s.Source.Branch == "" {
		return ErrInvalidBranch
	}
	if s.Port < MinPort || s.Port > MaxPort {
		return ErrInvalidPort
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
			return ErrDomainRequired
		}
	case AccessModePrivate:
		if s.Domain != nil {
			return ErrDomainNotAllowedForPrivateAccessMode
		}
	default:
		return ErrInvalidAccessMode
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
}

package domain

import (
	"context"
	"errors"
	"time"
)

var (
	ErrInvalidProjectID             = errors.New("invalid project ID")
	ErrInvalidApplicationName       = errors.New("invalid application name")
	ErrInvalidRepositoryID          = errors.New("invalid repository ID")
	ErrInvalidRepositoryFullName    = errors.New("invalid repository full name")
	ErrInvalidBranch                = errors.New("invalid branch")
	ErrDomainRequiredForMembersOnly = errors.New("domain is required when access mode is MembersOnly")
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
	RepositoryID       string
	RepositoryFullName string
	Branch             string
}

type AccessMode string

const (
	AccessModePrivate     AccessMode = "Private"
	AccessModeMembersOnly AccessMode = "MembersOnly"
)

type Domain struct {
	Subdomain  string
	RootDomain string
}

type KeyValue struct {
	Key   string
	Value string
}

type ApplicationSpec struct {
	ProjectID            string
	Name                 string
	Source               ApplicationSource
	BuildConfig          BuildConfig
	AccessMode           AccessMode
	Domain               *Domain
	EnvironmentVariables []KeyValue
	Secrets              []KeyValue
}

func (s ApplicationSpec) Validate() error {
	if s.ProjectID == "" {
		return ErrInvalidProjectID
	}
	if s.Name == "" {
		return ErrInvalidApplicationName
	}
	if s.Source.RepositoryID == "" {
		return ErrInvalidRepositoryID
	}
	if s.Source.RepositoryFullName == "" {
		return ErrInvalidRepositoryFullName
	}
	if s.Source.Branch == "" {
		return ErrInvalidBranch
	}
	if s.AccessMode == AccessModeMembersOnly && s.Domain == nil {
		return ErrDomainRequiredForMembersOnly
	}
	return nil
}

type ApplicationRepository interface {
	CreateApplication(ctx context.Context, app Application) (*Application, error)
	GetApplication(ctx context.Context, id string) (*Application, error)
	ListApplications(ctx context.Context, projectID string) ([]Application, error)
	UpdateApplication(ctx context.Context, app Application) error
	DeleteApplication(ctx context.Context, id string) error
}

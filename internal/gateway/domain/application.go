package domain

import (
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
	RepositoryFullName string // e.g. "saitamau-maximum/maxicloud"
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

	// AccessModeがMembersOnlyの場合、Domainは必須
	if s.AccessMode == AccessModeMembersOnly && s.Domain == nil {
		return ErrDomainRequiredForMembersOnly
	}

	return nil
}

type ApplicationRepository interface {
	CreateApplication(app Application) (string, error)
	GetApplication(id string) (*Application, error)
	UpdateApplication(app Application) error
	DeleteApplication(id string) error
}
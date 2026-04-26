package domain

import (
	"fmt"
	"time"
)

type Repository struct {
	Owner string // e.g. "saitamau-maximum"
	Name  string // e.g. "maxicloud"
}

func (r Repository) FullName() string {
	return r.Owner + "/" + r.Name
}

func (r Repository) URL() string {
	return fmt.Sprintf("https://github.com/%s/%s", r.Owner, r.Name)
}

func (r Repository) CloneURL() string {
	return r.URL() + ".git"
}

type Commit struct {
	SHA        string
	Message    string
	AuthorName string
	Timestamp  time.Time
}

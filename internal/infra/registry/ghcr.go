package registry

import (
	"fmt"
	"strings"
)

type Registry interface {
	DockerConfig() string
	Host() string
	Token() string
}

type ghcr struct {
	host  string
	token string
}

func NewGHCR(host, token string) Registry {
	return &ghcr{
		host:  host,
		token: token,
	}
}

func (r *ghcr) DockerConfig() string {
	authHost := strings.Split(strings.TrimSpace(r.host), "/")[0]
	return fmt.Sprintf(`{"auths":{"%s":{"username":"x-access-token","password":%q}}}`, authHost, r.token)
}

func (r *ghcr) Host() string {
	return r.host
}

func (r *ghcr) Token() string {
	return r.token
}

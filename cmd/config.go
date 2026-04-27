package main

type ControllerConfig struct {
	HealthProbeBindAddress string `env:"HEALTH_PROBE_BIND_ADDRESS" envDefault:":8081"`
	GitHubAppID            int64  `env:"GITHUB_APP_ID,required"`
	GitHubPrivateKeyPath   string `env:"GITHUB_PRIVATE_KEY_PATH,required"`
	GHCRHost               string `env:"GHCR_HOST" envDefault:"ghcr.io/saitamau-maximum"`
	GHCRToken              string `env:"GHCR_TOKEN,required"`
	IngressClass           string `env:"INGRESS_CLASS" envDefault:"nginx"`
	BaseDomain             string `env:"BASE_DOMAIN" envDefault:"maxicloud.maximum.vc"`
}

type GatewayConfig struct {
	Addr                 string `env:"ADDR" envDefault:":8080"`
	GitHubPrivateKeyPath string `env:"GITHUB_PRIVATE_KEY_PATH,required"`
}

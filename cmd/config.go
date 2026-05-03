package main

type ControllerConfig struct {
	HealthProbeBindAddress string `env:"HEALTH_PROBE_BIND_ADDRESS" envDefault:":8081"`
	GitHubAppID            int64  `env:"GITHUB_APP_ID,required"`
	GitHubPrivateKeyPath   string `env:"GITHUB_PRIVATE_KEY_PATH,required"`
	InstallationID         int64  `env:"GITHUB_APP_INSTALLATION_ID,required"`

	RegistryHost     string `env:"REGISTRY_HOST" envDefault:"kind-registry:5000"`
	RegistryPassword string `env:"REGISTRY_PASSWORD,required"`

	IngressClass string `env:"INGRESS_CLASS" envDefault:"nginx"`
	BaseDomain   string `env:"BASE_DOMAIN" envDefault:"maxicloud.maximum.vc"`
	// Maxicloudが管理するドメインのリスト。カンマ区切りで複数指定可能。
	AvaiableDomains string `env:"AVAILABLE_DOMAINS" envDefault:"localtest.me"`

	// Downward APIからControllerのPodのNSを渡す
	Namespace string `env:"POD_NAMESPACE,required"`
}

type GatewayConfig struct {
	Addr string `env:"ADDR" envDefault:":8080"`

	GitHubAppID          int64  `env:"GITHUB_APP_ID,required"`
	GitHubAppName        string `env:"GITHUB_APP_NAME,required"`
	GitHubClientID       string `env:"GITHUB_CLIENT_ID,required"`
	GitHubClientSecret   string `env:"GITHUB_CLIENT_SECRET,required"`
	GitHubPrivateKeyPath string `env:"GITHUB_PRIVATE_KEY_PATH,required"`

	GitHubWebhookSecret string `env:"GITHUB_WEBHOOK_SECRET,required"`
	InstallationID      int64  `env:"GITHUB_APP_INSTALLATION_ID,required"`
	AvailableDomains    string `env:"AVAILABLE_DOMAINS" envDefault:"localtest.me"`

	IngressClass string `env:"INGRESS_CLASS" envDefault:"nginx"`
	// Downward APIからGatewayのPodのNSを渡す
	Namespace string `env:"POD_NAMESPACE,required"`
}

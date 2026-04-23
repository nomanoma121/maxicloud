package config

import "fmt"

const (
	// GitHub Appの認証情報などのMaxiCloudが管理するSecret
	SecretName = "maxicloud-secret"
	// GitHub AppのInstallation IDを保存するためのキー
	InstallationIDKey          = "installation-id"
	// GitHub AppのInstallation Access Tokenを保存するためのキー
	InstallationAccessTokenKey = "installation-access-token"
	// Applicationに紐づくJobを識別するためのラベルキー
	ApplicationLabelKey = "application"
)

// ApplicationがRegistryからImageをPullするためのSecret名
func AppRegistrySecretName(appName string) string {
	return fmt.Sprintf("%s-registry-secret", appName)
}

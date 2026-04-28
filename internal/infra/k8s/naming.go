package k8s

import "strings"

const (
	NamespacePrefix = "maxicloud-"
)

func projectNamespace(projectID string) string {
	return NamespacePrefix + projectID
}

func projectIDFromNamespace(namespace string) string {
	return strings.TrimPrefix(namespace, NamespacePrefix)
}

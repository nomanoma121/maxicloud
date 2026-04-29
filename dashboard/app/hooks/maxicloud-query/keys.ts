export const maxicloudQueryKeys = {
  users: ["users"] as const,
  projects: ["projects"] as const,
  project: (id: string) => ["projects", id] as const,
  applications: ["applications"] as const,
  application: (id: string) => ["applications", id] as const,
  deployments: ["deployments"] as const,
  deployment: (id: string) => ["deployments", id] as const,
  deployEvents: (deploymentId: string) =>
    ["deployments", deploymentId, "events"] as const,
  githubRepositories: ["github-repositories"] as const,
  workspaceSettings: ["workspace-settings"] as const,
  workspaceSecrets: ["workspace-secrets"] as const,
};

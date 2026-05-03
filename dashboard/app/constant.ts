export const APP_NAME = "MaxiCloud";

export const APP_ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  projects: "/projects",
  projectDetail: (projectId: string) => `/projects/${projectId}`,
  projectNew: "/projects/new",
  applications: "/applications",
  applicationDetail: (applicationId: string) => `/applications/${applicationId}`,
  applicationNew: "/applications/new",
  deployments: "/deployments",
  deploymentDetail: (deploymentId: string) => `/deployments/${deploymentId}`,
  settings: "/settings",
} as const;

export const QUERY_KEY_ROOT = {
  users: "users",
  projects: "projects",
  applications: "applications",
  deployments: "deployments",
  githubRepositories: "github-repositories",
  availableDomains: "available-domains",
  domainAvailability: "domain-availability",
  workspaceSettings: "workspace-settings",
  workspaceSecrets: "workspace-secrets",
} as const;

export const QUERY_KEYS = {
  users: [QUERY_KEY_ROOT.users] as const,
  projects: [QUERY_KEY_ROOT.projects] as const,
  project: (id: string) => [QUERY_KEY_ROOT.projects, id] as const,
  applications: [QUERY_KEY_ROOT.applications] as const,
  application: (id: string) => [QUERY_KEY_ROOT.applications, id] as const,
  deployments: [QUERY_KEY_ROOT.deployments] as const,
  deployment: (id: string) => [QUERY_KEY_ROOT.deployments, id] as const,
  deployEvents: (deploymentId: string) =>
    [QUERY_KEY_ROOT.deployments, deploymentId, "events"] as const,
  githubRepositories: [QUERY_KEY_ROOT.githubRepositories] as const,
  githubRepositoryBranches: (fullName: string) =>
    [QUERY_KEY_ROOT.githubRepositories, fullName, "branches"] as const,
  availableDomains: [QUERY_KEY_ROOT.availableDomains] as const,
  domainAvailability: (subdomain: string, rootDomain: string) =>
    [QUERY_KEY_ROOT.domainAvailability, subdomain, rootDomain] as const,
  workspaceSettings: [QUERY_KEY_ROOT.workspaceSettings] as const,
  workspaceSecrets: [QUERY_KEY_ROOT.workspaceSecrets] as const,
};

import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";

export const maxicloudQueryKeys = {
  users: ["users"] as const,
  projects: ["projects"] as const,
  project: (id: string) => ["projects", id] as const,
  services: ["services"] as const,
  service: (id: string) => ["services", id] as const,
  jobs: ["jobs"] as const,
  job: (id: string) => ["jobs", id] as const,
  jobRuns: (jobId: string) => ["jobs", jobId, "runs"] as const,
  deployments: ["deployments"] as const,
  deployment: (id: string) => ["deployments", id] as const,
  deployEvents: (deploymentId: string) =>
    ["deployments", deploymentId, "events"] as const,
  templates: ["templates"] as const,
  template: (id: string) => ["templates", id] as const,
  githubRepositories: ["github-repositories"] as const,
  workspaceSettings: ["workspace-settings"] as const,
  workspaceSecrets: ["workspace-secrets"] as const,
};

export const useUsersQuery = () => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.users,
    queryFn: () => maxicloudRepository.listUsers(),
  });
};

export const useProjectsQuery = () => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.projects,
    queryFn: () => maxicloudRepository.listProjects(),
  });
};

export const useProjectQuery = (projectId: string) => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.project(projectId),
    enabled: projectId.length > 0,
    queryFn: () => maxicloudRepository.getProject(projectId),
  });
};

export const useServicesQuery = () => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.services,
    queryFn: () => maxicloudRepository.listServices(),
  });
};

export const useServiceQuery = (serviceId: string) => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.service(serviceId),
    enabled: serviceId.length > 0,
    queryFn: () => maxicloudRepository.getService(serviceId),
  });
};

export const useJobsQuery = () => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.jobs,
    queryFn: () => maxicloudRepository.listJobs(),
  });
};

export const useJobQuery = (jobId: string) => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.job(jobId),
    enabled: jobId.length > 0,
    queryFn: () => maxicloudRepository.getJob(jobId),
  });
};

export const useJobRunsQuery = (jobId: string) => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.jobRuns(jobId),
    enabled: jobId.length > 0,
    queryFn: () => maxicloudRepository.listJobRunsByJob(jobId),
  });
};

export const useDeploymentsQuery = () => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.deployments,
    queryFn: () => maxicloudRepository.listDeployments(),
  });
};

export const useDeploymentQuery = (deploymentId: string) => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.deployment(deploymentId),
    enabled: deploymentId.length > 0,
    queryFn: () => maxicloudRepository.getDeployment(deploymentId),
  });
};

export const useDeployEventsQuery = (deploymentId: string) => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.deployEvents(deploymentId),
    enabled: deploymentId.length > 0,
    queryFn: () => maxicloudRepository.listDeployEventsByDeployment(deploymentId),
  });
};

export const useTemplatesQuery = () => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.templates,
    queryFn: () => maxicloudRepository.listTemplates(),
  });
};

export const useTemplateQuery = (templateId: string) => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.template(templateId),
    enabled: templateId.length > 0,
    queryFn: () => maxicloudRepository.getTemplate(templateId),
  });
};

export const useGitHubRepositoriesQuery = () => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.githubRepositories,
    queryFn: () => maxicloudRepository.listGitHubRepositories(),
  });
};

export const useWorkspaceSettingsQuery = () => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.workspaceSettings,
    queryFn: () => maxicloudRepository.getWorkspaceSettings(),
  });
};

export const useWorkspaceSecretsQuery = () => {
  const { maxicloudRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.workspaceSecrets,
    queryFn: () => maxicloudRepository.listWorkspaceSecrets(),
  });
};

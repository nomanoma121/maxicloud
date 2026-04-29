import {
  DEPLOY_EVENTS,
  DEPLOYMENTS,
  GITHUB_REPOSITORIES,
  JOB_RUNS,
  JOBS,
  PROJECTS,
  SERVICES,
  STACK_TEMPLATES,
  USERS,
} from "~/mock/projects";
import type {
  DeployEvent,
  DeploymentRun,
  Job,
  JobRun,
  JobTrigger,
  Project,
  ProjectVisibility,
  Service,
  StackTemplate,
  UserAccount,
  GitRepository,
} from "~/types";

export type CreateProjectInput = {
  name: string;
  description: string;
  visibility: ProjectVisibility;
  ownerId: string;
};

export type CreateServiceInput = {
  projectId: string;
  ownerId: string;
  name: string;
  repository: string;
  branch: string;
  runtime: string;
  url: string;
  cpu: string;
  memory: string;
};

export type CreateJobInput = {
  projectId: string;
  ownerId: string;
  name: string;
  command: string;
  trigger: JobTrigger;
  schedule?: string;
  sourceServiceId?: string;
};

export type CreateDeploymentInput = {
  serviceId: string;
  ownerId: string;
  revision: string;
  commit: string;
  strategy: string;
};

export type WorkspaceSettings = {
  namespace: string;
  registry: string;
};

export type WorkspaceSecret = {
  key: string;
};

export interface IMaxiCloudRepository {
  listUsers(): Promise<UserAccount[]>;
  listProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(input: CreateProjectInput): Promise<Project>;

  listServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(input: CreateServiceInput): Promise<Service>;

  listJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  listJobRunsByJob(jobId: string): Promise<JobRun[]>;
  createJob(input: CreateJobInput): Promise<Job>;

  listDeployments(): Promise<DeploymentRun[]>;
  getDeployment(id: string): Promise<DeploymentRun | undefined>;
  listDeployEventsByDeployment(deploymentId: string): Promise<DeployEvent[]>;
  createDeployment(input: CreateDeploymentInput): Promise<DeploymentRun>;

  listTemplates(): Promise<StackTemplate[]>;
  getTemplate(id: string): Promise<StackTemplate | undefined>;
  listGitHubRepositories(): Promise<GitRepository[]>;

  getWorkspaceSettings(): Promise<WorkspaceSettings>;
  listWorkspaceSecrets(): Promise<WorkspaceSecret[]>;
}

const nowLabel = () => "just now";
const id = (prefix: string) => `${prefix}-${Date.now().toString(36)}`;

const state = {
  users: USERS.map((item) => ({ ...item })),
  projects: PROJECTS.map((item) => ({ ...item })),
  services: SERVICES.map((item) => ({ ...item })),
  jobs: JOBS.map((item) => ({ ...item })),
  jobRuns: JOB_RUNS.map((item) => ({ ...item })),
  deployments: DEPLOYMENTS.map((item) => ({ ...item })),
  deployEvents: DEPLOY_EVENTS.map((item) => ({ ...item })),
  templates: STACK_TEMPLATES.map((item) => ({ ...item })),
  githubRepositories: GITHUB_REPOSITORIES.map((item) => ({ ...item })),
  workspaceSettings: {
    namespace: "maxicloud-prod",
    registry: "ghcr.io/maximum",
  } satisfies WorkspaceSettings,
  workspaceSecrets: [
    { key: "DISCORD_BOT_TOKEN" },
    { key: "SENTRY_DSN" },
    { key: "DATABASE_URL" },
    { key: "SLACK_WEBHOOK_URL" },
  ] satisfies WorkspaceSecret[],
};

const desc = <T extends { updatedAt?: string }>(items: T[]) =>
  [...items].sort((a, b) => (a.updatedAt === b.updatedAt ? 0 : a.updatedAt && b.updatedAt ? (a.updatedAt > b.updatedAt ? -1 : 1) : 0));

export class MaxiCloudRepository implements IMaxiCloudRepository {
  async listUsers(): Promise<UserAccount[]> {
    return state.users.map((item) => ({ ...item }));
  }

  async listProjects(): Promise<Project[]> {
    return desc(state.projects).map((item) => ({ ...item }));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const item = state.projects.find((target) => target.id === id);
    return item ? { ...item } : undefined;
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const created: Project = {
      id: id("prj"),
      name: input.name.trim(),
      description: input.description.trim(),
      ownerId: input.ownerId,
      visibility: input.visibility,
      updatedAt: nowLabel(),
    };
    state.projects.unshift(created);
    return { ...created };
  }

  async listServices(): Promise<Service[]> {
    return desc(state.services).map((item) => ({ ...item }));
  }

  async getService(id: string): Promise<Service | undefined> {
    const item = state.services.find((target) => target.id === id);
    return item ? { ...item } : undefined;
  }

  async createService(input: CreateServiceInput): Promise<Service> {
    const created: Service = {
      id: id("svc"),
      projectId: input.projectId,
      name: input.name.trim(),
      repository: input.repository.trim(),
      branch: input.branch.trim(),
      runtime: input.runtime.trim(),
      status: "healthy",
      url: input.url.trim(),
      updatedAt: nowLabel(),
      cpu: input.cpu,
      memory: input.memory,
      ownerId: input.ownerId,
    };
    state.services.unshift(created);
    return { ...created };
  }

  async listJobs(): Promise<Job[]> {
    return desc(state.jobs).map((item) => ({ ...item }));
  }

  async getJob(id: string): Promise<Job | undefined> {
    const item = state.jobs.find((target) => target.id === id);
    return item ? { ...item } : undefined;
  }

  async listJobRunsByJob(jobId: string): Promise<JobRun[]> {
    return state.jobRuns
      .filter((item) => item.jobId === jobId)
      .map((item) => ({ ...item }));
  }

  async createJob(input: CreateJobInput): Promise<Job> {
    const created: Job = {
      id: id("job"),
      projectId: input.projectId,
      name: input.name.trim(),
      command: input.command.trim(),
      trigger: input.trigger,
      schedule: input.schedule,
      sourceServiceId: input.sourceServiceId,
      ownerId: input.ownerId,
      updatedAt: nowLabel(),
      lastRunStatus: undefined,
      lastRunAt: undefined,
    };
    state.jobs.unshift(created);
    return { ...created };
  }

  async listDeployments(): Promise<DeploymentRun[]> {
    return state.deployments.map((item) => ({ ...item }));
  }

  async getDeployment(id: string): Promise<DeploymentRun | undefined> {
    const item = state.deployments.find((target) => target.id === id);
    return item ? { ...item } : undefined;
  }

  async listDeployEventsByDeployment(deploymentId: string): Promise<DeployEvent[]> {
    return state.deployEvents
      .filter((item) => item.deploymentId === deploymentId)
      .map((item) => ({ ...item }));
  }

  async createDeployment(input: CreateDeploymentInput): Promise<DeploymentRun> {
    const created: DeploymentRun = {
      id: id("dep"),
      serviceId: input.serviceId,
      ownerId: input.ownerId,
      revision: input.revision.trim(),
      commit: input.commit.trim(),
      status: "running",
      startedAt: "now",
      duration: "0s",
    };

    const createdEvent: DeployEvent = {
      id: id("evt"),
      deploymentId: created.id,
      kind: "deploy",
      title: `Deployment Created (${input.strategy})`,
      timestamp: "now",
      detail: `strategy=${input.strategy}`,
    };

    state.deployments.unshift(created);
    state.deployEvents.unshift(createdEvent);

    return { ...created };
  }

  async listTemplates(): Promise<StackTemplate[]> {
    return state.templates.map((item) => ({ ...item }));
  }

  async getTemplate(id: string): Promise<StackTemplate | undefined> {
    const item = state.templates.find((target) => target.id === id);
    return item ? { ...item } : undefined;
  }

  async listGitHubRepositories(): Promise<GitRepository[]> {
    return state.githubRepositories.map((item) => ({ ...item }));
  }

  async getWorkspaceSettings(): Promise<WorkspaceSettings> {
    return { ...state.workspaceSettings };
  }

  async listWorkspaceSecrets(): Promise<WorkspaceSecret[]> {
    return state.workspaceSecrets.map((item) => ({ ...item }));
  }
}

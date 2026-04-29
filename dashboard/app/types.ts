export type UserStatus = "active" | "invited" | "suspended";

export type ApplicationStatus = "healthy" | "degraded" | "unhealthy" | "sleeping";
export type DeploymentStatus = "success" | "running" | "failed";
export type ProjectVisibility = "private" | "members" | "public";
export type JobTrigger = "manual" | "predeploy" | "schedule";

export type UserAccount = {
  id: string;
  displayId: string;
  displayName: string;
  email: string;
  status: UserStatus;
  joinedAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  visibility: ProjectVisibility;
  updatedAt: string;
};

export type Application = {
  id: string;
  projectId: string;
  name: string;
  repository: string;
  branch: string;
  runtime: string;
  status: ApplicationStatus;
  url: string;
  updatedAt: string;
  cpu: string;
  memory: string;
  ownerId: string;
};

export type DeploymentRun = {
  id: string;
  applicationId: string;
  ownerId: string;
  revision: string;
  commit: string;
  status: DeploymentStatus;
  startedAt: string;
  duration: string;
};

export type Job = {
  id: string;
  projectId: string;
  name: string;
  command: string;
  trigger: JobTrigger;
  schedule?: string;
  sourceApplicationId?: string;
  ownerId: string;
  updatedAt: string;
  lastRunStatus?: DeploymentStatus;
  lastRunAt?: string;
};

export type JobRun = {
  id: string;
  jobId: string;
  ownerId: string;
  status: DeploymentStatus;
  startedAt: string;
  duration: string;
  trigger: JobTrigger;
};

export type DeployEvent = {
  id: string;
  deploymentId: string;
  kind: "build" | "deploy" | "route" | "warning";
  title: string;
  timestamp: string;
  detail: string;
};

export type StackTemplate = {
  id: string;
  title: string;
  description: string;
  dockerfile: string;
  envKeys: string[];
  badge: string;
};

export type GitRepository = {
  id: string;
  provider: "github";
  fullName: string;
  defaultBranch: string;
  branches: string[];
  detectedFiles: string[];
  detectedTemplateId?: string;
  dockerfilePaths: string[];
  detectedRuntime: string;
  buildCommand: string;
  outputDirectory: string;
};

import {
  DEPLOYMENTS,
  DEPLOY_EVENTS,
  GITHUB_REPOSITORIES,
  PROJECTS,
  APPLICATIONS,
  USERS,
} from "~/mock/projects";
import type {
  DeployEvent,
  DeploymentRun,
  GitRepository,
  Project,
  Application,
  UserAccount,
} from "~/types";

export type WorkspaceSettings = {
  namespace: string;
  registry: string;
};

export type WorkspaceSecret = {
  key: string;
};

export type MockState = {
  users: UserAccount[];
  projects: Project[];
  applications: Application[];
  deployments: DeploymentRun[];
  deployEvents: DeployEvent[];
  githubRepositories: GitRepository[];
  workspaceSettings: WorkspaceSettings;
  workspaceSecrets: WorkspaceSecret[];
};

export const state: MockState = {
  users: USERS.map((item) => ({ ...item })),
  projects: PROJECTS.map((item) => ({ ...item })),
  applications: APPLICATIONS.map((item) => ({ ...item })),
  deployments: DEPLOYMENTS.map((item) => ({ ...item })),
  deployEvents: DEPLOY_EVENTS.map((item) => ({ ...item })),
  githubRepositories: GITHUB_REPOSITORIES.map((item) => ({ ...item })),
  workspaceSettings: {
    namespace: "maxicloud-prod",
    registry: "ghcr.io/maximum",
  },
  workspaceSecrets: [
    { key: "DISCORD_BOT_TOKEN" },
    { key: "SENTRY_DSN" },
    { key: "DATABASE_URL" },
    { key: "SLACK_WEBHOOK_URL" },
  ],
};

export const makeID = (prefix: string) => `${prefix}-${Date.now().toString(36)}`;
export const nowLabel = () => "just now";

export const sortByUpdatedDesc = <T extends { updatedAt?: string }>(items: T[]) =>
  [...items].sort((a, b) => {
    if (a.updatedAt === b.updatedAt) return 0;
    if (a.updatedAt && b.updatedAt) return a.updatedAt > b.updatedAt ? -1 : 1;
    return 0;
  });

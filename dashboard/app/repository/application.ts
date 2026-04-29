import type { Application } from "~/types";
import { makeID, nowLabel, sortByUpdatedDesc, state } from "~/repository/shared/state";

export type CreateApplicationInput = {
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

export interface IApplicationRepository {
  listApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  createApplication(input: CreateApplicationInput): Promise<Application>;
}

export class ApplicationRepository implements IApplicationRepository {
  async listApplications(): Promise<Application[]> {
    return sortByUpdatedDesc(state.applications).map((item) => ({ ...item }));
  }

  async getApplication(id: string): Promise<Application | undefined> {
    const item = state.applications.find((target) => target.id === id);
    return item ? { ...item } : undefined;
  }

  async createApplication(input: CreateApplicationInput): Promise<Application> {
    const created: Application = {
      id: makeID("svc"),
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
    state.applications.unshift(created);
    return { ...created };
  }
}

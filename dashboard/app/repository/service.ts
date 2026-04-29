import type { Service } from "~/types";
import { makeID, nowLabel, sortByUpdatedDesc, state } from "~/repository/shared/state";

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

export interface IServiceRepository {
  listServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(input: CreateServiceInput): Promise<Service>;
}

export class ServiceRepository implements IServiceRepository {
  async listServices(): Promise<Service[]> {
    return sortByUpdatedDesc(state.services).map((item) => ({ ...item }));
  }

  async getService(id: string): Promise<Service | undefined> {
    const item = state.services.find((target) => target.id === id);
    return item ? { ...item } : undefined;
  }

  async createService(input: CreateServiceInput): Promise<Service> {
    const created: Service = {
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
    state.services.unshift(created);
    return { ...created };
  }
}

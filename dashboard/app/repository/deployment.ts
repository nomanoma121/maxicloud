import type { DeployEvent, DeploymentRun } from "~/types";
import { makeID, state } from "~/repository/shared/state";

export type CreateDeploymentInput = {
  serviceId: string;
  ownerId: string;
  revision: string;
  commit: string;
  strategy: string;
};

export interface IDeploymentRepository {
  listDeployments(): Promise<DeploymentRun[]>;
  getDeployment(id: string): Promise<DeploymentRun | undefined>;
  listDeployEventsByDeployment(deploymentId: string): Promise<DeployEvent[]>;
  createDeployment(input: CreateDeploymentInput): Promise<DeploymentRun>;
}

export class DeploymentRepository implements IDeploymentRepository {
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
      id: makeID("dep"),
      serviceId: input.serviceId,
      ownerId: input.ownerId,
      revision: input.revision.trim(),
      commit: input.commit.trim(),
      status: "running",
      startedAt: "now",
      duration: "0s",
    };

    const createdEvent: DeployEvent = {
      id: makeID("evt"),
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
}

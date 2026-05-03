import { ConnectError, Code } from "@connectrpc/connect";
import {
  type Deployment as ProtoDeployment,
  DeploymentStatus,
} from "~/gen/maxicloud/v1/deployment_pb";
import type { DeployEvent, DeploymentRun } from "~/types";
import { connectClient } from "~/utils/connect";
import { formatDuration, formatTimestamp } from "~/utils/date";

export interface IDeploymentRepository {
  listDeployments(): Promise<DeploymentRun[]>;
  getDeployment(id: string): Promise<DeploymentRun | undefined>;
  listDeployEventsByDeployment(deploymentId: string): Promise<DeployEvent[]>;
}

const mapStatus = (status: DeploymentStatus): DeploymentRun["status"] => {
  switch (status) {
    case DeploymentStatus.SUCCESS:
      return "success";
    case DeploymentStatus.RUNNING:
      return "running";
    case DeploymentStatus.FAILED:
      return "failed";
    default:
      return "running";
  }
};

const toDeployment = (deployment: ProtoDeployment): DeploymentRun => {
  const sha = deployment.commit?.sha ?? "";
  const shortSHA = sha.length > 8 ? sha.slice(0, 8) : sha;
  return {
    id: deployment.id,
    applicationId: deployment.applicationId,
    ownerId: deployment.ownerUserId,
    revision: shortSHA || "-",
    commit: sha || "-",
    commitMessage: deployment.commit?.message || "-",
    commitAuthor: deployment.commit?.authorName || "-",
    commitTimestamp: formatTimestamp(deployment.commit?.timestamp),
    status: mapStatus(deployment.status),
    startedAt: formatTimestamp(deployment.startedAt),
    finishedAt: formatTimestamp(deployment.finishedAt),
    duration: formatDuration(deployment.startedAt, deployment.finishedAt),
  };
};

const makeEvents = (deployment: DeploymentRun): DeployEvent[] => {
  const statusTitle =
    deployment.status === "success"
      ? "Deployment succeeded"
      : deployment.status === "failed"
        ? "Deployment failed"
        : "Deployment running";

  return [
    {
      id: `${deployment.id}-deploy`,
      deploymentId: deployment.id,
      kind: "deploy",
      title: statusTitle,
      timestamp: deployment.startedAt,
      detail: `commit=${deployment.commit}`,
    },
  ];
};

export class DeploymentRepository implements IDeploymentRepository {
  async listDeployments(): Promise<DeploymentRun[]> {
    const { projects } = await connectClient.project.listProjects({});
    const list = await Promise.all(
      projects.map(async (project) =>
        connectClient.application.listApplications({ projectId: project.id }),
      ),
    );

    const applications = list.flatMap((item) => item.applications);
    const deployments = await Promise.all(
      applications.map(async (application) =>
        connectClient.deployment.listDeployments({ applicationId: application.id }),
      ),
    );

    return deployments
      .flatMap((item) => item.deployments)
      .map(toDeployment)
      .sort((a, b) => (a.startedAt > b.startedAt ? -1 : 1));
  }

  async getDeployment(id: string): Promise<DeploymentRun | undefined> {
    try {
      const res = await connectClient.deployment.getDeployment({ deploymentId: id });
      if (!res.deployment) {
        return undefined;
      }
      return toDeployment(res.deployment);
    } catch (error) {
      if (error instanceof ConnectError && error.code === Code.NotFound) {
        return undefined;
      }
      throw error;
    }
  }

  async listDeployEventsByDeployment(deploymentId: string): Promise<DeployEvent[]> {
    const deployment = await this.getDeployment(deploymentId);
    if (!deployment) {
      return [];
    }
    return makeEvents(deployment);
  }
}

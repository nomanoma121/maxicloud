import { ConnectError, Code } from "@connectrpc/connect";
import {
  type Deployment as ProtoDeployment,
  DeploymentStatus as ProtoDeploymentStatus,
} from "~/gen/maxicloud/v1/deployment_pb";
import {
  DEPLOYMENT_STATUS,
  type ValueOf,
} from "~/constants";
import { connectClient } from "~/utils/connect";
import { formatDuration, formatTimestamp } from "~/utils/date";

export type DeploymentStatus = ValueOf<typeof DEPLOYMENT_STATUS>;

export type Deployment = {
  id: string;
  applicationId: string;
  ownerId: string;
  revision: string;
  commit: string;
  commitMessage: string;
  commitAuthor: string;
  commitTimestamp: string;
  status: DeploymentStatus;
  startedAt: string;
  finishedAt: string;
  duration: string;
};

export interface IDeploymentRepository {
  listDeployments$$key(): readonly ["deployments"];
  getDeployment$$key(id: string): readonly ["deployments", string];
  listDeployments(): Promise<Deployment[]>;
  getDeployment(id: string): Promise<Deployment | undefined>;
}

const mapStatus = (status: ProtoDeploymentStatus): Deployment["status"] => {
  switch (status) {
    case ProtoDeploymentStatus.SUCCESS:
      return DEPLOYMENT_STATUS.SUCCESS;
    case ProtoDeploymentStatus.IN_PROGRESS:
      return DEPLOYMENT_STATUS.IN_PROGRESS;
    case ProtoDeploymentStatus.FAILED:
      return DEPLOYMENT_STATUS.FAILED;
    default:
      return DEPLOYMENT_STATUS.IN_PROGRESS;
  }
};

const toDeployment = (deployment: ProtoDeployment): Deployment => {
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

export class DeploymentRepository implements IDeploymentRepository {
  listDeployments$$key() {
    return ["deployments"] as const;
  }

  getDeployment$$key(id: string) {
    return ["deployments", id] as const;
  }

  async listDeployments(): Promise<Deployment[]> {
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

  async getDeployment(id: string): Promise<Deployment | undefined> {
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
}

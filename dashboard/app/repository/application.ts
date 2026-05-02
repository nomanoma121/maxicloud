import { ConnectError, Code } from "@connectrpc/connect";
import {
  AccessMode,
  type Application as ProtoApplication,
  ApplicationStatus,
  BuildStrategy,
  DockerfileSource,
} from "~/gen/maxicloud/v1/application_pb";
import type { Application } from "~/types";
import { connectClient } from "~/utils/connect";
import { formatTimestamp } from "~/utils/date";

export type CreateApplicationInput = {
  projectId: string;
  ownerId: string;
  name: string;
  repositoryOwner: string;
  repositoryName: string;
  branch: string;
  dockerfileSource: "path" | "inline";
  dockerfilePath: string;
  dockerfileInline: string;
  accessMode: "public" | "private" | "idp";
  domainSubdomain?: string;
  domainRootDomain?: string;
  port: number;
  environmentVariables: Record<string, string>;
  secrets: Record<string, string>;
};

export interface IApplicationRepository {
  listApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  createApplication(input: CreateApplicationInput): Promise<Application>;
}

const mapStatus = (status: ApplicationStatus): Application["status"] => {
  switch (status) {
    case ApplicationStatus.HEALTHY:
      return "healthy";
    case ApplicationStatus.DEGRADED:
      return "degraded";
    case ApplicationStatus.UNHEALTHY:
      return "unhealthy";
    case ApplicationStatus.SLEEPING:
      return "sleeping";
    default:
      return "degraded";
  }
};

const parseRepository = (owner = "", name = "") => {
  if (owner && name) {
    return `${owner}/${name}`;
  }
  return "-";
};

const toApplication = (application: ProtoApplication): Application => {
  const repository = parseRepository(
    application.source?.repository?.owner,
    application.source?.repository?.name,
  );

  return {
    id: application.id,
    projectId: application.projectId,
    name: application.name,
    repository,
    branch: application.source?.branch ?? "main",
    runtime: "Dockerfile",
    status: mapStatus(application.status),
    url: application.url || "-",
    updatedAt: formatTimestamp(application.updatedAt),
    cpu: "-",
    memory: "-",
    ownerId: application.ownerUserId,
  };
};

const toAccessMode = (accessMode: CreateApplicationInput["accessMode"]): AccessMode => {
  switch (accessMode) {
    case "public":
      return AccessMode.PUBLIC;
    case "private":
      return AccessMode.PRIVATE;
    case "idp":
      return AccessMode.MEMBERS_ONLY;
    default:
      return AccessMode.UNSPECIFIED;
  }
};

export class ApplicationRepository implements IApplicationRepository {
  async listApplications(): Promise<Application[]> {
    const { projects } = await connectClient.project.listProjects({});
    const all: Application[] = [];

    await Promise.all(
      projects.map(async (project) => {
        const res = await connectClient.application.listApplications({
          projectId: project.id,
        });
        all.push(...res.applications.map(toApplication));
      }),
    );

    return all.sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
  }

  async getApplication(id: string): Promise<Application | undefined> {
    try {
      const res = await connectClient.application.getApplication({ applicationId: id });
      if (!res.application) {
        return undefined;
      }
      return toApplication(res.application);
    } catch (error) {
      if (error instanceof ConnectError && error.code === Code.NotFound) {
        return undefined;
      }
      throw error;
    }
  }

  async createApplication(input: CreateApplicationInput): Promise<Application> {
    const res = await connectClient.application.createApplication({
      name: input.name.trim(),
      ownerId: input.ownerId,
      spec: {
        projectId: input.projectId,
        source: {
          repository: {
            owner: input.repositoryOwner,
            name: input.repositoryName,
          },
          branch: input.branch,
        },
        build: {
          strategy: BuildStrategy.DOCKERFILE,
          dockerfile: {
            source:
              input.dockerfileSource === "inline"
                ? DockerfileSource.INLINE
                : DockerfileSource.PATH,
            dockerfilePath: input.dockerfilePath,
            dockerfileInline: input.dockerfileInline,
          },
        },
        access: {
          mode: toAccessMode(input.accessMode),
          domain:
            input.accessMode === "private"
              ? undefined
              : {
                  subdomain: input.domainSubdomain ?? "",
                  rootDomain: input.domainRootDomain ?? "",
                },
          port: input.port,
        },
        environmentVariables: input.environmentVariables,
        secrets: input.secrets,
      },
    });

    if (!res.application) {
      throw new Error("CreateApplication returned empty application");
    }

    return toApplication(res.application);
  }
}

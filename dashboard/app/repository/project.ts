import { ConnectError, Code } from "@connectrpc/connect";
import type { Project as ProtoProject } from "~/gen/maxicloud/v1/project_pb";
import type { Project } from "~/types";
import { connectClient } from "~/utils/connect";
import { formatTimestamp } from "~/utils/date";

export type CreateProjectInput = {
  name: string;
  description: string;
  ownerId: string;
};

export interface IProjectRepository {
  listProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(input: CreateProjectInput): Promise<Project>;
  deleteProject(id: string): Promise<void>;
}

const toProject = (project: ProtoProject): Project => ({
  id: project.id,
  name: project.name,
  description: project.description,
  ownerId: project.ownerUserId,
  updatedAt: formatTimestamp(project.updatedAt),
});

export class ProjectRepository implements IProjectRepository {
  async listProjects(): Promise<Project[]> {
    const res = await connectClient.project.listProjects({});
    return res.projects.map(toProject);
  }

  async getProject(id: string): Promise<Project | undefined> {
    try {
      const res = await connectClient.project.getProject({ projectId: id });
      if (!res.project) {
        return undefined;
      }
      return toProject(res.project);
    } catch (error) {
      if (error instanceof ConnectError && error.code === Code.NotFound) {
        return undefined;
      }
      throw error;
    }
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const res = await connectClient.project.createProject({
      name: input.name.trim(),
      description: input.description.trim(),
      ownerUserId: input.ownerId,
    });
    if (!res.project) {
      throw new Error("CreateProject returned empty project");
    }
    return toProject(res.project);
  }

  async deleteProject(id: string): Promise<void> {
    await connectClient.project.deleteProject({ projectId: id });
  }
}

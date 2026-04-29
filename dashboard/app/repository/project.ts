import type { Project, ProjectVisibility } from "~/types";
import { makeID, nowLabel, sortByUpdatedDesc, state } from "~/repository/shared/state";

export type CreateProjectInput = {
  name: string;
  description: string;
  visibility: ProjectVisibility;
  ownerId: string;
};

export interface IProjectRepository {
  listProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(input: CreateProjectInput): Promise<Project>;
}

export class ProjectRepository implements IProjectRepository {
  async listProjects(): Promise<Project[]> {
    return sortByUpdatedDesc(state.projects).map((item) => ({ ...item }));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const item = state.projects.find((target) => target.id === id);
    return item ? { ...item } : undefined;
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const created: Project = {
      id: makeID("prj"),
      name: input.name.trim(),
      description: input.description.trim(),
      ownerId: input.ownerId,
      visibility: input.visibility,
      updatedAt: nowLabel(),
    };
    state.projects.unshift(created);
    return { ...created };
  }
}

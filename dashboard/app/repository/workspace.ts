import { state, type WorkspaceSecret, type WorkspaceSettings } from "~/repository/shared/state";

export interface IWorkspaceRepository {
  getWorkspaceSettings(): Promise<WorkspaceSettings>;
  listWorkspaceSecrets(): Promise<WorkspaceSecret[]>;
}

export class WorkspaceRepository implements IWorkspaceRepository {
  async getWorkspaceSettings(): Promise<WorkspaceSettings> {
    return { ...state.workspaceSettings };
  }

  async listWorkspaceSecrets(): Promise<WorkspaceSecret[]> {
    return state.workspaceSecrets.map((item) => ({ ...item }));
  }
}

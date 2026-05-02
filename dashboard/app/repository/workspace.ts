export type WorkspaceSettings = {
  namespace: string;
  registry: string;
};

export type WorkspaceSecret = {
  key: string;
};

export interface IWorkspaceRepository {
  getWorkspaceSettings(): Promise<WorkspaceSettings>;
  listWorkspaceSecrets(): Promise<WorkspaceSecret[]>;
}

export class WorkspaceRepository implements IWorkspaceRepository {
  async getWorkspaceSettings(): Promise<WorkspaceSettings> {
    return {
      namespace: "maxicloud-system",
      registry: "kind-registry:5000",
    };
  }

  async listWorkspaceSecrets(): Promise<WorkspaceSecret[]> {
    return [];
  }
}

import type { GitRepository } from "~/types";
import { state } from "~/repository/shared/state";

export interface ISourceRepository {
  listGitHubRepositories(): Promise<GitRepository[]>;
}

export class SourceRepository implements ISourceRepository {
  async listGitHubRepositories(): Promise<GitRepository[]> {
    return state.githubRepositories.map((item) => ({ ...item }));
  }
}

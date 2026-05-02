import type { GitRepository } from "~/types";
import { connectClient } from "~/utils/connect";

export interface ISourceRepository {
  listGitHubRepositories(): Promise<GitRepository[]>;
}

const detectRuntime = (files: string[]): string => {
  const names = files.map((file) => file.toLowerCase());
  if (names.some((file) => file.includes("go.mod"))) {
    return "Go";
  }
  if (names.some((file) => file.includes("requirements.txt") || file.includes("pyproject.toml"))) {
    return "Python";
  }
  if (names.some((file) => file.includes("package.json"))) {
    return "Node.js";
  }
  return "Dockerfile";
};

export class SourceRepository implements ISourceRepository {
  async listGitHubRepositories(): Promise<GitRepository[]> {
    const res = await connectClient.application.listGitRepositories({});
    return res.repositories.map((repository) => {
      const detectedFiles = repository.detectedFile;
      return {
        id: repository.id,
        provider: "github",
        fullName: repository.id,
        defaultBranch: repository.defaultBranch,
        branches: repository.branches,
        detectedFiles,
        dockerfilePaths:
          repository.dockerfilePaths.length > 0
            ? repository.dockerfilePaths
            : ["Dockerfile"],
        detectedRuntime: detectRuntime(detectedFiles),
        buildCommand: "",
        outputDirectory: "",
      } satisfies GitRepository;
    });
  }
}

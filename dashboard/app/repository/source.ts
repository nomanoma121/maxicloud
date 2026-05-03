import { Code, ConnectError } from "@connectrpc/connect";
import type { GitRepository } from "~/types";
import { connectClient } from "~/utils/connect";

export interface ISourceRepository {
  listGitHubRepositories(): Promise<GitRepository[]>;
  listGitHubBranches(fullName: string): Promise<string[]>;
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

const parseRepositoryFullName = (fullName: string): { owner: string; name: string } => {
  const [owner = "", name = ""] = fullName.split("/", 2);
  return { owner, name };
};

const mapLegacyRepositories = (repositories: Awaited<ReturnType<typeof connectClient.application.listGitRepositories>>["repositories"]): GitRepository[] => {
  return repositories.map((repository) => {
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
};

const findLegacyBranches = (
  repositories: Awaited<ReturnType<typeof connectClient.application.listGitRepositories>>["repositories"],
  fullName: string,
): string[] => {
  const target = repositories.find((repository) => repository.id === fullName);
  if (!target || target.branches.length === 0) {
    return ["main"];
  }
  return target.branches;
};

export class SourceRepository implements ISourceRepository {
  async listGitHubRepositories(): Promise<GitRepository[]> {
    try {
      const { repositories } = await connectClient.github.listRepositories({});
      return repositories.map((repository) => {
        const fullName = `${repository.owner}/${repository.name}`;
        return {
          id: fullName,
          provider: "github",
          fullName,
          defaultBranch: "main",
          branches: [],
          detectedFiles: [],
          dockerfilePaths: ["Dockerfile"],
          detectedRuntime: "Dockerfile",
          buildCommand: "",
          outputDirectory: "",
        } satisfies GitRepository;
      });
    } catch (error) {
      if (!(error instanceof ConnectError) || error.code !== Code.Unimplemented) {
        throw error;
      }

      // Fallback for older gateway versions that still expose repository listing via ApplicationService.
      const legacy = await connectClient.application.listGitRepositories({});
      return mapLegacyRepositories(legacy.repositories);
    }
  }

  async listGitHubBranches(fullName: string): Promise<string[]> {
    const parsed = parseRepositoryFullName(fullName);
    if (!parsed.owner || !parsed.name) {
      return ["main"];
    }

    try {
      const res = await connectClient.github.listBranches({
        repository: {
          owner: parsed.owner,
          name: parsed.name,
        },
      });
      if (res.branches.length === 0) {
        return ["main"];
      }
      return res.branches;
    } catch (error) {
      if (!(error instanceof ConnectError) || error.code !== Code.Unimplemented) {
        throw error;
      }

      const legacy = await connectClient.application.listGitRepositories({});
      return findLegacyBranches(legacy.repositories, fullName);
    }
  }
}

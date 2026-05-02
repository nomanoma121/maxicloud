import { ApplicationRepository } from "~/repository/application";
import { DeploymentRepository } from "~/repository/deployment";
import { ProjectRepository } from "~/repository/project";
import { SourceRepository } from "~/repository/source";
import { UserRepository } from "~/repository/user";
import { WorkspaceRepository } from "~/repository/workspace";

export const DefaultRepositories = {
  userRepository: new UserRepository(),
  projectRepository: new ProjectRepository(),
  applicationRepository: new ApplicationRepository(),
  deploymentRepository: new DeploymentRepository(),
  sourceRepository: new SourceRepository(),
  workspaceRepository: new WorkspaceRepository(),
};

export * from "~/repository/application";
export * from "~/repository/deployment";
export * from "~/repository/project";
export * from "~/repository/source";
export * from "~/repository/user";
export * from "~/repository/workspace";

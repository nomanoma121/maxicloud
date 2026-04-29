import { DeploymentRepository } from "~/repository/deployment";
import { ProjectRepository } from "~/repository/project";
import { ServiceRepository } from "~/repository/service";
import { SourceRepository } from "~/repository/source";
import { UserRepository } from "~/repository/user";
import { WorkspaceRepository } from "~/repository/workspace";

export const DefaultRepositories = {
  userRepository: new UserRepository(),
  projectRepository: new ProjectRepository(),
  serviceRepository: new ServiceRepository(),
  deploymentRepository: new DeploymentRepository(),
  sourceRepository: new SourceRepository(),
  workspaceRepository: new WorkspaceRepository(),
};

export * from "~/repository/deployment";
export * from "~/repository/project";
export * from "~/repository/service";
export * from "~/repository/shared/state";
export * from "~/repository/source";
export * from "~/repository/user";
export * from "~/repository/workspace";

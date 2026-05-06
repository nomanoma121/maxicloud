import { ApplicationRepository } from "~/repository/application";
import { DeploymentRepository } from "~/repository/deployment";
import { DomainRepository } from "~/repository/domain";
import { ProjectRepository } from "~/repository/project";
import { SourceRepository } from "~/repository/source";
import { UserRepository } from "~/repository/user";

export const DefaultRepositories = {
  userRepository: new UserRepository(),
  projectRepository: new ProjectRepository(),
  applicationRepository: new ApplicationRepository(),
  deploymentRepository: new DeploymentRepository(),
  domainRepository: new DomainRepository(),
  sourceRepository: new SourceRepository(),
};

export * from "~/repository/application";
export * from "~/repository/deployment";
export * from "~/repository/domain";
export * from "~/repository/project";
export * from "~/repository/source";
export * from "~/repository/user";

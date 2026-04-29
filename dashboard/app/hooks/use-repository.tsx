import { createContext, useContext } from "react";
import { DefaultRepositories } from "~/repository";
import type { IDeploymentRepository } from "~/repository/deployment";
import type { IProjectRepository } from "~/repository/project";
import type { IServiceRepository } from "~/repository/service";
import type { ISourceRepository } from "~/repository/source";
import type { IUserRepository } from "~/repository/user";
import type { IWorkspaceRepository } from "~/repository/workspace";

export interface RepositoryContextProps {
  userRepository: IUserRepository;
  projectRepository: IProjectRepository;
  serviceRepository: IServiceRepository;
  deploymentRepository: IDeploymentRepository;
  sourceRepository: ISourceRepository;
  workspaceRepository: IWorkspaceRepository;
}

const RepositoryContext =
  createContext<RepositoryContextProps>(DefaultRepositories);

export const RepositoryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <RepositoryContext.Provider value={DefaultRepositories}>
      {children}
    </RepositoryContext.Provider>
  );
};

export const useRepository = () => {
  return useContext(RepositoryContext);
};

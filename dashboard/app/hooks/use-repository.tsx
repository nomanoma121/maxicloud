import { createContext, useContext } from "react";
import { DefaultRepositories } from "~/repository";
import type { IApplicationRepository } from "~/repository/application";
import type { IDeploymentRepository } from "~/repository/deployment";
import type { IDomainRepository } from "~/repository/domain";
import type { IProjectRepository } from "~/repository/project";
import type { ISourceRepository } from "~/repository/source";
import type { IUserRepository } from "~/repository/user";

export interface RepositoryContextProps {
	userRepository: IUserRepository;
	projectRepository: IProjectRepository;
	applicationRepository: IApplicationRepository;
	deploymentRepository: IDeploymentRepository;
	domainRepository: IDomainRepository;
	sourceRepository: ISourceRepository;
}

const RepositoryContext =
	createContext<RepositoryContextProps>(DefaultRepositories);

export const RepositoryProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<RepositoryContext.Provider value={DefaultRepositories}>
			{children}
		</RepositoryContext.Provider>
	);
};

export const useRepository = () => {
	return useContext(RepositoryContext);
};

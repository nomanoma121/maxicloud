import { createContext, useContext } from "react";
import { DefaultRepositories } from "~/repository";
import type { IMaxiCloudRepository } from "~/repository/maxicloud";

export interface RepositoryContextProps {
  maxicloudRepository: IMaxiCloudRepository;
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

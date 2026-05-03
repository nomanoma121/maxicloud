import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";

export const useGitHubRepositories = () => {
  const { sourceRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.githubRepositories,
    queryFn: () => sourceRepository.listGitHubRepositories(),
  });
};

export const useGitHubBranches = (fullName: string) => {
  const { sourceRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.githubRepositoryBranches(fullName),
    enabled: fullName.length > 0,
    queryFn: () => sourceRepository.listGitHubBranches(fullName),
  });
};

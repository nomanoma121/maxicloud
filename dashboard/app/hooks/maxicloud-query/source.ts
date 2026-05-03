import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";
import { maxicloudQueryKeys } from "~/hooks/maxicloud-query/keys";

export const useGitHubRepositoriesQuery = () => {
  const { sourceRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.githubRepositories,
    queryFn: () => sourceRepository.listGitHubRepositories(),
  });
};

export const useGitHubBranchesQuery = (fullName: string) => {
  const { sourceRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.githubRepositoryBranches(fullName),
    enabled: fullName.length > 0,
    queryFn: () => sourceRepository.listGitHubBranches(fullName),
  });
};

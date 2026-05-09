import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";

export const useGitHubRepositories = () => {
	const { sourceRepository } = useRepository();
	return useQuery({
		queryKey: sourceRepository.listGitHubRepositories$$key(),
		queryFn: () => sourceRepository.listGitHubRepositories(),
	});
};

export const useGitHubBranches = (fullName: string) => {
	const { sourceRepository } = useRepository();
	return useQuery({
		queryKey: sourceRepository.listGitHubBranches$$key(fullName),
		enabled: fullName.length > 0,
		queryFn: () => sourceRepository.listGitHubBranches(fullName),
	});
};

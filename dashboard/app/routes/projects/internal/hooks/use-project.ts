import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";

export const useProject = (projectId: string) => {
	const { projectRepository } = useRepository();
	return useQuery({
		queryKey: projectRepository.getProject$$key(projectId),
		enabled: projectId.length > 0,
		queryFn: () => projectRepository.getProject(projectId),
	});
};

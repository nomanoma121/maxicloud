import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";

export const useProject = (projectId: string) => {
  const { projectRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.project(projectId),
    enabled: projectId.length > 0,
    queryFn: () => projectRepository.getProject(projectId),
  });
};

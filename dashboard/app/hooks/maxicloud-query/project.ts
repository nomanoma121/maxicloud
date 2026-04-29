import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";
import { maxicloudQueryKeys } from "~/hooks/maxicloud-query/keys";

export const useProjectsQuery = () => {
  const { projectRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.projects,
    queryFn: () => projectRepository.listProjects(),
  });
};

export const useProjectQuery = (projectId: string) => {
  const { projectRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.project(projectId),
    enabled: projectId.length > 0,
    queryFn: () => projectRepository.getProject(projectId),
  });
};

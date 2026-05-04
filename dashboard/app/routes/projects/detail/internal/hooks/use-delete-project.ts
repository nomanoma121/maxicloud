import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";

export const useDeleteProject = () => {
  const { projectRepository } = useRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectRepository.deleteProject(projectId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deployments }),
      ]);
    },
  });
};

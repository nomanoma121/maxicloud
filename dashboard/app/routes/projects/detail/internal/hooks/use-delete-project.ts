import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";
import { useToast } from "~/hooks/use-toast";

export const useDeleteProject = () => {
  const { projectRepository, applicationRepository, deploymentRepository } = useRepository();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  return useMutation({
    mutationFn: (projectId: string) => projectRepository.deleteProject(projectId),
    onSuccess: () => {
      pushToast({ type: "success", title: "プロジェクトが削除されました" });
      queryClient.invalidateQueries({ queryKey: projectRepository.listProjects$$key() });
      queryClient.invalidateQueries({ queryKey: applicationRepository.listApplications$$key() });
      queryClient.invalidateQueries({ queryKey: deploymentRepository.listDeployments$$key() });
    },
    onError: (error) => {
      pushToast({
        type: "error",
        title: "プロジェクトの削除に失敗しました",
        description: error instanceof Error ? error.message : "unknown error",
      });
    },
  });
};

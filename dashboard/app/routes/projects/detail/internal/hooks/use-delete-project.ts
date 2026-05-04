import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";
import { useToast } from "~/hooks/use-toast";

export const useDeleteProject = () => {
  const { projectRepository } = useRepository();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  return useMutation({
    mutationFn: (projectId: string) => projectRepository.deleteProject(projectId),
    onSuccess: () => {
      pushToast({ type: "success", title: "プロジェクトが削除されました" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deployments });
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

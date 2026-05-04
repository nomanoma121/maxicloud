import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";
import { useToast } from "~/hooks/use-toast";

export const useDeleteApplication = () => {
  const { applicationRepository } = useRepository();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  return useMutation({
    mutationFn: (applicationId: string) =>
      applicationRepository.deleteApplication(applicationId),
    onSuccess: () => {
      pushToast({ type: "success", title: "アプリケーションが削除されました" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.deployments });
    },
    onError: (error) => {
      pushToast({
        type: "error",
        title: "アプリケーションの削除に失敗しました",
        description: error instanceof Error ? error.message : "unknown error",
      });
    },
  });
};

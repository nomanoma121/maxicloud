import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { APP_ROUTES, QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";
import { useToast } from "~/hooks/use-toast";
import type { CreateApplicationInput } from "~/repository/application";

export const useCreateApplication = () => {
  const { applicationRepository } = useRepository();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: CreateApplicationInput) =>
      applicationRepository.createApplication(input),
    onSuccess: (result) => {
      pushToast({ type: "success", title: "アプリケーションが作成されました" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      if (result.initialDeploymentID) {
        navigate(APP_ROUTES.deploymentDetail(result.initialDeploymentID));
      } else {
        navigate(APP_ROUTES.applications);
      }
    },
    onError: (error) => {
      pushToast({
        type: "error",
        title: "Failed to create application",
        description: error instanceof Error ? error.message : "unknown error",
      });
    },
  });
};

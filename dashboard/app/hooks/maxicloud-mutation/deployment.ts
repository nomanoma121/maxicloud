import { useMutation, useQueryClient } from "@tanstack/react-query";
import { maxicloudQueryKeys } from "~/hooks/maxicloud-query";
import { useRepository } from "~/hooks/use-repository";
import type { CreateDeploymentInput } from "~/repository/deployment";

export const useCreateDeploymentMutation = () => {
  const { deploymentRepository } = useRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDeploymentInput) =>
      deploymentRepository.createDeployment(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: maxicloudQueryKeys.deployments });
    },
  });
};

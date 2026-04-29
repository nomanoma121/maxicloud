import { useMutation, useQueryClient } from "@tanstack/react-query";
import { maxicloudQueryKeys } from "~/hooks/maxicloud-query";
import { useRepository } from "~/hooks/use-repository";
import type { CreateApplicationInput } from "~/repository/application";

export const useCreateApplicationMutation = () => {
  const { applicationRepository } = useRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateApplicationInput) =>
      applicationRepository.createApplication(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: maxicloudQueryKeys.applications }),
        queryClient.invalidateQueries({ queryKey: maxicloudQueryKeys.projects }),
      ]);
    },
  });
};

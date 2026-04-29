import { useMutation, useQueryClient } from "@tanstack/react-query";
import { maxicloudQueryKeys } from "~/hooks/maxicloud-query";
import { useRepository } from "~/hooks/use-repository";
import type { CreateServiceInput } from "~/repository/service";

export const useCreateServiceMutation = () => {
  const { serviceRepository } = useRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateServiceInput) =>
      serviceRepository.createService(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: maxicloudQueryKeys.services }),
        queryClient.invalidateQueries({ queryKey: maxicloudQueryKeys.projects }),
      ]);
    },
  });
};

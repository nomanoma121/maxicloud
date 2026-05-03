import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";
import type { CreateApplicationInput } from "~/repository/application";

export const useCreateApplication = () => {
  const { applicationRepository } = useRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateApplicationInput) =>
      applicationRepository.createApplication(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects }),
      ]);
    },
  });
};

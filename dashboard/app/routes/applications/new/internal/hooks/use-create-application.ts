import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";
import { useToast } from "~/hooks/use-toast";
import type { CreateApplicationInput } from "~/repository/application";

export const useCreateApplication = () => {
  const { applicationRepository } = useRepository();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  return useMutation({
    mutationFn: (input: CreateApplicationInput) =>
      applicationRepository.createApplication(input),
    onSuccess: () => {
      pushToast({ type: "success", title: "Application created" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.applications });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
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

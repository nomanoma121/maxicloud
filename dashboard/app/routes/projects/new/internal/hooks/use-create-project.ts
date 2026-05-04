import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";
import { useToast } from "~/hooks/use-toast";
import type { CreateProjectInput } from "~/repository/project";

export const useCreateProject = () => {
  const { projectRepository } = useRepository();
  const queryClient = useQueryClient();
  const { pushToast } = useToast();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectRepository.createProject(input),
    onSuccess: () => {
      pushToast({ type: "success", title: "Project created" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
    },
    onError: (error) => {
      pushToast({
        type: "error",
        title: "Failed to create project",
        description: error instanceof Error ? error.message : "unknown error",
      });
    },
  });
};

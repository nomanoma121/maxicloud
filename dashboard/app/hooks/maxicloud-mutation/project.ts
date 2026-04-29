import { useMutation, useQueryClient } from "@tanstack/react-query";
import { maxicloudQueryKeys } from "~/hooks/maxicloud-query";
import { useRepository } from "~/hooks/use-repository";
import type { CreateProjectInput } from "~/repository/project";

export const useCreateProjectMutation = () => {
  const { projectRepository } = useRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) =>
      projectRepository.createProject(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: maxicloudQueryKeys.projects });
    },
  });
};

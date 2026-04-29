import { useMutation, useQueryClient } from "@tanstack/react-query";
import { maxicloudQueryKeys } from "~/hooks/use-maxicloud-query";
import { useRepository } from "~/hooks/use-repository";
import type {
  CreateDeploymentInput,
  CreateJobInput,
  CreateProjectInput,
  CreateServiceInput,
} from "~/repository/maxicloud";

export const useCreateProjectMutation = () => {
  const { maxicloudRepository } = useRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProjectInput) =>
      maxicloudRepository.createProject(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: maxicloudQueryKeys.projects });
    },
  });
};

export const useCreateServiceMutation = () => {
  const { maxicloudRepository } = useRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateServiceInput) =>
      maxicloudRepository.createService(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: maxicloudQueryKeys.services }),
        queryClient.invalidateQueries({ queryKey: maxicloudQueryKeys.projects }),
      ]);
    },
  });
};

export const useCreateJobMutation = () => {
  const { maxicloudRepository } = useRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateJobInput) => maxicloudRepository.createJob(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: maxicloudQueryKeys.jobs });
    },
  });
};

export const useCreateDeploymentMutation = () => {
  const { maxicloudRepository } = useRepository();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDeploymentInput) =>
      maxicloudRepository.createDeployment(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: maxicloudQueryKeys.deployments });
    },
  });
};

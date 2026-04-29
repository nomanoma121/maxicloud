import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";
import { maxicloudQueryKeys } from "~/hooks/maxicloud-query/keys";

export const useWorkspaceSettingsQuery = () => {
  const { workspaceRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.workspaceSettings,
    queryFn: () => workspaceRepository.getWorkspaceSettings(),
  });
};

export const useWorkspaceSecretsQuery = () => {
  const { workspaceRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.workspaceSecrets,
    queryFn: () => workspaceRepository.listWorkspaceSecrets(),
  });
};

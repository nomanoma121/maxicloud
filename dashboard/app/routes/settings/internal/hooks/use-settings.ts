import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";

export const usePlatformSettings = () => {
  const { workspaceRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.workspaceSettings,
    queryFn: () => workspaceRepository.getWorkspaceSettings(),
  });
};

export const usePlatformSecrets = () => {
  const { workspaceRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.workspaceSecrets,
    queryFn: () => workspaceRepository.listWorkspaceSecrets(),
  });
};

import {
  useWorkspaceSecretsQuery,
  useWorkspaceSettingsQuery,
} from "~/hooks/use-maxicloud-query";

export const useWorkspaceData = () => {
  const { data: settings } = useWorkspaceSettingsQuery();
  const { data: secrets = [] } = useWorkspaceSecretsQuery();

  return {
    settings,
    secrets,
  };
};

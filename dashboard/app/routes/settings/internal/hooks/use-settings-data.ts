import {
  usePlatformSecrets,
  usePlatformSettings,
} from "~/routes/settings/internal/hooks/use-settings";

export const useSettingsData = () => {
  const { data: settings } = usePlatformSettings();
  const { data: secrets = [] } = usePlatformSecrets();

  return {
    settings,
    secrets,
  };
};

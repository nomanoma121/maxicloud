import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";
import { maxicloudQueryKeys } from "~/hooks/maxicloud-query/keys";

export const useApplicationsQuery = () => {
  const { applicationRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.applications,
    queryFn: () => applicationRepository.listApplications(),
  });
};

export const useApplicationQuery = (applicationId: string) => {
  const { applicationRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.application(applicationId),
    enabled: applicationId.length > 0,
    queryFn: () => applicationRepository.getApplication(applicationId),
  });
};

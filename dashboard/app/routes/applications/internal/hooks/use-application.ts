import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";

export const useApplication = (applicationId: string) => {
  const { applicationRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.application(applicationId),
    enabled: applicationId.length > 0,
    queryFn: () => applicationRepository.getApplication(applicationId),
  });
};

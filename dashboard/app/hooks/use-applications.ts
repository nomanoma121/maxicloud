import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";

export const useApplicationsQuery = () => {
  const { applicationRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.applications,
    queryFn: () => applicationRepository.listApplications(),
    initialData: [],
  });
};

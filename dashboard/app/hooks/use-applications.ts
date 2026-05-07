import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";

export const useApplicationsQuery = () => {
  const { applicationRepository } = useRepository();
  return useQuery({
    queryKey: applicationRepository.listApplications$$key(),
    queryFn: () => applicationRepository.listApplications(),
    initialData: [],
  });
};

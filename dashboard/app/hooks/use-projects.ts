import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";

export const useProjectsQuery = () => {
  const { projectRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: () => projectRepository.listProjects(),
    initialData: [],
  });
};

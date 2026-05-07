import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";

export const useProjectsQuery = () => {
  const { projectRepository } = useRepository();
  return useQuery({
    queryKey: projectRepository.listProjects$$key(),
    queryFn: () => projectRepository.listProjects(),
    initialData: [],
  });
};

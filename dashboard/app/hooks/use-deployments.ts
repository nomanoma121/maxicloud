import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";

export const useDeploymentsQuery = () => {
  const { deploymentRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.deployments,
    queryFn: () => deploymentRepository.listDeployments(),
  });
};

export const useDeploymentQuery = (deploymentId: string) => {
  const { deploymentRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.deployment(deploymentId),
    enabled: deploymentId.length > 0,
    queryFn: () => deploymentRepository.getDeployment(deploymentId),
  });
};

export const useDeployEventsQuery = (deploymentId: string) => {
  const { deploymentRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.deployEvents(deploymentId),
    enabled: deploymentId.length > 0,
    queryFn: () => deploymentRepository.listDeployEventsByDeployment(deploymentId),
  });
};

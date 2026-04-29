import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";
import { maxicloudQueryKeys } from "~/hooks/maxicloud-query/keys";

export const useDeploymentsQuery = () => {
  const { deploymentRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.deployments,
    queryFn: () => deploymentRepository.listDeployments(),
  });
};

export const useDeploymentQuery = (deploymentId: string) => {
  const { deploymentRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.deployment(deploymentId),
    enabled: deploymentId.length > 0,
    queryFn: () => deploymentRepository.getDeployment(deploymentId),
  });
};

export const useDeployEventsQuery = (deploymentId: string) => {
  const { deploymentRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.deployEvents(deploymentId),
    enabled: deploymentId.length > 0,
    queryFn: () => deploymentRepository.listDeployEventsByDeployment(deploymentId),
  });
};

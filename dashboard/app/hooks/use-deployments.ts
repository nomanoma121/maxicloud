import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";

export const useDeploymentsQuery = () => {
	const { deploymentRepository } = useRepository();
	return useQuery({
		queryKey: deploymentRepository.listDeployments$$key(),
		queryFn: () => deploymentRepository.listDeployments(),
		initialData: [],
	});
};

export const useDeploymentQuery = (deploymentId: string) => {
	const { deploymentRepository } = useRepository();
	return useQuery({
		queryKey: deploymentRepository.getDeployment$$key(deploymentId),
		enabled: deploymentId.length > 0,
		queryFn: () => deploymentRepository.getDeployment(deploymentId),
	});
};

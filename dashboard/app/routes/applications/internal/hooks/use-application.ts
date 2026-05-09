import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";

export const useApplication = (applicationId: string) => {
	const { applicationRepository } = useRepository();
	return useQuery({
		queryKey: applicationRepository.getApplication$$key(applicationId),
		enabled: applicationId.length > 0,
		queryFn: () => applicationRepository.getApplication(applicationId),
	});
};

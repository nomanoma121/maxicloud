import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";

export const useUsersQuery = () => {
	const { userRepository } = useRepository();
	return useQuery({
		queryKey: userRepository.listUsers$$key(),
		queryFn: () => userRepository.listUsers(),
		initialData: [],
	});
};

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/constant";
import { useRepository } from "~/hooks/use-repository";

export const useUsersQuery = () => {
  const { userRepository } = useRepository();
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: () => userRepository.listUsers(),
  });
};

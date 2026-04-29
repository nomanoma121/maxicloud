import { useQuery } from "@tanstack/react-query";
import { useRepository } from "~/hooks/use-repository";
import { maxicloudQueryKeys } from "~/hooks/maxicloud-query/keys";

export const useUsersQuery = () => {
  const { userRepository } = useRepository();
  return useQuery({
    queryKey: maxicloudQueryKeys.users,
    queryFn: () => userRepository.listUsers(),
  });
};

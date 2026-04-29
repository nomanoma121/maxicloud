import { useUsersQuery } from "~/hooks/use-maxicloud-query";

export const useLoginUsers = () => {
  const { data: users = [] } = useUsersQuery();
  return { users };
};

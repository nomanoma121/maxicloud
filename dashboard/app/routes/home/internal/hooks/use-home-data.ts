import { useMemo } from "react";
import {
  useDeploymentsQuery,
  useProjectsQuery,
  useServicesQuery,
  useUsersQuery,
} from "~/hooks/use-maxicloud-query";
import { indexByID } from "~/utils/collection";

export const useHomeData = () => {
  const { data: users = [] } = useUsersQuery();
  const { data: projects = [] } = useProjectsQuery();
  const { data: services = [] } = useServicesQuery();
  const { data: deployments = [] } = useDeploymentsQuery();

  const userByID = useMemo(
    () => indexByID(users),
    [users],
  );

  const serviceByID = useMemo(
    () => indexByID(services),
    [services],
  );

  return {
    projects,
    services,
    deployments,
    userByID,
    serviceByID,
  };
};

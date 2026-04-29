import { useMemo } from "react";
import {
  useDeploymentsQuery,
  useProjectsQuery,
  useServiceQuery,
  useServicesQuery,
  useUsersQuery,
} from "~/hooks/use-maxicloud-query";
import { indexByID } from "~/utils/collection";

export const useServicesData = () => {
  const { data: users = [] } = useUsersQuery();
  const { data: projects = [] } = useProjectsQuery();
  const { data: services = [] } = useServicesQuery();

  const userByID = useMemo(
    () => indexByID(users),
    [users],
  );

  const projectByID = useMemo(
    () => indexByID(projects),
    [projects],
  );

  return { userByID, projectByID, services };
};

export const useServiceDetailData = (serviceId: string) => {
  const { data: users = [] } = useUsersQuery();
  const { data: projects = [] } = useProjectsQuery();
  const { data: service } = useServiceQuery(serviceId);
  const { data: deployments = [] } = useDeploymentsQuery();

  const userByID = useMemo(
    () => indexByID(users),
    [users],
  );

  const projectByID = useMemo(
    () => indexByID(projects),
    [projects],
  );

  return { userByID, projectByID, service, deployments };
};

import { useMemo } from "react";
import {
  useDeployEventsQuery,
  useDeploymentQuery,
  useDeploymentsQuery,
  useServicesQuery,
  useUsersQuery,
} from "~/hooks/use-maxicloud-query";
import { indexByID } from "~/utils/collection";

export const useDeploymentsData = () => {
  const { data: users = [] } = useUsersQuery();
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

  return { userByID, serviceByID, deployments };
};

export const useDeploymentDetailData = (deploymentId: string) => {
  const { data: users = [] } = useUsersQuery();
  const { data: services = [] } = useServicesQuery();
  const { data: deployment } = useDeploymentQuery(deploymentId);
  const { data: events = [] } = useDeployEventsQuery(deploymentId);

  const userByID = useMemo(
    () => indexByID(users),
    [users],
  );
  const serviceByID = useMemo(
    () => indexByID(services),
    [services],
  );

  return { userByID, serviceByID, deployment, events };
};

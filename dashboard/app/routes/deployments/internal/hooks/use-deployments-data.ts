import { useMemo } from "react";
import {
  useDeployEventsQuery,
  useDeploymentQuery,
  useDeploymentsQuery,
  useApplicationsQuery,
  useUsersQuery,
} from "~/hooks/use-maxicloud-query";
import { indexByID } from "~/utils/collection";

export const useDeploymentsData = () => {
  const { data: users = [] } = useUsersQuery();
  const { data: applications = [] } = useApplicationsQuery();
  const { data: deployments = [] } = useDeploymentsQuery();

  const userByID = useMemo(
    () => indexByID(users),
    [users],
  );
  const applicationByID = useMemo(
    () => indexByID(applications),
    [applications],
  );

  return { userByID, applicationByID, deployments };
};

export const useDeploymentDetailData = (deploymentId: string) => {
  const { data: users = [] } = useUsersQuery();
  const { data: applications = [] } = useApplicationsQuery();
  const { data: deployment } = useDeploymentQuery(deploymentId);
  const { data: events = [] } = useDeployEventsQuery(deploymentId);

  const userByID = useMemo(
    () => indexByID(users),
    [users],
  );
  const applicationByID = useMemo(
    () => indexByID(applications),
    [applications],
  );

  return { userByID, applicationByID, deployment, events };
};

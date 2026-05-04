import { useMemo } from "react";
import {
  useDeployEventsQuery,
  useDeploymentQuery,
  useDeploymentsQuery,
  useApplicationsQuery,
  useProjectsQuery,
  useUsersQuery,
} from "~/hooks";
import { indexByID } from "~/utils/collection";

export const useDeploymentsData = () => {
  const { data: users } = useUsersQuery();
  const { data: projects } = useProjectsQuery();
  const { data: applications } = useApplicationsQuery();
  const { data: deployments } = useDeploymentsQuery();

  const userByID = useMemo(() => indexByID(users), [users]);
  const projectByID = useMemo(() => indexByID(projects), [projects]);
  const applicationByID = useMemo(() => indexByID(applications), [applications]);

  return { userByID, projectByID, applicationByID, deployments };
};

export const useDeploymentDetailData = (deploymentId: string) => {
  const { data: users } = useUsersQuery();
  const { data: applications } = useApplicationsQuery();
  const { data: deployment } = useDeploymentQuery(deploymentId);
  const { data: events } = useDeployEventsQuery(deploymentId);

  const userByID = useMemo(() => indexByID(users), [users]);
  const applicationByID = useMemo(() => indexByID(applications), [applications]);

  return { userByID, applicationByID, deployment, events };
};

import { useMemo } from "react";
import {
  useDeploymentsQuery,
  useProjectsQuery,
  useApplicationsQuery,
  useUsersQuery,
} from "~/hooks";
import { indexByID } from "~/utils/collection";

export const useHomeData = () => {
  const { data: users = [] } = useUsersQuery();
  const { data: projects = [] } = useProjectsQuery();
  const { data: applications = [] } = useApplicationsQuery();
  const { data: deployments = [] } = useDeploymentsQuery();

  const userByID = useMemo(
    () => indexByID(users),
    [users],
  );

  const projectByID = useMemo(() => indexByID(projects), [projects]);
  const applicationByID = useMemo(() => indexByID(applications), [applications]);

  return {
    projects,
    applications,
    deployments,
    userByID,
    projectByID,
    applicationByID,
  };
};

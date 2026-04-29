import { useMemo } from "react";
import {
  useDeploymentsQuery,
  useProjectsQuery,
  useApplicationQuery,
  useApplicationsQuery,
  useUsersQuery,
} from "~/hooks/use-maxicloud-query";
import { indexByID } from "~/utils/collection";

export const useApplicationsData = () => {
  const { data: users = [] } = useUsersQuery();
  const { data: projects = [] } = useProjectsQuery();
  const { data: applications = [] } = useApplicationsQuery();

  const userByID = useMemo(
    () => indexByID(users),
    [users],
  );

  const projectByID = useMemo(
    () => indexByID(projects),
    [projects],
  );

  return { userByID, projectByID, applications };
};

export const useApplicationDetailData = (applicationId: string) => {
  const { data: users = [] } = useUsersQuery();
  const { data: projects = [] } = useProjectsQuery();
  const { data: application } = useApplicationQuery(applicationId);
  const { data: deployments = [] } = useDeploymentsQuery();

  const userByID = useMemo(
    () => indexByID(users),
    [users],
  );

  const projectByID = useMemo(
    () => indexByID(projects),
    [projects],
  );

  return { userByID, projectByID, application, deployments };
};

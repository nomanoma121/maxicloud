import { useMemo } from "react";
import {
  useDeploymentsQuery,
  useProjectQuery,
  useProjectsQuery,
  useServicesQuery,
  useUsersQuery,
} from "~/hooks/use-maxicloud-query";
import { indexByID } from "~/utils/collection";

export const useProjectsData = () => {
  const { data: users = [] } = useUsersQuery();
  const { data: projects = [] } = useProjectsQuery();
  const { data: services = [] } = useServicesQuery();

  const userByID = useMemo(
    () => indexByID(users),
    [users],
  );

  return { userByID, projects, services };
};

export const useProjectDetailData = (projectId: string) => {
  const { data: users = [] } = useUsersQuery();
  const { data: project } = useProjectQuery(projectId);
  const { data: services = [] } = useServicesQuery();
  const { data: deployments = [] } = useDeploymentsQuery();

  const userByID = useMemo(
    () => indexByID(users),
    [users],
  );

  return { userByID, project, services, deployments };
};

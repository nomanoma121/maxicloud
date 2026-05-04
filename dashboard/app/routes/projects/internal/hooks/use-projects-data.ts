import { useMemo } from "react";
import {
  useDeploymentsQuery,
  useProjectsQuery,
  useApplicationsQuery,
  useUsersQuery,
} from "~/hooks";
import { useProject } from "~/routes/projects/internal/hooks/use-project";
import { indexByID } from "~/utils/collection";

export const useProjectsData = () => {
  const { data: users } = useUsersQuery();
  const { data: projects } = useProjectsQuery();
  const { data: applications } = useApplicationsQuery();

  const userByID = useMemo(() => indexByID(users), [users]);

  return { userByID, projects, applications };
};

export const useProjectDetailData = (projectId: string) => {
  const { data: users } = useUsersQuery();
  const { data: project } = useProject(projectId);
  const { data: applications } = useApplicationsQuery();
  const { data: deployments } = useDeploymentsQuery();

  const userByID = useMemo(() => indexByID(users), [users]);

  return { userByID, project, applications, deployments };
};

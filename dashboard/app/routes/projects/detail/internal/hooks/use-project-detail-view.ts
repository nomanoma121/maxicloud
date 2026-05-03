import { useMemo } from "react";
import { useProjectDetailData } from "~/routes/projects/internal/hooks/use-projects-data";

export const useProjectDetailView = (projectId: string) => {
  const { deployments, project, applications, userByID } = useProjectDetailData(projectId);

  const projectApplications = useMemo(() => {
    if (!project) {
      return [];
    }
    return applications.filter((application) => application.projectId === project.id);
  }, [applications, project]);

  const applicationNameByID = useMemo(
    () =>
      Object.fromEntries(
        projectApplications.map((application) => [application.id, application.name] as const),
      ),
    [projectApplications],
  );

  const projectDeployments = useMemo(() => {
    const applicationIDSet = new Set(projectApplications.map((application) => application.id));
    return deployments.filter((deployment) => applicationIDSet.has(deployment.applicationId));
  }, [deployments, projectApplications]);

  const ownerName = project ? userByID[project.ownerId]?.displayName ?? "-" : "-";

  return {
    project,
    ownerName,
    userByID,
    projectApplications,
    applicationNameByID,
    projectDeployments,
  };
};

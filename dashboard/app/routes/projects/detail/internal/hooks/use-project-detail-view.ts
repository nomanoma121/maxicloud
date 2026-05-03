import { useMemo } from "react";
import type { Application } from "~/types";
import { useProjectDetailData } from "~/routes/projects/internal/hooks/use-projects-data";

export const useProjectDetailView = (projectId: string) => {
  const { deployments, project, applications, userByID } = useProjectDetailData(projectId);

  const projectApplications = useMemo(() => {
    if (!project) {
      return [];
    }
    return applications.filter((application) => application.projectId === project.id);
  }, [applications, project]);

  const applicationByID = useMemo(
    () =>
      Object.fromEntries(
        projectApplications.map((application) => [application.id, application] as [string, Application]),
      ) as Record<string, Application | undefined>,
    [projectApplications],
  );

  const projectDeployments = useMemo(() => {
    const applicationIDSet = new Set(projectApplications.map((application) => application.id));
    return deployments.filter((deployment) => applicationIDSet.has(deployment.applicationId));
  }, [deployments, projectApplications]);

  const projectByID = useMemo(
    () => (project ? { [project.id]: project } : {}) as Record<string, typeof project>,
    [project],
  );

  const ownerName = project ? userByID[project.ownerId]?.displayName ?? "-" : "-";

  return {
    project,
    ownerName,
    userByID,
    projectApplications,
    applicationByID,
    projectByID,
    projectDeployments,
  };
};

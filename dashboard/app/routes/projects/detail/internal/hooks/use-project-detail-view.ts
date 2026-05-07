import { useMemo } from "react";
import type { Application } from "~/repository/application";
import { useProjectDetailData } from "~/routes/projects/internal/hooks/use-projects-data";
import { indexByID } from "~/utils/collection";

export const useProjectDetailView = (projectId: string) => {
  const { deployments, project, applications, userByID } = useProjectDetailData(projectId);

  const projectApplications = useMemo(() => {
    if (!project) {
      return [];
    }
    return applications.filter((application) => application.projectId === project.id);
  }, [applications, project]);

  const applicationByID = useMemo(
    () => indexByID<Application>(projectApplications),
    [projectApplications],
  );

  const projectDeployments = useMemo(() => {
    const applicationIDSet = new Set(projectApplications.map((application) => application.id));
    return deployments.filter((deployment) => applicationIDSet.has(deployment.applicationId));
  }, [deployments, projectApplications]);

  const projectByID = useMemo<Record<string, typeof project>>(() => {
    if (!project) return {};
    return { [project.id]: project };
  }, [project]);

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

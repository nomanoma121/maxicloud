import { useOutletContext } from "react-router";
import { ProjectApplicationsPanel } from "./internal/components/project-applications-panel";
import { ProjectDeploymentsPanel } from "./internal/components/project-deployments-panel";
import { ProjectSummaryPanel } from "./internal/components/project-summary-panel";
import type { ProjectDetailContext } from "./layout";

export default function ProjectDetailPage() {
  const {
    project,
    projectId,
    ownerName,
    userByID,
    projectApplications,
    applicationByID,
    projectByID,
    projectDeployments,
  } = useOutletContext<ProjectDetailContext>();

  return (
    <>
      <ProjectSummaryPanel
        ownerName={ownerName}
        applicationCount={projectApplications.length}
        updatedAt={project.updatedAt}
      />

      <ProjectApplicationsPanel
        projectId={project.id}
        projectName={project.name}
        applications={projectApplications}
        userByID={userByID}
      />

      <ProjectDeploymentsPanel
        deployments={projectDeployments}
        applicationByID={applicationByID}
        projectByID={projectByID}
        userByID={userByID}
      />
    </>
  );
}

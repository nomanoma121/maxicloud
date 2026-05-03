import { useParams } from "react-router";
import { Folder } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { APP_ROUTES } from "~/constant";
import { ProjectNotFoundState } from "./internal/components/not-found-state";
import { ProjectApplicationsPanel } from "./internal/components/project-applications-panel";
import { ProjectDeploymentsPanel } from "./internal/components/project-deployments-panel";
import { ProjectSummaryPanel } from "./internal/components/project-summary-panel";
import { useProjectDetailView } from "./internal/hooks/use-project-detail-view";

export default function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const {
    project,
    ownerName,
    userByID,
    projectApplications,
    applicationNameByID,
    projectDeployments,
  } = useProjectDetailView(projectId);

  if (!project) {
    return <ProjectNotFoundState />;
  }

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          { label: "Projects", href: APP_ROUTES.projects, icon: <Folder size={14} /> },
          { label: project.name },
        ]}
      />

      <DashboardHeader
        title={project.name}
        subtitle={project.description}
      />

      <ProjectSummaryPanel
        ownerName={ownerName}
        applicationCount={projectApplications.length}
        updatedAt={project.updatedAt}
      />

      <ProjectApplicationsPanel
        projectId={project.id}
        applications={projectApplications}
        userByID={userByID}
      />

      <ProjectDeploymentsPanel
        deployments={projectDeployments}
        applicationNameByID={applicationNameByID}
      />
    </div>
  );
}

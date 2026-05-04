import { useNavigate, useOutletContext } from "react-router";
import { css } from "styled-system/css";
import { Button } from "~/components/ui/button";
import { APP_ROUTES } from "~/constant";
import { useDeleteProject } from "./internal/hooks/use-delete-project";
import { ProjectApplicationsPanel } from "./internal/components/project-applications-panel";
import { ProjectDeploymentsPanel } from "./internal/components/project-deployments-panel";
import { ProjectSummaryPanel } from "./internal/components/project-summary-panel";
import type { ProjectDetailContext } from "./layout";

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const { mutateAsync: deleteProject, isPending } = useDeleteProject();
  const {
    project,
    ownerName,
    userByID,
    projectApplications,
    applicationByID,
    projectByID,
    projectDeployments,
  } = useOutletContext<ProjectDetailContext>();

  const onDelete = async () => {
    await deleteProject(project.id);
    navigate(APP_ROUTES.projects);
  };

  return (
    <>
      <div className={css({ display: "flex", justifyContent: "flex-end" })}>
        <Button type="button" variant="danger" size="sm" onClick={onDelete} disabled={isPending}>
          {isPending ? "Deleting..." : "Delete Project"}
        </Button>
      </div>

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

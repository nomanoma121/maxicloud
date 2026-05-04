import { useNavigate, useOutletContext } from "react-router";
import { css } from "styled-system/css";
import { Button } from "~/components/ui/button";
import { APP_ROUTES } from "~/constant";
import { useToast } from "~/hooks/use-toast";
import { ProjectApplicationsPanel } from "./internal/components/project-applications-panel";
import { ProjectDeploymentsPanel } from "./internal/components/project-deployments-panel";
import { ProjectSummaryPanel } from "./internal/components/project-summary-panel";
import { useDeleteProject } from "./internal/hooks/use-delete-project";
import type { ProjectDetailContext } from "./layout";

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
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
    try {
      await deleteProject(project.id);
      pushToast({ type: "success", title: "Project deleted" });
      navigate(APP_ROUTES.projects);
    } catch (error) {
      pushToast({
        type: "error",
        title: "Failed to delete project",
        description: error instanceof Error ? error.message : "unknown error",
      });
    }
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

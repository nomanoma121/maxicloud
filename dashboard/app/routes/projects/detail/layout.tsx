import { Folder } from "react-feather";
import { Outlet, useParams } from "react-router";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { APP_ROUTES } from "~/constant";
import { ProjectNotFoundState } from "./internal/components/not-found-state";
import { useProjectDetailView } from "./internal/hooks/use-project-detail-view";

type BaseDetail = ReturnType<typeof useProjectDetailView>;

export type ProjectDetailContext = BaseDetail & {
  project: NonNullable<BaseDetail["project"]>;
  projectId: string;
};

export default function ProjectDetailLayout() {
  const { projectId = "" } = useParams();
  const detail = useProjectDetailView(projectId);

  if (!detail.project) {
    return <ProjectNotFoundState />;
  }

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          { label: "Projects", href: APP_ROUTES.projects, icon: <Folder size={14} /> },
          { label: detail.project.name },
        ]}
      />

      <DashboardHeader
        title={detail.project.name}
        subtitle={detail.project.description}
      />

      <Outlet context={{ ...detail, projectId }} />
    </div>
  );
}

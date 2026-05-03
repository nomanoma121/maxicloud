import { useNavigate } from "react-router";
import { Folder } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { APP_ROUTES } from "~/constant";
import { ProjectsTable } from "~/routes/projects/internal/components/projects-table";
import { ProjectsToolbar } from "~/routes/projects/internal/components/projects-toolbar";
import { useProjectsListView } from "~/routes/projects/internal/hooks/use-projects-list-view";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { keyword, setKeyword, filteredProjects, projectCountByID, userByID } =
    useProjectsListView();

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          { label: "Projects", icon: <Folder size={14} /> },
        ]}
      />

      <DashboardHeader
        title="Projects"
        subtitle="ProjectごとにApplicationをまとめて管理します"
      />

      <Panel>
        <ProjectsToolbar
          keyword={keyword}
          onKeywordChange={setKeyword}
          onCreateProject={() => navigate(APP_ROUTES.projectNew)}
        />
        <ProjectsTable
          projects={filteredProjects}
          projectCountByID={projectCountByID}
          userByID={userByID}
        />
      </Panel>
    </div>
  );
}

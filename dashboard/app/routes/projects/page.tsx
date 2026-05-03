import { useNavigate } from "react-router";
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
  );
}

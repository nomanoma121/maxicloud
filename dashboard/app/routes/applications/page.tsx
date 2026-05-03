import { useNavigate } from "react-router";
import { Box } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { APP_ROUTES } from "~/constant";
import { ApplicationsTable } from "~/routes/applications/internal/components/applications-table";
import type { ApplicationRowItem } from "~/routes/applications/internal/components/applications-table";
import { ApplicationsToolbar } from "~/routes/applications/internal/components/applications-toolbar";
import { useApplicationsListView } from "~/routes/applications/internal/hooks/use-applications-list-view";

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const {
    keyword,
    setKeyword,
    filteredApplications,
    projectByID,
    userByID,
  } = useApplicationsListView();

  const rows: ApplicationRowItem[] = filteredApplications.map((a) => ({
    id: a.id,
    name: a.name,
    projectId: a.projectId,
    projectName: projectByID[a.projectId]?.name ?? "-",
    ownerName: userByID[a.ownerId]?.displayName ?? "-",
    status: a.status,
    cpu: a.cpu,
    memory: a.memory,
    updatedAt: a.updatedAt,
  }));

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          { label: "Applications", icon: <Box size={14} /> },
        ]}
      />

      <DashboardHeader
        title="Applications"
        subtitle="全ProjectのApplicationを横断で確認できます"
      />

      <Panel>
        <ApplicationsToolbar
          keyword={keyword}
          onKeywordChange={setKeyword}
          onCreateApplication={() => navigate(APP_ROUTES.applicationNew)}
        />
        <ApplicationsTable rows={rows} />
      </Panel>
    </div>
  );
}

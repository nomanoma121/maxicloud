import { Layers } from "react-feather";
import { css } from "styled-system/css";
import { DeploymentsTable } from "~/components/feature/deployments-table";
import type { DeploymentRowItem } from "~/components/feature/deployments-table";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { APP_ROUTES } from "~/constant";
import { useDeploymentsData } from "~/routes/deployments/internal/hooks/use-deployments-data";

export default function DeploymentsPage() {
  const { deployments, applicationByID, projectByID, userByID } = useDeploymentsData();

  const rows: DeploymentRowItem[] = deployments.map((d) => {
    const application = applicationByID[d.applicationId];
    return {
      id: d.id,
      projectName: projectByID[application?.projectId ?? ""]?.name ?? "-",
      applicationName: application?.name ?? "-",
      ownerName: userByID[d.ownerId]?.displayName ?? "-",
      status: d.status,
      startedAt: d.startedAt,
      duration: d.duration,
    };
  });

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          { label: "Deployments", icon: <Layers size={14} /> },
        ]}
      />

      <DashboardHeader
        title="Deployments"
        subtitle="サークル内のデプロイ履歴（全ユーザー）"
      />

      <Panel>
        <DeploymentsTable rows={rows} />
      </Panel>
    </div>
  );
}

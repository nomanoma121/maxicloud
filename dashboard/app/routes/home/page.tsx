import { Home } from "react-feather";
import { css } from "styled-system/css";
import { DeploymentsTable } from "~/components/feature/deployments-table";
import type { DeploymentRowItem } from "~/components/feature/deployments-table";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { MetricCard } from "~/components/ui/metric-card";
import { Panel } from "~/components/ui/panel";
import { APP_ROUTES } from "~/constant";
import { useHomeData } from "~/routes/home/internal/hooks/use-home-data";

export default function HomePage() {
  const { deployments, projects, applications, projectByID, applicationByID, userByID } = useHomeData();
  const healthyApplications = applications.filter((application) => application.status === "running").length;

  const rows: DeploymentRowItem[] = deployments.slice(0, 6).map((d) => {
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
          { label: "Overview", icon: <Home size={14} /> },
        ]}
      />

      <DashboardHeader
        title="Operations Overview"
        subtitle="サークル全体のアプリケーションとデプロイ状況を確認できます"
      />

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 3,
          lgDown: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
          smDown: { gridTemplateColumns: "1fr" },
        })}
      >
        <MetricCard label="Projects" value={String(projects.length)} />
        <MetricCard label="Applications" value={String(applications.length)} />
        <MetricCard label="Healthy" value={String(healthyApplications)} />
      </div>

      <Panel title="Recent Deployments" subtitle="直近の実行履歴">
        <DeploymentsTable rows={rows} />
      </Panel>
    </div>
  );
}

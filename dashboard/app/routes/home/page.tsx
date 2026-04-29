import { Link } from "react-router";
import { Home } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { StatusBadge } from "~/components/ui/badge";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { MetricCard } from "~/components/ui/metric-card";
import { Panel } from "~/components/ui/panel";
import { Table } from "~/components/ui/table";
import { useHomeData } from "~/routes/home/internal/hooks/use-home-data";

export default function HomePage() {
  const { deployments, projects, applications, applicationByID, userByID } = useHomeData();
  const healthyApplications = applications.filter((application) => application.status === "healthy").length;

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
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
        <Table.Root>
          <thead>
            <Table.Tr>
              <Table.Th>Revision</Table.Th>
              <Table.Th>Application</Table.Th>
              <Table.Th>Project</Table.Th>
              <Table.Th>Owner</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Started</Table.Th>
              <Table.Th>Detail</Table.Th>
            </Table.Tr>
          </thead>
          <tbody>
            {deployments.slice(0, 6).map((deployment) => (
              <Table.Tr key={deployment.id}>
                <Table.Td>
                  <strong>{deployment.revision}</strong>
                  <div className={css({ color: "gray.500", fontSize: "xs" })}>{deployment.commit}</div>
                </Table.Td>
                <Table.Td>{applicationByID[deployment.applicationId]?.name}</Table.Td>
                <Table.Td>{projects.find((item) => item.id === applicationByID[deployment.applicationId]?.projectId)?.name}</Table.Td>
                <Table.Td>{userByID[deployment.ownerId]?.displayName}</Table.Td>
                <Table.Td>
                  <StatusBadge status={deployment.status} />
                </Table.Td>
                <Table.Td>{deployment.startedAt}</Table.Td>
                <Table.Td>
                  <Link to={`/deployments/${deployment.id}`} className={css({ color: "green.700", fontSize: "sm" })}>
                    View
                  </Link>
                </Table.Td>
              </Table.Tr>
            ))}
          </tbody>
        </Table.Root>
      </Panel>
    </div>
  );
}

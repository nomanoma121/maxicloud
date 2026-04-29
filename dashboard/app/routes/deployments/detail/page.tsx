import { Link, useParams } from "react-router";
import { Layers } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { StatusBadge } from "~/components/ui/badge";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { useDeploymentDetailData } from "~/routes/deployments/internal/hooks/use-deployments-data";

export default function DeploymentDetailPage() {
  const { deploymentId = "" } = useParams();
  const { deployment, events, applicationByID, userByID } = useDeploymentDetailData(deploymentId);

  if (!deployment) {
    return (
      <div className={css({ display: "grid", gap: 4 })}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Deployments", href: "/deployments", icon: <Layers size={14} /> },
            { label: "Not Found" },
          ]}
        />

        <DashboardHeader title="Deployment Not Found" subtitle="指定されたデプロイは存在しません" />
      </div>
    );
  }

  const application = applicationByID[deployment.applicationId];
  const owner = userByID[deployment.ownerId];

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Deployments", href: "/deployments", icon: <Layers size={14} /> },
          { label: deployment.revision },
        ]}
      />

      <DashboardHeader
        title={deployment.revision}
        subtitle={`${application?.name ?? "-"} ・ ${owner?.displayName ?? "-"}`}
      />

      <Panel title="Deployment Summary" rightSlot={<StatusBadge status={deployment.status} />}>
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 3,
            mdDown: { gridTemplateColumns: "1fr" },
          })}
        >
          <KpiItem label="Application" value={application?.name ?? "-"} />
          <KpiItem label="Owner" value={owner?.displayName ?? "-"} />
          <KpiItem label="Started At" value={deployment.startedAt} />
          <KpiItem label="Duration" value={deployment.duration} />
        </div>
      </Panel>

      <Panel title="Timeline" subtitle="イベントログ（モック）">
        <ol className={css({ margin: 0, paddingLeft: 5, display: "grid", gap: 2 })}>
          {events.map((event) => (
            <li key={event.id}>
              <p className={css({ margin: 0, color: "gray.700", fontWeight: 600, fontSize: "sm" })}>
                {event.title}
              </p>
              <p className={css({ marginTop: 1, marginBottom: 0, color: "gray.500", fontSize: "xs" })}>
                {event.timestamp}
              </p>
              <p className={css({ marginTop: 1, marginBottom: 0, color: "gray.600", fontSize: "sm" })}>
                {event.detail}
              </p>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Operation Note">
        <p className={css({ marginTop: 0, color: "gray.600", fontSize: "sm" })}>
          実運用では、この画面から再デプロイ・ロールバック・ログストリームを操作できる想定です。
        </p>
        <Link to="/deployments" className={css({ color: "green.700", fontSize: "sm" })}>
          Back to deployments
        </Link>
      </Panel>
    </div>
  );
}

const KpiItem = ({ label, value }: { label: string; value: string }) => (
  <div
    className={css({
      border: "1px solid",
      borderColor: "gray.100",
      borderRadius: "md",
      padding: 3,
      background: "white",
      display: "grid",
      gap: 1,
    })}
  >
    <span className={css({ color: "gray.500", fontSize: "xs", textTransform: "uppercase" })}>{label}</span>
    <strong className={css({ color: "gray.700", fontSize: "sm" })}>{value}</strong>
  </div>
);

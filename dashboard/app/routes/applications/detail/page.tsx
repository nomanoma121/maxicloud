import { useParams, useSearchParams } from "react-router";
import { Box } from "react-feather";
import { css } from "styled-system/css";
import { DeploymentsTable } from "~/components/feature/deployments-table";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { StatusBadge } from "~/components/ui/badge";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { APP_ROUTES } from "~/constant";
import { useApplicationDetailData } from "~/routes/applications/internal/hooks/use-applications-data";
import { ApplicationNotFoundState } from "./internal/components/not-found-state";
import { SummaryRow } from "./internal/components/summary-row";

export default function ApplicationDetailPage() {
  const { applicationId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { deployments, projectByID, application, userByID } = useApplicationDetailData(applicationId);
  const deployStartFailed = searchParams.get("deploy_start") === "failed";

  if (!application) {
    return <ApplicationNotFoundState />;
  }

  const owner = userByID[application.ownerId];
  const project = projectByID[application.projectId];
  const deploymentRows = deployments
    .filter((d) => d.applicationId === application.id)
    .map((d) => ({
      id: d.id,
      projectName: project?.name ?? "-",
      applicationName: application.name,
      ownerName: userByID[d.ownerId]?.displayName ?? "-",
      status: d.status,
      startedAt: d.startedAt,
      duration: d.duration,
    }));

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          { label: "Applications", href: APP_ROUTES.applications, icon: <Box size={14} /> },
          { label: application.name },
        ]}
      />

      <DashboardHeader
        title={application.name}
        subtitle={`${application.repository} (${application.branch})`}
      />

      {deployStartFailed && (
        <Panel title="Deployment Notice">
          <p className={css({ margin: 0, color: "orange.700", fontSize: "sm", fontWeight: 600 })}>
            Applicationは作成されましたが、初回デプロイの開始に失敗しました。Deployments画面から再実行してください。
          </p>
        </Panel>
      )}

      <Panel title="Application Summary" rightSlot={<StatusBadge status={application.status} />}>
        <dl
          className={css({
            margin: 0,
            display: "grid",
            gap: 2,
          })}
        >
          <SummaryRow label="Project" value={project?.name ?? "-"} href={project ? APP_ROUTES.projectDetail(project.id) : undefined} />
          <SummaryRow label="Owner" value={owner?.displayName ?? "-"} />
          <SummaryRow label="Runtime" value={application.runtime} />
          <SummaryRow label="CPU" value={application.cpu} />
          <SummaryRow label="Memory" value={application.memory} />
          <SummaryRow label="Updated" value={application.updatedAt} />
          <SummaryRow label="URL" value={application.url} href={application.url} />
        </dl>
      </Panel>

      <Panel title="Recent Deployments" subtitle="このApplicationに紐づく履歴">
        <DeploymentsTable rows={deploymentRows} />
      </Panel>
    </div>
  );
}

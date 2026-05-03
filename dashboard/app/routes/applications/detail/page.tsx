import { Link, useParams, useSearchParams } from "react-router";
import { Box } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { StatusBadge } from "~/components/ui/badge";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { Table } from "~/components/ui/table";
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
  const applicationDeployments = deployments.filter((deployment) => deployment.applicationId === application.id);

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
        <Table.Root>
          <thead>
            <Table.Tr>
              <Table.Th>Revision</Table.Th>
              <Table.Th>Commit</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Started</Table.Th>
              <Table.Th>Duration</Table.Th>
              <Table.Th>Detail</Table.Th>
            </Table.Tr>
          </thead>
          <tbody>
            {applicationDeployments.map((deployment) => (
              <Table.Tr key={deployment.id}>
                <Table.Td>{deployment.revision}</Table.Td>
                <Table.Td>{deployment.commit}</Table.Td>
                <Table.Td>
                  <StatusBadge status={deployment.status} />
                </Table.Td>
                <Table.Td>{deployment.startedAt}</Table.Td>
                <Table.Td>{deployment.duration}</Table.Td>
                <Table.Td>
                  <Link to={APP_ROUTES.deploymentDetail(deployment.id)} className={css({ color: "green.700", fontSize: "sm" })}>
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

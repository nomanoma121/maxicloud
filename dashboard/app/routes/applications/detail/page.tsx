import { Link, useParams } from "react-router";
import { Box } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { StatusBadge } from "~/components/ui/badge";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { Table } from "~/components/ui/table";
import { useApplicationDetailData } from "~/routes/applications/internal/hooks/use-applications-data";
import { ApplicationNotFoundState } from "./internal/components/not-found-state";
import { SummaryRow } from "./internal/components/summary-row";

export default function ApplicationDetailPage() {
  const { applicationId = "" } = useParams();
  const { deployments, projectByID, application, userByID } = useApplicationDetailData(applicationId);

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
          { label: "Dashboard", href: "/" },
          { label: "Applications", href: "/applications", icon: <Box size={14} /> },
          { label: application.name },
        ]}
      />

      <DashboardHeader
        title={application.name}
        subtitle={`${application.repository} (${application.branch})`}
      />

      <Panel title="Application Summary" rightSlot={<StatusBadge status={application.status} />}>
        <dl
          className={css({
            margin: 0,
            display: "grid",
            gap: 2,
          })}
        >
          <SummaryRow label="Project" value={project?.name ?? "-"} href={project ? `/projects/${project.id}` : undefined} />
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

import { Link, useParams } from "react-router";
import { Box } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { StatusBadge } from "~/components/ui/badge";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { Table } from "~/components/ui/table";
import { useApplicationDetailData } from "~/routes/applications/internal/hooks/use-applications-data";

export default function ApplicationDetailPage() {
  const { applicationId = "" } = useParams();
  const { deployments, projectByID, application, userByID } = useApplicationDetailData(applicationId);

  if (!application) {
    return (
      <div className={css({ display: "grid", gap: 4 })}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Applications", href: "/applications", icon: <Box size={14} /> },
            { label: "Not Found" },
          ]}
        />

        <DashboardHeader
          title="Application Not Found"
          subtitle="指定されたApplicationは存在しません"
        />

        <Panel>
          <p className={css({ margin: 0, color: "gray.600", fontSize: "sm" })}>
            URL を確認してください。Application一覧に戻って選び直せます。
          </p>
          <Link
            to="/applications"
            className={css({ marginTop: 3, display: "inline-block", color: "green.700", fontSize: "sm" })}
          >
            Back to Applications
          </Link>
        </Panel>
      </div>
    );
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
          <Row label="Project" value={project?.name ?? "-"} href={project ? `/projects/${project.id}` : undefined} />
          <Row label="Owner" value={owner?.displayName ?? "-"} />
          <Row label="Runtime" value={application.runtime} />
          <Row label="CPU" value={application.cpu} />
          <Row label="Memory" value={application.memory} />
          <Row label="Updated" value={application.updatedAt} />
          <Row label="URL" value={application.url} href={application.url} />
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

const Row = ({ label, value, href }: { label: string; value: string; href?: string }) => (
  <div
    className={css({
      display: "grid",
      gridTemplateColumns: "100px 1fr",
      gap: 2,
      borderBottom: "1px solid",
      borderBottomColor: "gray.100",
      paddingBottom: 2,
    })}
  >
    <dt className={css({ color: "gray.500", fontSize: "xs", textTransform: "uppercase" })}>{label}</dt>
    <dd className={css({ margin: 0, color: "gray.700", fontSize: "sm" })}>
      {href ? (
        href.startsWith("/") ? (
          <Link to={href} className={css({ color: "green.700", textDecoration: "none" })}>
            {value}
          </Link>
        ) : (
          <a href={href} className={css({ color: "green.700", textDecoration: "none" })}>
            {value}
          </a>
        )
      ) : (
        value
      )}
    </dd>
  </div>
);

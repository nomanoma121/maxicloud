import { Link, useParams } from "react-router";
import { Folder } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { StatusBadge } from "~/components/ui/badge";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { Table } from "~/components/ui/table";
import { useProjectDetailData } from "~/routes/projects/internal/hooks/use-projects-data";
import { ProjectNotFoundState } from "./internal/components/not-found-state";
import { SummaryRow } from "./internal/components/summary-row";

export default function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const { deployments, project, applications, userByID } = useProjectDetailData(projectId);

  if (!project) {
    return <ProjectNotFoundState />;
  }

  const owner = userByID[project.ownerId];
  const projectApplications = applications.filter((application) => application.projectId === project.id);
  const serviceIdSet = new Set(projectApplications.map((application) => application.id));
  const projectDeployments = deployments.filter((deployment) => serviceIdSet.has(deployment.applicationId));

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Projects", href: "/projects", icon: <Folder size={14} /> },
          { label: project.name },
        ]}
      />

      <DashboardHeader
        title={project.name}
        subtitle={project.description}
      />

      <Panel title="Project Summary">
        <dl
          className={css({
            margin: 0,
            display: "grid",
            gap: 2,
          })}
        >
          <SummaryRow label="Owner" value={owner?.displayName ?? "-"} />
          <SummaryRow label="Applications" value={String(projectApplications.length)} />
          <SummaryRow label="Updated" value={project.updatedAt} />
        </dl>
      </Panel>

      <Panel
        title="Applications"
        subtitle="このProjectに紐づくApplication一覧"
        rightSlot={(
          <Link
            to={`/applications/new?projectId=${project.id}`}
            className={css({
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              border: "1px solid",
              borderColor: "gray.400",
              color: "gray.600",
              borderRadius: 8,
              minWidth: "80px",
              fontSize: "sm",
              fontWeight: 600,
              padding: "token(spacing.1) token(spacing.2)",
              _hover: {
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              },
            })}
          >
            New Application
          </Link>
        )}
      >
        <Table.Root>
          <thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Repository</Table.Th>
              <Table.Th>Owner</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>CPU</Table.Th>
              <Table.Th>Memory</Table.Th>
              <Table.Th>Detail</Table.Th>
            </Table.Tr>
          </thead>
          <tbody>
            {projectApplications.map((application) => (
              <Table.Tr key={application.id}>
                <Table.Td>
                  <strong>{application.name}</strong>
                  <div className={css({ color: "gray.500", fontSize: "xs" })}>{application.branch}</div>
                </Table.Td>
                <Table.Td>{application.repository}</Table.Td>
                <Table.Td>{userByID[application.ownerId]?.displayName}</Table.Td>
                <Table.Td>
                  <StatusBadge status={application.status} />
                </Table.Td>
                <Table.Td>{application.cpu}</Table.Td>
                <Table.Td>{application.memory}</Table.Td>
                <Table.Td>
                  <Link to={`/applications/${application.id}`} className={css({ color: "green.700", fontSize: "sm" })}>
                    View
                  </Link>
                </Table.Td>
              </Table.Tr>
            ))}
          </tbody>
        </Table.Root>
      </Panel>

      <Panel title="Recent Deployments" subtitle="このProject配下の実行履歴">
        <Table.Root>
          <thead>
            <Table.Tr>
              <Table.Th>Revision</Table.Th>
              <Table.Th>Application</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Started</Table.Th>
              <Table.Th>Duration</Table.Th>
              <Table.Th>Detail</Table.Th>
            </Table.Tr>
          </thead>
          <tbody>
            {projectDeployments.map((deployment) => (
              <Table.Tr key={deployment.id}>
                <Table.Td>{deployment.revision}</Table.Td>
                <Table.Td>{projectApplications.find((item) => item.id === deployment.applicationId)?.name ?? "-"}</Table.Td>
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

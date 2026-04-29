import { Link } from "react-router";
import { Layers } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { StatusBadge } from "~/components/ui/badge";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { Table } from "~/components/ui/table";
import { useDeploymentsData } from "~/routes/deployments/internal/hooks/use-deployments-data";

export default function DeploymentsPage() {
  const { deployments, applicationByID, userByID } = useDeploymentsData();

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Deployments", icon: <Layers size={14} /> },
        ]}
      />

      <DashboardHeader
        title="Deployments"
        subtitle="サークル内のデプロイ履歴（全ユーザー）"
      />

      <Panel>
        <Table.Root>
          <thead>
            <Table.Tr>
              <Table.Th>Revision</Table.Th>
              <Table.Th>Application</Table.Th>
              <Table.Th>Owner</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Started At</Table.Th>
              <Table.Th>Duration</Table.Th>
              <Table.Th>Detail</Table.Th>
            </Table.Tr>
          </thead>
          <tbody>
            {deployments.map((deployment) => (
              <Table.Tr key={deployment.id}>
                <Table.Td>
                  <strong>{deployment.revision}</strong>
                  <div className={css({ color: "gray.500", fontSize: "xs" })}>{deployment.commit}</div>
                </Table.Td>
                <Table.Td>{applicationByID[deployment.applicationId]?.name}</Table.Td>
                <Table.Td>{userByID[deployment.ownerId]?.displayName}</Table.Td>
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

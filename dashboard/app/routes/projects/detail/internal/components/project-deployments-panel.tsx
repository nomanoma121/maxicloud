import { Link } from "react-router";
import { css } from "styled-system/css";
import { StatusBadge } from "~/components/ui/badge";
import { Panel } from "~/components/ui/panel";
import { Table } from "~/components/ui/table";
import { APP_ROUTES } from "~/constant";
import type { DeploymentRun } from "~/types";

type ProjectDeploymentsPanelProps = {
  deployments: DeploymentRun[];
  applicationNameByID: Record<string, string>;
};

export const ProjectDeploymentsPanel = ({
  deployments,
  applicationNameByID,
}: ProjectDeploymentsPanelProps) => {
  return (
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
          {deployments.map((deployment) => (
            <Table.Tr key={deployment.id}>
              <Table.Td>{deployment.revision}</Table.Td>
              <Table.Td>{applicationNameByID[deployment.applicationId] ?? "-"}</Table.Td>
              <Table.Td>
                <StatusBadge status={deployment.status} />
              </Table.Td>
              <Table.Td>{deployment.startedAt}</Table.Td>
              <Table.Td>{deployment.duration}</Table.Td>
              <Table.Td>
                <Link
                  to={APP_ROUTES.deploymentDetail(deployment.id)}
                  className={css({ color: "green.700", fontSize: "sm" })}
                >
                  View
                </Link>
              </Table.Td>
            </Table.Tr>
          ))}
        </tbody>
      </Table.Root>
    </Panel>
  );
};

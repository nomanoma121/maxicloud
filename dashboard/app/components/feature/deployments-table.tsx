import { Link } from "react-router";
import { css } from "styled-system/css";
import { StatusBadge } from "~/components/ui/badge";
import { Table } from "~/components/ui/table";
import { APP_ROUTES } from "~/constant";
import type { DeploymentStatus } from "~/types";

export type DeploymentRowItem = {
  id: string;
  projectName: string;
  applicationName: string;
  ownerName: string;
  status: DeploymentStatus;
  startedAt: string;
  duration: string;
};

type DeploymentsTableProps = {
  rows: DeploymentRowItem[];
};

export const DeploymentsTable = ({ rows }: DeploymentsTableProps) => {
  return (
    <Table.Root>
      <thead>
        <Table.Tr>
          <Table.Th>プロジェクト</Table.Th>
          <Table.Th>アプリケーション</Table.Th>
          <Table.Th>グループ</Table.Th>
          <Table.Th>ステータス</Table.Th>
          <Table.Th>終了日時</Table.Th>
          <Table.Th>実行時間</Table.Th>
          <Table.Th>詳細</Table.Th>
        </Table.Tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Table.Tr key={row.id}>
            <Table.Td>{row.projectName}</Table.Td>
            <Table.Td>{row.applicationName}</Table.Td>
            <Table.Td>{row.ownerName}</Table.Td>
            <Table.Td>
              <StatusBadge status={row.status} />
            </Table.Td>
            <Table.Td>{row.startedAt}</Table.Td>
            <Table.Td>{row.duration}</Table.Td>
            <Table.Td>
              <Link
                to={APP_ROUTES.deploymentDetail(row.id)}
                className={css({ color: "green.700", fontSize: "sm" })}
              >
                詳細
              </Link>
            </Table.Td>
          </Table.Tr>
        ))}
      </tbody>
    </Table.Root>
  );
};

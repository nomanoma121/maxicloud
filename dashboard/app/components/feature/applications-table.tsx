import { Link } from "react-router";
import { css } from "styled-system/css";
import { APPLICATION_STATUS_LABEL } from "~/constants";
import { Table } from "~/components/ui/table";
import type { ApplicationStatus } from "~/repository/application";

type ApplicationRowItem = {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  ownerName: string;
  status: ApplicationStatus;
  url?: string;
  updatedAt: string;
};

type ApplicationsTableProps = {
  rows: ApplicationRowItem[];
};

export const ApplicationsTable = ({ rows }: ApplicationsTableProps) => {
  return (
    <Table.Root>
      <thead>
        <Table.Tr>
          <Table.Th>アプリケーション</Table.Th>
          <Table.Th>プロジェクト</Table.Th>
          <Table.Th>グループ</Table.Th>
          <Table.Th>ステータス</Table.Th>
          <Table.Th>最終更新</Table.Th>
          <Table.Th>URL</Table.Th>
          <Table.Th>詳細</Table.Th>
        </Table.Tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Table.Tr key={row.id}>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>
              <Link
                to={`/projects/${row.projectId}`}
                className={css({ color: "green.700", fontSize: "sm" })}
              >
                {row.projectName}
              </Link>
            </Table.Td>
            <Table.Td>{row.ownerName}</Table.Td>
            <Table.Td>{APPLICATION_STATUS_LABEL[row.status]}</Table.Td>
            <Table.Td>{row.updatedAt}</Table.Td>
            <Table.Td>
              {row.url ? (
                <a href={row.url} target="_blank" rel="noopener noreferrer" className={css({ color: "green.700", fontSize: "sm" })}>
                  {row.url}
                </a>
              ) : (
                <span className={css({ color: "gray.500", fontSize: "sm" })}>-</span>
              )}
            </Table.Td>
            <Table.Td>
              <Link
                to={`/applications/${row.id}`}
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

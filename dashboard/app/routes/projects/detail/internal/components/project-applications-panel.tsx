import { Link } from "react-router";
import { css } from "styled-system/css";
import { StatusBadge } from "~/components/ui/badge";
import { Panel } from "~/components/ui/panel";
import { Table } from "~/components/ui/table";
import { APP_ROUTES } from "~/constant";
import type { Application, UserAccount } from "~/types";

type ProjectApplicationsPanelProps = {
  projectId: string;
  applications: Application[];
  userByID: Record<string, UserAccount | undefined>;
};

export const ProjectApplicationsPanel = ({
  projectId,
  applications,
  userByID,
}: ProjectApplicationsPanelProps) => {
  return (
    <Panel
      title="Applications"
      subtitle="このProjectに紐づくApplication一覧"
      rightSlot={(
        <Link
          to={`${APP_ROUTES.applicationNew}?projectId=${projectId}`}
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
          {applications.map((application) => (
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
                <Link
                  to={APP_ROUTES.applicationDetail(application.id)}
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

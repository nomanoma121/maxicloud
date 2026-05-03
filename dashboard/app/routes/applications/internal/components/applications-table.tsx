import { Link } from "react-router";
import { css } from "styled-system/css";
import { StatusBadge } from "~/components/ui/badge";
import { Table } from "~/components/ui/table";
import { APP_ROUTES } from "~/constant";
import type { Project, UserAccount } from "~/types";
import type { ApplicationsListItem } from "~/routes/applications/internal/hooks/use-applications-list-view";

type ApplicationsTableProps = {
  applications: ApplicationsListItem[];
  projectByID: Record<string, Project | undefined>;
  userByID: Record<string, UserAccount | undefined>;
};

export const ApplicationsTable = ({
  applications,
  projectByID,
  userByID,
}: ApplicationsTableProps) => {
  return (
    <Table.Root>
      <thead>
        <Table.Tr>
          <Table.Th>Application</Table.Th>
          <Table.Th>Project</Table.Th>
          <Table.Th>Owner</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>CPU</Table.Th>
          <Table.Th>Memory</Table.Th>
          <Table.Th>Updated</Table.Th>
          <Table.Th>Detail</Table.Th>
        </Table.Tr>
      </thead>
      <tbody>
        {applications.map((application) => (
          <Table.Tr key={application.id}>
            <Table.Td>
              <strong>{application.name}</strong>
              <div className={css({ color: "gray.500", fontSize: "xs" })}>
                {application.repository} ({application.branch})
              </div>
            </Table.Td>
            <Table.Td>
              <Link
                to={APP_ROUTES.projectDetail(application.projectId)}
                className={css({ color: "green.700", fontSize: "sm" })}
              >
                {projectByID[application.projectId]?.name}
              </Link>
            </Table.Td>
            <Table.Td>{userByID[application.ownerId]?.displayName}</Table.Td>
            <Table.Td>
              <StatusBadge status={application.status} />
            </Table.Td>
            <Table.Td>{application.cpu}</Table.Td>
            <Table.Td>{application.memory}</Table.Td>
            <Table.Td>{application.updatedAt}</Table.Td>
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
  );
};

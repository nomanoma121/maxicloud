import { Link } from "react-router";
import { css } from "styled-system/css";
import { Table } from "~/components/ui/table";
import { APP_ROUTES } from "~/constant";
import type { UserAccount } from "~/types";
import type {
  ProjectCountByID,
  ProjectsListItem,
} from "~/routes/projects/internal/hooks/use-projects-list-view";

type ProjectsTableProps = {
  projects: ProjectsListItem[];
  projectCountByID: ProjectCountByID;
  userByID: Record<string, UserAccount | undefined>;
};

export const ProjectsTable = ({
  projects,
  projectCountByID,
  userByID,
}: ProjectsTableProps) => {
  return (
    <Table.Root>
      <thead>
        <Table.Tr>
          <Table.Th>Project</Table.Th>
          <Table.Th>Owner</Table.Th>
          <Table.Th>Applications</Table.Th>
          <Table.Th>Healthy</Table.Th>
          <Table.Th>Updated</Table.Th>
          <Table.Th>Detail</Table.Th>
        </Table.Tr>
      </thead>
      <tbody>
        {projects.map((project) => {
          const count = projectCountByID[project.id];

          return (
            <Table.Tr key={project.id}>
              <Table.Td>
                <strong>{project.name}</strong>
                <div className={css({ color: "gray.500", fontSize: "xs" })}>{project.description}</div>
              </Table.Td>
              <Table.Td>{userByID[project.ownerId]?.displayName}</Table.Td>
              <Table.Td>{count?.total ?? 0}</Table.Td>
              <Table.Td>{count?.healthy ?? 0}</Table.Td>
              <Table.Td>{project.updatedAt}</Table.Td>
              <Table.Td>
                <Link
                  to={APP_ROUTES.projectDetail(project.id)}
                  className={css({ color: "green.700", fontSize: "sm", textDecoration: "none" })}
                >
                  Detail
                </Link>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </tbody>
    </Table.Root>
  );
};

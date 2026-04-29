import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Folder, Search } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Panel } from "~/components/ui/panel";
import { Table } from "~/components/ui/table";
import { useProjectsData } from "~/routes/projects/internal/hooks/use-projects-data";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const { projects, applications, userByID } = useProjectsData();

  const projectCounts = useMemo(
    () =>
      Object.fromEntries(
        projects.map((project) => {
          const items = applications.filter((application) => application.projectId === project.id);
          const healthy = items.filter((application) => application.status === "healthy").length;
          return [project.id, { total: items.length, healthy }] as const;
        }),
      ),
    [projects, applications],
  );

  const data = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return projects;

    return projects.filter((project) =>
      [project.name, project.description, userByID[project.ownerId]?.displayName ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [keyword, projects, userByID]);

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Projects", icon: <Folder size={14} /> },
        ]}
      />

      <DashboardHeader
        title="Projects"
        subtitle="ProjectごとにApplicationをまとめて管理します"
      />

      <Panel>
        <div
          className={css({
            display: "flex",
            gap: 2,
            alignItems: "center",
            marginBottom: 4,
          })}
        >
          <label
            className={css({
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
              border: "1px solid",
              borderColor: "gray.300",
              borderRadius: "md",
              background: "white",
              padding: "token(spacing.2) token(spacing.3)",
            })}
          >
            <Search size={14} />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              type="text"
              placeholder="project / description / owner"
              className={css({
                border: "none",
                outline: "none",
                width: "100%",
                background: "transparent",
                fontSize: "sm",
              })}
            />
          </label>
          <Button type="button" variant="secondary" size="sm" onClick={() => navigate("/projects/new")}>
            New Project
          </Button>
        </div>

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
            {data.map((project) => {
              const count = projectCounts[project.id];
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
                    <Link to={`/projects/${project.id}`} className={css({ color: "green.700", fontSize: "sm", textDecoration: "none" })}>
                      Detail
                    </Link>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </tbody>
        </Table.Root>
      </Panel>
    </div>
  );
}

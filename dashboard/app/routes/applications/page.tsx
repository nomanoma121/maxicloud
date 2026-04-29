import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Box, Search } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { StatusBadge } from "~/components/ui/badge";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Panel } from "~/components/ui/panel";
import { Table } from "~/components/ui/table";
import { useApplicationsData } from "~/routes/applications/internal/hooks/use-applications-data";

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const { projectByID, applications, userByID } = useApplicationsData();

  const data = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return applications;

    return applications.filter((application) =>
      [application.name, application.repository, projectByID[application.projectId]?.name ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [keyword, projectByID, applications]);

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Applications", icon: <Box size={14} /> },
        ]}
      />

      <DashboardHeader
        title="Applications"
        subtitle="全ProjectのApplicationを横断で確認できます"
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
              placeholder="application / project / repo"
              className={css({
                border: "none",
                outline: "none",
                width: "100%",
                background: "transparent",
                fontSize: "sm",
              })}
            />
          </label>
          <Button type="button" variant="secondary" size="sm" onClick={() => navigate("/applications/new")}>
            New Application
          </Button>
        </div>

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
            {data.map((application) => (
              <Table.Tr key={application.id}>
                <Table.Td>
                  <strong>{application.name}</strong>
                  <div className={css({ color: "gray.500", fontSize: "xs" })}>
                    {application.repository} ({application.branch})
                  </div>
                </Table.Td>
                <Table.Td>
                  <Link to={`/projects/${application.projectId}`} className={css({ color: "green.700", fontSize: "sm" })}>
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
                  <Link to={`/applications/${application.id}`} className={css({ color: "green.700", fontSize: "sm" })}>
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

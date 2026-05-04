import { Link } from "react-router";
import { css } from "styled-system/css";
import { ApplicationsTable } from "~/components/feature/applications-table";
import type { ApplicationRowItem } from "~/components/feature/applications-table";
import { Panel } from "~/components/ui/panel";
import { APP_ROUTES } from "~/constant";
import type { Application, UserAccount } from "~/types";

type ProjectApplicationsPanelProps = {
  projectId: string;
  projectName: string;
  applications: Application[];
  userByID: Record<string, UserAccount | undefined>;
};

export const ProjectApplicationsPanel = ({
  projectId,
  projectName,
  applications,
  userByID,
}: ProjectApplicationsPanelProps) => {
  const rows: ApplicationRowItem[] = applications.map((a) => ({
    id: a.id,
    name: a.name,
    projectId: a.projectId,
    projectName,
    ownerName: userByID[a.ownerId]?.displayName ?? "-",
    status: a.status,
    cpu: a.cpu,
    memory: a.memory,
    url: a.url,
    updatedAt: a.updatedAt,
  }));

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
      <ApplicationsTable rows={rows} />
    </Panel>
  );
};

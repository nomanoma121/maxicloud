import { DeploymentsTable } from "~/components/feature/deployments-table";
import type { DeploymentRowItem } from "~/components/feature/deployments-table";
import { Panel } from "~/components/ui/panel";
import type { Application, DeploymentRun, Project, UserAccount } from "~/types";

type ProjectDeploymentsPanelProps = {
  deployments: DeploymentRun[];
  applicationByID: Record<string, Application | undefined>;
  projectByID: Record<string, Project | undefined>;
  userByID: Record<string, UserAccount | undefined>;
};

export const ProjectDeploymentsPanel = ({
  deployments,
  applicationByID,
  projectByID,
  userByID,
}: ProjectDeploymentsPanelProps) => {
  const rows: DeploymentRowItem[] = deployments.map((d) => {
    const application = applicationByID[d.applicationId];
    return {
      id: d.id,
      projectName: projectByID[application?.projectId ?? ""]?.name ?? "-",
      applicationName: application?.name ?? "-",
      ownerName: userByID[d.ownerId]?.displayName ?? "-",
      status: d.status,
      startedAt: d.startedAt,
      duration: d.duration,
    };
  });

  return (
    <Panel title="Recent Deployments" subtitle="このProject配下の実行履歴">
      <DeploymentsTable rows={rows} />
    </Panel>
  );
};

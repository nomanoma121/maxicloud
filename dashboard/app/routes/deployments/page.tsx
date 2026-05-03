import { DeploymentsTable } from "~/components/feature/deployments-table";
import type { DeploymentRowItem } from "~/components/feature/deployments-table";
import { Panel } from "~/components/ui/panel";
import { useDeploymentsData } from "~/routes/deployments/internal/hooks/use-deployments-data";

export default function DeploymentsPage() {
  const { deployments, applicationByID, projectByID, userByID } = useDeploymentsData();

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
    <Panel>
      <DeploymentsTable rows={rows} />
    </Panel>
  );
}

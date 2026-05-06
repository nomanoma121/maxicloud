import { useOutletContext } from "react-router";
import { Panel } from "~/components/ui/panel";
import { BuildLog } from "./internal/components/log";
import { StatusPanel } from "./internal/components/status-panel";
import { SummaryPanel } from "./internal/components/summary-panel";
import { useWatchDeployment } from "./internal/hooks/use-watch-deployment";
import type { DeploymentDetailContext } from "./layout";

export default function DeploymentDetailPage() {
  const { deployment, deploymentId, applicationByID, userByID } = useOutletContext<DeploymentDetailContext>();
  const { status, duration, logLines } = useWatchDeployment(deploymentId);

  const application = applicationByID[deployment.applicationId];
  const owner = userByID[deployment.ownerId];
  const repository = application?.repository ?? "-";

  return (
    <>
      <StatusPanel
        status={status ?? deployment.status}
        duration={duration || deployment.duration}
        finishedAt={deployment.finishedAt}
      />

      <Panel title="サマリー">
        <SummaryPanel
          applicationName={application?.name ?? "-"}
          ownerName={owner?.displayName ?? "-"}
          repository={repository}
          repoURL={buildGitHubRepoURL(repository)}
          appURL={application?.url ?? "-"}
          branch={application?.branch ?? "-"}
          commit={deployment.revision}
        />
      </Panel>

      <Panel title="ログ">
        <BuildLog lines={logLines} />
      </Panel>
    </>
  );
}

const buildGitHubRepoURL = (repository: string): string | undefined => {
  if (!repository || repository === "-" || !repository.includes("/")) {
    return undefined;
  }
  return `https://github.com/${repository}`;
};

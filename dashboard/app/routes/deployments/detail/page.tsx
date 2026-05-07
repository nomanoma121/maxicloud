import { useOutletContext } from "react-router";
import { Panel } from "~/components/ui/panel";
import { formatDateTime } from "~/utils/date";
import { Log } from "./internal/components/log";
import { StatusPanel } from "./internal/components/status-panel";
import { SummaryPanel } from "./internal/components/summary-panel";
import { useWatchDeployment } from "./internal/hooks/use-watch-deployment";
import type { DeploymentDetailContext } from "./layout";

export default function DeploymentDetailPage() {
  const { deployment, deploymentId, applicationByID, userByID } = useOutletContext<DeploymentDetailContext>();
  const { status, duration, finishedAt, logLines } = useWatchDeployment(deploymentId);

  const application = applicationByID[deployment.applicationId];
  const owner = userByID[deployment.ownerId];
  const repository = application?.repository ?? "-";

  return (
    <>
      <StatusPanel
        status={status ?? deployment.status}
        duration={duration || deployment.duration || "-"}
        finishedAt={finishedAt ? formatDateTime(finishedAt) : (deployment.finishedAt || "-")}
      />

      <Panel title="サマリー">
        <SummaryPanel
          applicationName={application?.name ?? "-"}
          ownerName={owner?.displayName ?? "-"}
          repository={repository}
          repoURL={buildGitHubRepoURL(repository)}
          appURL={application?.url ?? "-"}
          branch={application?.branch ?? "-"}
          commit={deployment.commit.shortSHA || "-"}
        />
      </Panel>

      <Panel title="ログ">
        <Log lines={logLines} />
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

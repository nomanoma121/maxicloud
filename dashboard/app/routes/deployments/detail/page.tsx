import { useOutletContext } from "react-router";
import { Panel } from "~/components/ui/panel";
import { BuildLog } from "./internal/components/build-log";
import { StatusPanel } from "./internal/components/status-panel";
import { SummaryPanel } from "./internal/components/summary-panel";
import type { DeploymentDetailContext } from "./layout";

export default function DeploymentDetailPage() {
  const { deployment, applicationByID, userByID } = useOutletContext<DeploymentDetailContext>();

  const application = applicationByID[deployment.applicationId];
  const owner = userByID[deployment.ownerId];
  const repository = application?.repository ?? "-";

  return (
    <>
      <StatusPanel
        status={deployment.status}
        duration={deployment.duration}
        finishedAt={deployment.finishedAt}
      />

      <Panel title="Summary">
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

      <Panel title="Build Log" subtitle="ダミー — ログストリームは未実装">
        <BuildLog />
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

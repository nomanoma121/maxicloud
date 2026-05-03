import { useParams } from "react-router";
import { Layers } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { APP_ROUTES } from "~/constant";
import { useDeploymentDetailData } from "~/routes/deployments/internal/hooks/use-deployments-data";
import { BuildLog } from "./internal/components/build-log";
import { StatusPanel } from "./internal/components/status-panel";
import { SummaryPanel } from "./internal/components/summary-panel";

export default function DeploymentDetailPage() {
  const { deploymentId = "" } = useParams();
  const { deployment, applicationByID, userByID } = useDeploymentDetailData(deploymentId);

  if (!deployment) {
    return (
      <div className={css({ display: "grid", gap: 4 })}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: APP_ROUTES.home },
            { label: "Deployments", href: APP_ROUTES.deployments, icon: <Layers size={14} /> },
            { label: "Not Found" },
          ]}
        />
        <DashboardHeader title="Deployment Not Found" subtitle="指定されたデプロイは存在しません" />
      </div>
    );
  }

  const application = applicationByID[deployment.applicationId];
  const owner = userByID[deployment.ownerId];
  const repository = application?.repository ?? "-";

  return (
    <div className={css({ display: "grid", gap: 5 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          { label: "Deployments", href: APP_ROUTES.deployments, icon: <Layers size={14} /> },
          { label: deployment.revision },
        ]}
      />

      <DashboardHeader
        title={deployment.commitMessage || "Commit message unavailable"}
        subtitle={`${application?.name ?? "-"} ・ ${application?.branch ?? "-"} ・ ${deployment.revision}`}
      />

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
    </div>
  );
}

const buildGitHubRepoURL = (repository: string): string | undefined => {
  if (!repository || repository === "-" || !repository.includes("/")) {
    return undefined;
  }
  return `https://github.com/${repository}`;
};

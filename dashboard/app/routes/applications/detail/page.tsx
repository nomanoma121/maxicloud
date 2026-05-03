import { useOutletContext, useSearchParams } from "react-router";
import { css } from "styled-system/css";
import { DeploymentsTable } from "~/components/feature/deployments-table";
import { StatusBadge } from "~/components/ui/badge";
import { Panel } from "~/components/ui/panel";
import { APP_ROUTES } from "~/constant";
import type { ApplicationDetailContext } from "./layout";
import { SummaryRow } from "./internal/components/summary-row";

export default function ApplicationDetailPage() {
  const [searchParams] = useSearchParams();
  const { deployments, projectByID, application, userByID } =
    useOutletContext<ApplicationDetailContext>();
  const deployStartFailed = searchParams.get("deploy_start") === "failed";

  const owner = userByID[application.ownerId];
  const project = projectByID[application.projectId];
  const deploymentRows = deployments
    .filter((d) => d.applicationId === application.id)
    .map((d) => ({
      id: d.id,
      projectName: project?.name ?? "-",
      applicationName: application.name,
      ownerName: userByID[d.ownerId]?.displayName ?? "-",
      status: d.status,
      startedAt: d.startedAt,
      duration: d.duration,
    }));

  return (
    <div className={css({ display: "grid", gap: 4 })}>
      {deployStartFailed && (
        <Panel title="Deployment Notice">
          <p className={css({ margin: 0, color: "orange.700", fontSize: "sm", fontWeight: 600 })}>
            Applicationは作成されましたが、初回デプロイの開始に失敗しました。Deployments画面から再実行してください。
          </p>
        </Panel>
      )}

      <Panel title="Application Summary" rightSlot={<StatusBadge status={application.status} />}>
        <dl
          className={css({
            margin: 0,
            display: "grid",
            gap: 2,
          })}
        >
          <SummaryRow label="プロジェクト" value={project?.name ?? "-"} href={project ? APP_ROUTES.projectDetail(project.id) : undefined} />
          <SummaryRow label="グループ" value={owner?.displayName ?? "-"} />
          <SummaryRow label="CPU" value={application.cpu} />
          <SummaryRow label="Memory" value={application.memory} />
          <SummaryRow label="最終更新" value={application.updatedAt} />
          <SummaryRow label="URL" value={application.url} href={application.url} />
        </dl>
      </Panel>

      <Panel title="Recent Deployments" subtitle="このApplicationに紐づく履歴">
        <DeploymentsTable rows={deploymentRows} />
      </Panel>
    </div>
  );
}

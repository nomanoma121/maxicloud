import { Layers } from "react-feather";
import { Outlet, useParams } from "react-router";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { APP_ROUTES } from "~/constant";
import { useDeploymentDetailData } from "~/routes/deployments/internal/hooks/use-deployments-data";

type BaseDetail = ReturnType<typeof useDeploymentDetailData>;

export type DeploymentDetailContext = BaseDetail & {
  deployment: NonNullable<BaseDetail["deployment"]>;
  deploymentId: string;
};

export default function DeploymentDetailLayout() {
  const { deploymentId = "" } = useParams();
  const detail = useDeploymentDetailData(deploymentId);

  if (!detail.deployment) {
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

  const application = detail.applicationByID[detail.deployment.applicationId];

  return (
    <div className={css({ display: "grid", gap: 5 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          { label: "Deployments", href: APP_ROUTES.deployments, icon: <Layers size={14} /> },
          { label: detail.deployment.revision },
        ]}
      />

      <DashboardHeader
        title={detail.deployment.commitMessage || "Commit message unavailable"}
        subtitle={`${application?.name ?? "-"} ・ ${application?.branch ?? "-"} ・ ${detail.deployment.revision}`}
      />

      <Outlet context={{ ...detail, deploymentId }} />
    </div>
  );
}

import { Outlet } from "react-router";
import { Layers } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { APP_ROUTES } from "~/constant";

export default function DeploymentsLayout() {
  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          { label: "Deployments", icon: <Layers size={14} /> },
        ]}
      />

      <DashboardHeader
        title="Deployments"
        subtitle="サークル内のデプロイ履歴（全ユーザー）"
      />
      <Outlet />
    </div>
  );
}

import { Outlet } from "react-router";
import { Box } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { APP_ROUTES } from "~/constant";

export default function ApplicationsLayout() {
  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          {
            label: "Applications",
            href: APP_ROUTES.applications,
            icon: <Box size={14} />,
          },
        ]}
      />
      <DashboardHeader
        title="Applications"
        subtitle="全ProjectのApplicationを横断で確認できます"
      />
      <Outlet />
    </div>
  );
}

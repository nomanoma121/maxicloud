import { Box } from "react-feather";
import { Link } from "react-router";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";
import { APP_ROUTES } from "~/constant";

export const ApplicationNotFoundState = () => {
  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          { label: "Applications", href: APP_ROUTES.applications, icon: <Box size={14} /> },
          { label: "Not Found" },
        ]}
      />

      <DashboardHeader
        title="Application Not Found"
        subtitle="指定されたApplicationは存在しません"
      />

      <Panel>
        <p className={css({ margin: 0, color: "gray.600", fontSize: "sm" })}>
          URL を確認してください。Application一覧に戻って選び直せます。
        </p>
        <Link
          to={APP_ROUTES.applications}
          className={css({ marginTop: 3, display: "inline-block", color: "green.700", fontSize: "sm" })}
        >
          Back to Applications
        </Link>
      </Panel>
    </div>
  );
};

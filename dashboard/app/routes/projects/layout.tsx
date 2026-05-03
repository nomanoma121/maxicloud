import { Outlet } from "react-router";
import { Folder } from "react-feather";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { APP_ROUTES } from "~/constant";

export default function ProjectsLayout() {
  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: APP_ROUTES.home },
          {
            label: "Projects",
            href: APP_ROUTES.projects,
            icon: <Folder size={14} />,
          },
        ]}
      />
      <DashboardHeader
        title="Projects"
        subtitle="ProjectごとにApplicationをまとめて管理します"
      />
      <Outlet />
    </div>
  );
}

import { Folder } from "react-feather";
import { Link } from "react-router";
import { css } from "styled-system/css";
import { DashboardHeader } from "~/components/layout/dashboard-header";
import { Breadcrumb } from "~/components/ui/breadcrumb";
import { Panel } from "~/components/ui/panel";

export const ProjectNotFoundState = () => {
  return (
    <div className={css({ display: "grid", gap: 4 })}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Projects", href: "/projects", icon: <Folder size={14} /> },
          { label: "Not Found" },
        ]}
      />

      <DashboardHeader
        title="Project Not Found"
        subtitle="指定されたProjectは存在しません"
      />

      <Panel>
        <p className={css({ margin: 0, color: "gray.600", fontSize: "sm" })}>
          URL を確認してください。Project一覧に戻って選び直せます。
        </p>
        <Link
          to="/projects"
          className={css({ marginTop: 3, display: "inline-block", color: "green.700", fontSize: "sm" })}
        >
          Back to Projects
        </Link>
      </Panel>
    </div>
  );
};

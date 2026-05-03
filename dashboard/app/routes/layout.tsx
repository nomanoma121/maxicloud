import { Outlet } from "react-router";
import { css } from "styled-system/css";
import { DashboardMain } from "~/components/layout/dashboard-main";
import { DashboardShell } from "~/components/layout/dashboard-shell";
import { Sidebar } from "~/components/layout/sidebar";
import { useSession } from "~/hooks/use-session";

export default function DashboardLayout() {
  const { isReady } = useSession();

  if (!isReady) {
    return null;
  }

  return (
    <DashboardShell>
      <div
        className={css({
          display: "flex",
          height: "100%",
          minHeight: 0,
        })}
      >
        <Sidebar />
        <DashboardMain>
          <Outlet />
        </DashboardMain>
      </div>
    </DashboardShell>
  );
}

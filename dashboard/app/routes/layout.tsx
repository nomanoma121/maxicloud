import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { css } from "styled-system/css";
import { DashboardMain } from "~/components/layout/dashboard-main";
import { DashboardShell } from "~/components/layout/dashboard-shell";
import { Sidebar } from "~/components/layout/sidebar";
import { useSession } from "~/hooks/use-session";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isReady, isLoggedIn } = useSession();

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      const redirect = `${location.pathname}${location.search}`;
      navigate(`/login?redirect_to=${encodeURIComponent(redirect)}`);
    }
  }, [isReady, isLoggedIn, location.pathname, location.search, navigate]);

  if (!isReady || !isLoggedIn) {
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

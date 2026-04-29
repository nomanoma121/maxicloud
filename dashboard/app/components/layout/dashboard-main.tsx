import type { ReactNode } from "react";
import { css, cx } from "styled-system/css";
import { cq } from "styled-system/patterns";

type DashboardMainProps = {
  children: ReactNode;
};

export const DashboardMain = ({ children }: DashboardMainProps) => (
  <main
    className={cx(
      css({
        flex: 1,
        padding: 8,
        minHeight: 0,
        overflowY: "auto",
        overscrollBehavior: "contain",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        mdDown: {
          padding: 4,
          paddingTop: 16,
        },
      }),
      cq({
        name: "dashboard",
      }),
    )}
  >
    {children}
  </main>
);

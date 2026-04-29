import { css } from "styled-system/css";
import type { UserAccount } from "~/types";

export const SidebarProfile = ({ user }: { user?: UserAccount }) => (
  <div
    className={css({
      marginTop: 6,
      borderRadius: "md",
      border: "1px solid",
      borderColor: "gray.200",
      background: "white",
      padding: 3,
    })}
  >
    <p className={css({ margin: 0, color: "gray.800", fontWeight: 600, fontSize: "sm" })}>
      {user?.displayName}
    </p>
    <p className={css({ marginTop: 1, marginBottom: 0, color: "gray.600", fontSize: "xs" })}>
      @{user?.displayId}
    </p>
  </div>
);

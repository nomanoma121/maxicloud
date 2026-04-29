import { css } from "styled-system/css";

export const SidebarDot = ({ isActive }: { isActive?: boolean }) => (
  <span
    className={css({
      width: 3,
      height: 3,
      flexShrink: 0,
      background: "green.500",
      borderRadius: "50%",
      opacity: isActive ? 1 : 0,
    })}
  />
);

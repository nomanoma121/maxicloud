import { NavLink } from "react-router";
import { css } from "styled-system/css";
import { NAVIGATION_ITEMS } from "~/constants/navigation";
import { SidebarDot } from "./dot";

type SidebarNavigationProps = {
  pathname: string;
  onNavigate: () => void;
};

export const SidebarNavigation = ({ pathname, onNavigate }: SidebarNavigationProps) => (
  <nav>
    <ul
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: 2,
        listStyle: "none",
        padding: 0,
        margin: 0,
      })}
    >
      {NAVIGATION_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);

        return (
          <li
            key={item.to}
            className={css({
              display: "flex",
              alignItems: "center",
              gap: 2,
            })}
          >
            <SidebarDot isActive={isActive} />
            <NavLink
              to={item.to}
              end={item.to === "/"}
              onClick={onNavigate}
              className={css({
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                textDecoration: "none",
                padding: "token(spacing.2) token(spacing.3)",
                borderRadius: "md",
                color: isActive ? "gray.700" : "gray.500",
                fontWeight: isActive ? 600 : 500,
                _hover: {
                  color: "gray.700",
                },
              })}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </NavLink>
          </li>
        );
      })}
    </ul>
  </nav>
);

import { css } from "styled-system/css";

type HamburgerButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export const SidebarHamburgerButton = ({ isOpen, onToggle }: HamburgerButtonProps) => (
  <button
    type="button"
    className={css({
      position: "fixed",
      top: 4,
      right: 4,
      display: "none",
      zIndex: 30,
      width: 12,
      height: 12,
      cursor: "pointer",
      borderRadius: 4,
      background: "white",
      border: "1px solid",
      borderColor: "gray.200",
      transition: "background",
      _hover: {
        background: "gray.100",
      },
      mdDown: {
        display: "block",
      },
    })}
    aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
    onClick={onToggle}
  >
    <span
      className={css({
        position: "absolute",
        width: 8,
        height: "2px",
        background: "gray.600",
        top: "50%",
        left: "50%",
        transform: isOpen
          ? "translate(-50%, -50%) rotate(45deg)"
          : "translate(-50%, calc(-50% - 8px))",
        transition: "transform",
      })}
    />
    <span
      className={css({
        position: "absolute",
        width: 8,
        height: "2px",
        background: "gray.600",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: isOpen ? 0 : 1,
        transition: "opacity",
      })}
    />
    <span
      className={css({
        position: "absolute",
        width: 8,
        height: "2px",
        background: "gray.600",
        top: "50%",
        left: "50%",
        transform: isOpen
          ? "translate(-50%, -50%) rotate(-45deg)"
          : "translate(-50%, calc(-50% + 8px))",
        transition: "transform",
      })}
    />
  </button>
);

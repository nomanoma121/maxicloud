import { css } from "styled-system/css";

type SidebarBackdropProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SidebarBackdrop = ({ isOpen, onClose }: SidebarBackdropProps) => (
  <div
    className={css({
      position: "fixed",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      pointerEvents: isOpen ? "auto" : "none",
      opacity: isOpen ? 1 : 0,
      transition: "opacity",
      background: "rgba(0, 0, 0, 0.2)",
      zIndex: 20,
    })}
    onClick={onClose}
  />
);

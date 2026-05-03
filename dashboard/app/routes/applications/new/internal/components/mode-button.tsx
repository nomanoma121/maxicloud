import { CheckCircle } from "react-feather";
import { css } from "styled-system/css";

type ModeButtonProps = {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
};

export const ModeButton = ({
  active,
  title,
  description,
  onClick,
}: ModeButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={css({
      border: "1px solid",
      borderColor: active ? "green.500" : "gray.200",
      borderRadius: "md",
      background: active ? "green.50" : "white",
      padding: 3,
      textAlign: "left",
      cursor: "pointer",
      display: "grid",
      gap: 1,
      _hover: {
        borderColor: "green.500",
      },
    })}
  >
    <span
      className={css({
        fontSize: "sm",
        color: "gray.800",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
      })}
    >
      {active && <CheckCircle size={14} />}
      {title}
    </span>
    <span className={css({ fontSize: "xs", color: "gray.500" })}>
      {description}
    </span>
  </button>
);

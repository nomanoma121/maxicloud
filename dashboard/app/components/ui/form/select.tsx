import type { ComponentProps } from "react";
import { css, cx } from "styled-system/css";

type Props = ComponentProps<"select">;

const baseStyle = css({
  width: "100%",
  borderRadius: 6,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "gray.300",
  backgroundColor: "white",
  fontSize: "sm",
  outline: "none",
  transition: "border-color 0.2s ease",
  appearance: "none",
  padding: "token(spacing.2) token(spacing.9) token(spacing.2) token(spacing.3)",
  backgroundImage:
    "linear-gradient(45deg, transparent 50%, token(colors.gray.500) 50%), linear-gradient(135deg, token(colors.gray.500) 50%, transparent 50%)",
  backgroundPosition: "calc(100% - 16px) calc(50% - 2px), calc(100% - 11px) calc(50% - 2px)",
  backgroundSize: "5px 5px, 5px 5px",
  backgroundRepeat: "no-repeat",
  _focus: { borderColor: "green.600" },
});

export const Select = ({ className, ...props }: Props) => (
  <select {...props} className={cx(baseStyle, className)} />
);

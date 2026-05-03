import type { ComponentProps } from "react";
import { css, cx } from "styled-system/css";

type Props = ComponentProps<"input">;

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
  padding: "token(spacing.2) token(spacing.3)",
  _focus: { borderColor: "green.600" },
});

export const Input = ({ className, ...props }: Props) => (
  <input {...props} className={cx(baseStyle, className)} />
);

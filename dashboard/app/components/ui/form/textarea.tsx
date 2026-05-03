import type { ComponentProps } from "react";
import { css, cx } from "styled-system/css";

type Props = ComponentProps<"textarea">;

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
  resize: "vertical",
  minHeight: "96px",
  _focus: { borderColor: "green.600" },
});

export const Textarea = ({ className, ...props }: Props) => (
  <textarea {...props} className={cx(baseStyle, className)} />
);

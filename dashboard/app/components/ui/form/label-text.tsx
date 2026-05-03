import type { ComponentProps } from "react";
import { css, cx } from "styled-system/css";

type Props = ComponentProps<"span">;

export const LabelText = ({ className, ...props }: Props) => (
  <span
    {...props}
    className={cx(
      css({ display: "block", fontSize: "sm", fontWeight: 600, color: "gray.600" }),
      className,
    )}
  />
);

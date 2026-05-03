import type { ComponentProps } from "react";
import { css, cx } from "styled-system/css";

type Props = ComponentProps<"fieldset">;

export const FieldSet = ({ className, ...props }: Props) => (
  <fieldset
    {...props}
    className={cx(
      css({ display: "flex", flexDirection: "column", gap: 1, width: "100%", border: "none", padding: 0, margin: 0 }),
      className,
    )}
  />
);

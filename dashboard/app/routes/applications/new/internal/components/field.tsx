import { css, cx } from "styled-system/css";

type FieldProps = {
  label: string;
  children: React.ReactNode;
  labelClassName?: string;
};

export const Field = ({ label, children, labelClassName }: FieldProps) => (
  <label className={css({ display: "grid", gap: 1 })}>
    <span
      className={cx(
        css({ fontSize: "sm", fontWeight: 600, color: "gray.600" }),
        labelClassName,
      )}
    >
      {label}
    </span>
    {children}
  </label>
);

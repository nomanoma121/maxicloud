import type { ReactNode } from "react";
import { css } from "styled-system/css";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
};

export const MetricCard = ({ label, value, hint, icon }: MetricCardProps) => {
  return (
    <div
      className={css({
        borderRadius: "lg",
        border: "1px solid",
        borderColor: "rgba(15, 23, 42, 0.08)",
        background: "white",
        padding: 4,
        display: "grid",
        gap: 2,
      })}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "gray.600",
          fontSize: "sm",
        })}
      >
        <span>{label}</span>
        {icon}
      </div>
      <strong
        className={css({
          fontSize: "2xl",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        })}
      >
        {value}
      </strong>
      {hint && (
        <span
          className={css({
            fontSize: "xs",
            color: "gray.500",
          })}
        >
          {hint}
        </span>
      )}
    </div>
  );
};

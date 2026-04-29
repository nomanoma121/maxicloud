import type { ReactNode } from "react";
import { css } from "styled-system/css";

type PanelProps = {
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
};

export const Panel = ({ title, subtitle, rightSlot, children }: PanelProps) => {
  return (
    <section
      className={css({
        background: "white",
        border: "1px solid",
        borderColor: "gray.100",
        borderRadius: "md",
        padding: 5,
      })}
    >
      {(title || subtitle || rightSlot) && (
        <header
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 3,
            marginBottom: 4,
          })}
        >
          <div>
            {title && (
              <h2
                className={css({
                  margin: 0,
                  fontSize: "xl",
                  letterSpacing: "-0.02em",
                })}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={css({
                  margin: 0,
                  marginTop: 1,
                  color: "gray.600",
                  fontSize: "sm",
                })}
              >
                {subtitle}
              </p>
            )}
          </div>
          {rightSlot}
        </header>
      )}
      {children}
    </section>
  );
};

import { css } from "styled-system/css";

export const DashboardHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <div className={css({ marginBottom: 4 })}>
      <h1
        className={css({
          fontSize: {
            base: "2xl",
            "@dashboard/xl": "3xl",
          },
          fontWeight: "bold",
          color: "gray.700",
          lineHeight: 1.2,
        })}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={css({
            marginTop: 1,
            marginBottom: 0,
            color: "gray.500",
            fontSize: "sm",
          })}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

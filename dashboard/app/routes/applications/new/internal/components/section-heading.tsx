import { css } from "styled-system/css";

type SectionHeadingProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export const SectionHeading = ({
  icon,
  title,
  description,
}: SectionHeadingProps) => (
  <header className={css({ display: "grid", gap: 1 })}>
    <p
      className={css({
        margin: 0,
        color: "gray.800",
        fontWeight: 700,
        fontSize: "sm",
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
      })}
    >
      {icon}
      {title}
    </p>
    <p className={css({ margin: 0, color: "gray.500", fontSize: "xs" })}>
      {description}
    </p>
  </header>
);

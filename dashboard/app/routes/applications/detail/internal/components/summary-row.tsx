import { Link } from "react-router";
import { css } from "styled-system/css";

type SummaryRowProps = {
  label: string;
  value: string;
  href?: string;
};

export const SummaryRow = ({ label, value, href }: SummaryRowProps) => (
  <div
    className={css({
      display: "grid",
      gridTemplateColumns: "100px 1fr",
      gap: 2,
      borderBottom: "1px solid",
      borderBottomColor: "gray.100",
      paddingBottom: 2,
    })}
  >
    <dt className={css({ color: "gray.500", fontSize: "xs", textTransform: "uppercase" })}>{label}</dt>
    <dd className={css({ margin: 0, color: "gray.700", fontSize: "sm" })}>
      {href ? (
        href.startsWith("/") ? (
          <Link to={href} className={css({ color: "green.700", textDecoration: "none" })}>
            {value}
          </Link>
        ) : (
          <a href={href} className={css({ color: "green.700", textDecoration: "none" })}>
            {value}
          </a>
        )
      ) : (
        value
      )}
    </dd>
  </div>
);

import { css } from "styled-system/css";

type SummaryRowProps = {
  label: string;
  value: string;
};

export const SummaryRow = ({ label, value }: SummaryRowProps) => (
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
    <dd className={css({ margin: 0, color: "gray.700", fontSize: "sm" })}>{value}</dd>
  </div>
);

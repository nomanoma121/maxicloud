import { css } from "styled-system/css";

type Props = {
  error?: string;
};

export const ErrorDisplay = ({ error }: Props) => {
  if (!error) return null;
  return (
    <p className={css({ color: "rose.600", fontSize: "sm", margin: 0 })}>
      {error}
    </p>
  );
};

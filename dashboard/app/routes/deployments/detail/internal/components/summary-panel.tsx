import { GitHub } from "react-feather";
import { css } from "styled-system/css";

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

type SummaryPanelProps = {
  applicationName: string;
  ownerName: string;
  repository: string;
  repoURL?: string;
  appURL: string;
  branch: string;
  commit: string;
};

export const SummaryPanel = ({
  applicationName,
  ownerName,
  repository,
  repoURL,
  appURL,
  branch,
  commit,
}: SummaryPanelProps) => (
  <div
    className={css({
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      rowGap: 6,
      columnGap: 8,
      smDown: { gridTemplateColumns: "1fr" },
    })}
  >
    <Field label="Application" value={applicationName} />
    <Field label="Owner" value={ownerName} />
    <RepositoryField repository={repository} repoURL={repoURL} />
    <URLField url={appURL} />
    <Field label="Branch" value={branch} mono />
    <Field label="Commit" value={commit} mono />
  </div>
);

const Field = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className={css({ display: "grid", gap: 1.5, minWidth: 0 })}>
    <span
      className={css({
        color: "gray.500",
        fontSize: "xs",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      })}
    >
      {label}
    </span>
    <span
      className={css({
        color: "gray.800",
        fontSize: "md",
        fontWeight: 600,
        overflow: mono ? "visible" : "hidden",
        textOverflow: mono ? "clip" : "ellipsis",
        whiteSpace: mono ? "normal" : "nowrap",
        wordBreak: mono ? "break-all" : "normal",
      })}
      style={{ fontFamily: mono ? MONO : undefined, fontSize: mono ? "0.9rem" : undefined }}
      title={mono ? value : undefined}
    >
      {value}
    </span>
  </div>
);

const RepositoryField = ({
  repository,
  repoURL,
}: {
  repository: string;
  repoURL?: string;
}) => (
  <div className={css({ display: "grid", gap: 1.5, minWidth: 0 })}>
    <span
      className={css({
        color: "gray.500",
        fontSize: "xs",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      })}
    >
      Repository
    </span>
    {repoURL ? (
      <a
        href={repoURL}
        target="_blank"
        rel="noreferrer"
        className={css({
          display: "inline-flex",
          alignItems: "center",
          gap: 2,
          width: "fit-content",
          color: "gray.800",
          textDecoration: "none",
          fontSize: "md",
          fontWeight: 600,
        })}
      >
        <GitHub size={16} />
        <span style={{ fontFamily: MONO, fontSize: "0.9rem" }}>{repository}</span>
      </a>
    ) : (
      <span className={css({ color: "gray.800", fontSize: "md", fontWeight: 600 })}>{repository}</span>
    )}
  </div>
);

const URLField = ({ url }: { url: string }) => (
  <div className={css({ display: "grid", gap: 1.5, minWidth: 0 })}>
    <span
      className={css({
        color: "gray.500",
        fontSize: "xs",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      })}
    >
      URL
    </span>
    {url !== "-" ? (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={css({
          color: "green.700",
          textDecoration: "none",
          fontSize: "md",
          fontWeight: 600,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        })}
        title={url}
      >
        {url}
      </a>
    ) : (
      <span className={css({ color: "gray.800", fontSize: "md", fontWeight: 600 })}>-</span>
    )}
  </div>
);

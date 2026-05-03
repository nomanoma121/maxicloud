import { css } from "styled-system/css";

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const LOG_LINES: { time: string; text: string; kind: "info" | "success" | "warn" | "error" }[] = [
  { time: "10:30:01.123", text: "Cloning repository...", kind: "info" },
  { time: "10:30:03.456", text: "Checking out commit...", kind: "info" },
  { time: "10:30:04.012", text: "Runtime detected: Node.js 20", kind: "info" },
  { time: "10:30:05.001", text: "Installing dependencies...", kind: "info" },
  { time: "10:30:45.234", text: "OK 247 packages installed (40s)", kind: "success" },
  { time: "10:30:45.890", text: "warn deprecated package: lodash@3.10.1", kind: "warn" },
  { time: "10:30:46.567", text: "Running build command: npm run build...", kind: "info" },
  { time: "10:30:58.890", text: "OK Build succeeded (12s)", kind: "success" },
  { time: "10:30:59.123", text: "Creating container image...", kind: "info" },
  { time: "10:31:04.456", text: "Pushing image to registry...", kind: "info" },
  { time: "10:31:08.789", text: "Starting deployment...", kind: "info" },
  { time: "10:31:10.012", text: "OK Container started", kind: "success" },
  { time: "10:31:12.345", text: "Health check: GET /health -> 200 OK", kind: "success" },
  { time: "10:31:15.678", text: "OK Deployment successful", kind: "success" },
];

const LOG_COLOR: Record<string, string> = {
  success: "#34AA8E",
  warn: "#b45309",
  error: "#b91c1c",
  info: "#475569",
};

export const BuildLog = () => (
  <div
    className={css({
      border: "1px solid",
      borderColor: "gray.100",
      borderRadius: "md",
      background: "gray.50",
      overflow: "hidden",
      maxHeight: "400px",
      overflowY: "auto",
    })}
  >
    <div className={css({ padding: "3 4" })}>
      {LOG_LINES.map(({ time, text, kind }) => (
        <div key={time} className={css({ display: "flex", gap: 4, lineHeight: "1.85" })}>
          <span
            className={css({
              flexShrink: 0,
              fontSize: "xs",
              color: "gray.400",
              userSelect: "none",
              minWidth: "92px",
            })}
            style={{ fontFamily: MONO }}
          >
            {time}
          </span>
          <span className={css({ fontSize: "xs" })} style={{ color: LOG_COLOR[kind], fontFamily: MONO }}>
            {text}
          </span>
        </div>
      ))}
    </div>
  </div>
);

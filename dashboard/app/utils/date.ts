import type { Timestamp } from "@bufbuild/protobuf/wkt";
import { timestampDate } from "@bufbuild/protobuf/wkt";

const formatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatTimestamp = (timestamp?: Timestamp): string => {
  if (!timestamp) {
    return "-";
  }
  return formatter.format(timestampDate(timestamp));
};

export const formatDuration = (startedAt?: Timestamp, finishedAt?: Timestamp): string => {
  if (!startedAt) {
    return "-";
  }
  if (!finishedAt) {
    return "running";
  }
  const ms = timestampDate(finishedAt).getTime() - timestampDate(startedAt).getTime();
  if (ms < 1000) {
    return "<1s";
  }
  if (ms < 60_000) {
    return `${Math.floor(ms / 1000)}s`;
  }
  if (ms < 3_600_000) {
    return `${Math.floor(ms / 60_000)}m`;
  }
  return `${Math.floor(ms / 3_600_000)}h`;
};

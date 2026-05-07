import type { Timestamp } from "@bufbuild/protobuf/wkt";
import { timestampDate } from "@bufbuild/protobuf/wkt";

const formatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * protobuf Timestamp を `ja-JP` ローカル時刻で整形する。
 *
 * 例: `2024-01-01T12:34:56.789Z` -> `2024/01/01 21:34`
 */
export const formatTimestamp = (timestamp: Timestamp): string => {
  return formatter.format(timestampDate(timestamp));
};

/**
 * 開始・終了時刻の差分を短い duration 文字列へ変換する。
 *
 * 例: `<1s`, `12s`, `4m`, `1h`
 */
export const formatDuration = (startedAt: Timestamp, finishedAt: Timestamp): string => {
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

/**
 * 秒数を人間向け表示へ整形する。
 *
 * 例: `42s`, `3m 10s`, `1h 08m`
 */
export const formatElapsedSeconds = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "-";
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
};

/**
 * Date を `ja-JP` ローカル時刻で整形する。
 */
export const formatDateTime = (date: Date): string => {
  return formatter.format(date);
};

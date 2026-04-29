import { css, cx } from "styled-system/css";
import {
  Activity,
  CheckCircle,
  Clock,
  PauseCircle,
  UserPlus,
  XCircle,
  type Icon,
} from "react-feather";
import type { DeploymentStatus, ApplicationStatus, UserStatus } from "~/types";

type BadgeStatus = ApplicationStatus | DeploymentStatus | UserStatus;

const statusStyle: Record<BadgeStatus, { text: string; icon: string; label: string; glyph: Icon }> = {
  healthy: {
    text: css({ color: "gray.800" }),
    icon: css({ color: "#16a34a" }),
    label: "Healthy",
    glyph: CheckCircle,
  },
  degraded: {
    text: css({ color: "gray.800" }),
    icon: css({ color: "#d97706" }),
    label: "Degraded",
    glyph: Clock,
  },
  unhealthy: {
    text: css({ color: "gray.800" }),
    icon: css({ color: "#dc2626" }),
    label: "Unhealthy",
    glyph: XCircle,
  },
  sleeping: {
    text: css({ color: "gray.800" }),
    icon: css({ color: "#64748b" }),
    label: "Sleeping",
    glyph: PauseCircle,
  },
  running: {
    text: css({ color: "gray.800" }),
    icon: css({ color: "#0284c7" }),
    label: "Running",
    glyph: Activity,
  },
  success: {
    text: css({ color: "gray.800" }),
    icon: css({ color: "#16a34a" }),
    label: "Success",
    glyph: CheckCircle,
  },
  failed: {
    text: css({ color: "gray.800" }),
    icon: css({ color: "#dc2626" }),
    label: "Failed",
    glyph: XCircle,
  },
  active: {
    text: css({ color: "gray.800" }),
    icon: css({ color: "#16a34a" }),
    label: "Active",
    glyph: CheckCircle,
  },
  invited: {
    text: css({ color: "gray.800" }),
    icon: css({ color: "#0284c7" }),
    label: "Invited",
    glyph: UserPlus,
  },
  suspended: {
    text: css({ color: "gray.800" }),
    icon: css({ color: "#dc2626" }),
    label: "Suspended",
    glyph: XCircle,
  },
};

type StatusBadgeProps = {
  status: BadgeStatus;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const item = statusStyle[status];
  const Icon = item.glyph;

  return (
    <span
      className={cx(
        css({
          display: "inline-flex",
          alignItems: "center",
          gap: 2,
          minWidth: "110px",
          fontWeight: 600,
          fontSize: "sm",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }),
        item.text,
      )}
    >
      <Icon size={14} strokeWidth={2.25} className={item.icon} aria-hidden />
      {item.label}
    </span>
  );
};

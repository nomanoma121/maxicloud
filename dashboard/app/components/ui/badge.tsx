import {
	Activity,
	CheckCircle,
	type Icon,
	Loader,
	PauseCircle,
	UserPlus,
	XCircle,
} from "react-feather";
import { css, cx } from "styled-system/css";
import {
	APPLICATION_STATUS,
	DEPLOYMENT_STATUS,
	USER_STATUS,
} from "~/constants";
import type { ApplicationStatus } from "~/repository/application";
import type { DeploymentStatus } from "~/repository/deployment";
import type { UserStatus } from "~/repository/user";

type BadgeStatus = ApplicationStatus | DeploymentStatus | UserStatus;

const statusStyle: Record<
	BadgeStatus,
	{ text: string; icon: string; label: string; glyph: Icon }
> = {
	[APPLICATION_STATUS.RUNNING]: {
		text: css({ color: "gray.800" }),
		icon: css({ color: "#0284c7" }),
		label: "Running",
		glyph: Activity,
	},
	[APPLICATION_STATUS.UNAVAILABLE]: {
		text: css({ color: "gray.800" }),
		icon: css({ color: "#dc2626" }),
		label: "Unavailable",
		glyph: XCircle,
	},
	[APPLICATION_STATUS.STOPPED]: {
		text: css({ color: "gray.800" }),
		icon: css({ color: "#64748b" }),
		label: "Stopped",
		glyph: PauseCircle,
	},
	[DEPLOYMENT_STATUS.SUCCESS]: {
		text: css({ color: "gray.800" }),
		icon: css({ color: "#16a34a" }),
		label: "Success",
		glyph: CheckCircle,
	},
	[DEPLOYMENT_STATUS.IN_PROGRESS]: {
		text: css({ color: "gray.800" }),
		icon: css({ color: "#d29922" }),
		label: "In Progress",
		glyph: Loader,
	},
	[DEPLOYMENT_STATUS.FAILED]: {
		text: css({ color: "gray.800" }),
		icon: css({ color: "#dc2626" }),
		label: "Failed",
		glyph: XCircle,
	},
	[USER_STATUS.ACTIVE]: {
		text: css({ color: "gray.800" }),
		icon: css({ color: "#16a34a" }),
		label: "Active",
		glyph: CheckCircle,
	},
	[USER_STATUS.INVITED]: {
		text: css({ color: "gray.800" }),
		icon: css({ color: "#0284c7" }),
		label: "Invited",
		glyph: UserPlus,
	},
	[USER_STATUS.SUSPENDED]: {
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
	const item =
		statusStyle[status] ?? statusStyle[APPLICATION_STATUS.UNAVAILABLE];
	const Icon = item.glyph;
	const inProgress = status === DEPLOYMENT_STATUS.IN_PROGRESS;

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
			{inProgress ? (
				<span
					aria-hidden
					className={css({
						width: "14px",
						height: "14px",
						borderRadius: "full",
						borderWidth: "3px",
						borderStyle: "solid",
						borderColor: "#d29922",
						borderTopColor: "transparent",
						animation: "spin 1.2s linear infinite",
					})}
				/>
			) : (
				<Icon size={14} strokeWidth={2.25} className={item.icon} aria-hidden />
			)}
			{item.label}
		</span>
	);
};

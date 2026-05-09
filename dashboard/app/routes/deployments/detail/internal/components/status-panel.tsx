import { CheckCircle, Loader, XCircle } from "react-feather";
import { css } from "styled-system/css";
import { DEPLOYMENT_STATUS } from "~/constants";
import type { DeploymentStatus } from "~/repository/deployment";

const DEPLOYMENT_STATUS_META: Record<
	DeploymentStatus,
	{ label: string; color: string; Icon: typeof CheckCircle }
> = {
	[DEPLOYMENT_STATUS.SUCCESS]: {
		label: "Success",
		color: "#34AA8E",
		Icon: CheckCircle,
	},
	[DEPLOYMENT_STATUS.FAILED]: {
		label: "Failed",
		color: "#dc2626",
		Icon: XCircle,
	},
	[DEPLOYMENT_STATUS.IN_PROGRESS]: {
		label: "In Progress",
		color: "#6366f1",
		Icon: Loader,
	},
};

type StatusPanelProps = {
	status: DeploymentStatus;
	duration: string;
	finishedAt: string;
};

export const StatusPanel = ({
	status,
	duration,
	finishedAt,
}: StatusPanelProps) => {
	const statusMeta = DEPLOYMENT_STATUS_META[status];
	const StatusIcon = statusMeta.Icon;
	const inProgress = status === DEPLOYMENT_STATUS.IN_PROGRESS;

	return (
		<div
			className={css({
				display: "grid",
				gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
				gap: 2,
				mdDown: { gridTemplateColumns: "1fr" },
			})}
		>
			<MetricCard label="Status">
				<div
					className={css({
						display: "flex",
						alignItems: "center",
						gap: 1.5,
						fontWeight: 700,
						fontSize: "xl",
						lineHeight: 1.2,
					})}
					style={{ color: statusMeta.color }}
				>
					{inProgress ? (
						<span
							aria-hidden
							className={css({
								width: "20px",
								height: "20px",
								borderRadius: "full",
								borderWidth: "3px",
								borderStyle: "solid",
								borderColor: statusMeta.color,
								borderTopColor: "transparent",
								animation: "spin 1.2s linear infinite",
							})}
						/>
					) : (
						<StatusIcon size={20} aria-hidden />
					)}
					{statusMeta.label}
				</div>
			</MetricCard>

			<MetricCard label="Duration">
				<strong
					className={css({
						fontSize: "xl",
						lineHeight: 1.2,
						color: "gray.900",
					})}
				>
					{duration}
				</strong>
			</MetricCard>

			<MetricCard label="Finished at">
				<strong
					className={css({
						fontSize: "xl",
						lineHeight: 1.2,
						color: "gray.700",
					})}
				>
					{finishedAt}
				</strong>
			</MetricCard>
		</div>
	);
};

const MetricCard = ({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) => (
	<div
		className={css({
			border: "1px solid",
			borderColor: "gray.100",
			borderRadius: "sm",
			background: "gray.50",
			padding: 5,
			display: "grid",
			gap: 1,
		})}
	>
		<span
			className={css({
				color: "gray.500",
				fontSize: "xs",
				textTransform: "uppercase",
				letterSpacing: "0.04em",
			})}
		>
			{label}
		</span>
		{children}
	</div>
);

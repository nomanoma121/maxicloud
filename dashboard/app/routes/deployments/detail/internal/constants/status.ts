import { CheckCircle, Loader, XCircle } from "react-feather";
import { DEPLOYMENT_STATUS } from "~/constants";
import type { DeploymentStatus } from "~/repository/deployment";

export const DEPLOYMENT_STATUS_META = {
  [DEPLOYMENT_STATUS.SUCCESS]: {
    label: "Successful",
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
    color: "#d29922",
    Icon: Loader,
  },
} as const satisfies Record<
  DeploymentStatus,
  { label: string; color: string; Icon: typeof CheckCircle }
>;

import { Activity, CheckCircle, XCircle } from "react-feather";
import type { DeploymentStatus } from "~/types";

export const DEPLOYMENT_STATUS_META = {
  success: {
    label: "Successful",
    color: "#34AA8E",
    Icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    color: "#dc2626",
    Icon: XCircle,
  },
  running: {
    label: "Running",
    color: "#0284c7",
    Icon: Activity,
  },
} as const satisfies Record<
  DeploymentStatus,
  { label: string; color: string; Icon: typeof CheckCircle }
>;

import { CheckCircle, Loader, XCircle } from "react-feather";
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
  in_progress: {
    label: "In Progress",
    color: "#d29922",
    Icon: Loader,
  },
} as const satisfies Record<
  DeploymentStatus,
  { label: string; color: string; Icon: typeof CheckCircle }
>;

import { useEffect, useState } from "react";
import { DeploymentStatus as ProtoDeploymentStatus } from "~/gen/maxicloud/v1/deployment_pb";
import type { DeploymentStatus } from "~/types";
import { connectClient } from "~/utils/connect";

const mapStatus = (status: ProtoDeploymentStatus): DeploymentStatus => {
  switch (status) {
    case ProtoDeploymentStatus.SUCCESS:
      return "success";
    case ProtoDeploymentStatus.FAILED:
      return "failed";
    default:
      return "running";
  }
};

const formatElapsed = (seconds: bigint): string => {
  const s = Number(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
};

type WatchState = {
  status: DeploymentStatus | null;
  duration: string;
  logLines: string[];
};

export const useWatchDeployment = (deploymentId: string) => {
  const [state, setState] = useState<WatchState>({
    status: null,
    duration: "",
    logLines: [],
  });

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      try {
        const stream = connectClient.deployment.watchDeployment(
          { deploymentId },
          { signal: abortController.signal },
        );
        for await (const event of stream) {
          const e = event.event;
          if (e.case === "deploymentStatusChanged") {
            setState((prev) => ({
              ...prev,
              status: mapStatus(e.value.status),
              duration: formatElapsed(e.value.elapsedSeconds),
            }));
          } else if (e.case === "deploymentLogChunk") {
            setState((prev) => ({
              ...prev,
              logLines: [...prev.logLines, ...e.value.lines],
            }));
          }
        }
      } catch (error) {
        // AbortError は正常終了
        if (abortController.signal.aborted) {
          return;
        }
        const message = error instanceof Error ? error.message : "failed to watch deployment stream";
        setState((prev) => ({
          ...prev,
          logLines: [...prev.logLines, `[stream error] ${message}`],
        }));
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [deploymentId]);

  return state;
};

import { useEffect, useState } from "react";
import { timestampDate } from "@bufbuild/protobuf/wkt";
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

type WatchState = {
  status: DeploymentStatus | null;
  elapsedSeconds: number;
  finishedAt?: Date;
  logLines: string[];
};

export const useWatchDeployment = (deploymentId: string) => {
  const [state, setState] = useState<WatchState>({
    status: null,
    elapsedSeconds: 0,
    finishedAt: undefined,
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
              elapsedSeconds: Number(e.value.elapsedSeconds),
              finishedAt: e.value.finishedAt ? timestampDate(e.value.finishedAt) : undefined,
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

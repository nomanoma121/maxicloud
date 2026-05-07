import { useEffect, useMemo, useState } from "react";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import { DeploymentStatus as ProtoDeploymentStatus } from "~/gen/maxicloud/v1/deployment_pb";
import { DEPLOYMENT_STATUS } from "~/constants";
import type { DeploymentStatus } from "~/repository/deployment";
import { formatElapsedSeconds } from "~/utils/date";
import { connectClient } from "~/utils/connect";

const mapStatus = (status: ProtoDeploymentStatus): DeploymentStatus => {
  switch (status) {
    case ProtoDeploymentStatus.SUCCESS:
      return DEPLOYMENT_STATUS.SUCCESS;
    case ProtoDeploymentStatus.IN_PROGRESS:
      return DEPLOYMENT_STATUS.IN_PROGRESS;
    case ProtoDeploymentStatus.FAILED:
      return DEPLOYMENT_STATUS.FAILED;
    default:
      return DEPLOYMENT_STATUS.IN_PROGRESS;
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
  const [nowTick, setNowTick] = useState(0);

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

  useEffect(() => {
    setNowTick(0);
  }, [state.elapsedSeconds, state.status, deploymentId]);

  useEffect(() => {
    if (state.status !== DEPLOYMENT_STATUS.IN_PROGRESS) return;
    const id = window.setInterval(() => setNowTick((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [state.status]);

  const duration = useMemo(() => {
    const currentSeconds = state.status === DEPLOYMENT_STATUS.IN_PROGRESS ? state.elapsedSeconds + nowTick : state.elapsedSeconds;
    return formatElapsedSeconds(currentSeconds);
  }, [state.elapsedSeconds, state.status, nowTick]);

  return { ...state, duration };
};

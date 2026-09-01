"use client";

import { useEffect, useReducer } from "react";
import type { AbstractAgent } from "@ag-ui/client";

/** Re-render when the AG-UI client mutates ``agent`` fields in place. */
export function useAgentRefresh(agent: AbstractAgent | undefined, isReady: boolean) {
  const [, bump] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    if (!isReady || !agent) return;
    const sub = agent.subscribe({
      onStateSnapshotEvent: () => bump(),
      onMessagesSnapshotEvent: () => bump(),
      onRunStartedEvent: () => bump(),
      onRunFinishedEvent: () => bump(),
      onRunFailedEvent: () => bump(),
      onEvent: () => bump(),
    });
    return () => sub.unsubscribe();
  }, [agent, isReady]);
}

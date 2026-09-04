"use client";

import { useEffect, useReducer } from "react";
import type { AbstractAgent } from "@ag-ui/client";

/**
 * Re-render when the AG-UI client mutates ``agent`` fields in place.
 *
 * Only coarse lifecycle events are subscribed here — the AG-UI client emits
 * one event per streamed token, and subscribing to ``onEvent`` would force a
 * React render for every delta. ``useAgent`` already re-renders on state,
 * message and run-status changes; this hook covers the remaining snapshot
 * events (a state snapshot can arrive without a matching ``onStateChanged``).
 */
export function useAgentRefresh(agent: AbstractAgent | undefined, isReady: boolean) {
  const [, bump] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    if (!isReady || !agent) return;
    const sub = agent.subscribe({
      onStateSnapshotEvent: () => bump(),
      onMessagesSnapshotEvent: () => bump(),
      onRunStartedEvent: () => bump(),
      onRunFinishedEvent: () => bump(),
      // The AG-UI subscriber API spells this `onRunFailed` — there is no
      // `onRunFailedEvent`, so the previous name was silently never called.
      onRunFailed: () => bump(),
    });
    return () => sub.unsubscribe();
  }, [agent, isReady]);
}

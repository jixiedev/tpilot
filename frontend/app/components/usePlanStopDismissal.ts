"use client";

import { useEffect, useState } from "react";
import type { AbstractAgent } from "@ag-ui/client";

const patchedAgents = new WeakSet<AbstractAgent>();
const abortListeners = new WeakMap<AbstractAgent, Set<() => void>>();

function patchAbortToDropGates(agent: AbstractAgent): void {
  if (patchedAgents.has(agent)) return;
  patchedAgents.add(agent);
  abortListeners.set(agent, new Set());
  const original = agent.abortRun.bind(agent);
  agent.abortRun = () => {
    agent.pendingInterrupts = [];
    abortListeners.get(agent)?.forEach((notify) => notify());
    original();
  };
}

/**
 * CopilotKit "stop" aborts the HTTP stream. That sets ``isRunning`` false
 * without clearing ``pendingInterrupts``, so a leftover cards/SQL gate must
 * not be treated as a live confirmation.
 */
export function usePlanStopDismissal(
  agent: AbstractAgent | undefined,
  isReady: boolean,
): boolean {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isReady || !agent) return;
    patchAbortToDropGates(agent);

    const onAbort = () => setDismissed(true);
    abortListeners.get(agent)?.add(onAbort);

    const sub = agent.subscribe({
      onRunStartedEvent: () => setDismissed(false),
      onRunFailed: () => {
        agent.pendingInterrupts = [];
        setDismissed(true);
      },
    });
    return () => {
      abortListeners.get(agent)?.delete(onAbort);
      sub.unsubscribe();
    };
  }, [agent, isReady]);

  return dismissed;
}

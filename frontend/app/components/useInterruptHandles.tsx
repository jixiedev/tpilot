"use client";

import { useEffect, useState } from "react";
import type { Interrupt } from "@ag-ui/client";
import { useAgent, useInterrupt } from "@copilotkit/react-core/v2";

export type InterruptHandles = {
  /** The primary open interrupt (legacy interrupts have none). */
  interrupt: Interrupt | null;
  /** Every open standard interrupt. */
  interrupts: Interrupt[];
  resolve: (payload?: unknown, interruptId?: string) => Promise<unknown>;
  cancel: (interruptId?: string) => Promise<unknown>;
};

/**
 * Access the pending interrupt and its resolve/cancel handles *without*
 * rendering through `useInterrupt`'s `render` slot.
 *
 * Why: `useInterrupt` memoizes the element it renders per pending interrupt
 * (deps are `[pending, handlerResult, resolve, cancel]`). Anything rendered
 * through that slot is therefore frozen for the lifetime of the interrupt —
 * it cannot pick up live agent state (the gate dock used to show a stale
 * card selection) and it cannot be hidden again without a new interrupt
 * (the "stop" button used to leave the confirmation dialog on screen).
 *
 * The `handler` option runs inside an effect whenever a new interrupt
 * arrives, which is exactly when the handles change, so we capture them
 * there and render the UI ourselves — that keeps it live.
 */
export function useInterruptHandles(agentId: string): InterruptHandles | null {
  const [handles, setHandles] = useState<InterruptHandles | null>(null);
  const { agent } = useAgent({ agentId });

  useInterrupt({
    agentId,
    renderInChat: false,
    handler: ({ interrupt, interrupts, resolve, cancel }) => {
      setHandles({
        interrupt,
        interrupts,
        resolve: (payload, interruptId) => resolve(payload, interruptId),
        cancel: (interruptId) => cancel(interruptId),
      });
      return null;
    },
    render: () => <></>,
  });

  // The interrupt is answered by starting a new run (or by failing the
  // current one). `pendingInterrupts` is not cleared at that point — only
  // when the next run finishes — so the handles are dropped here instead.
  useEffect(() => {
    if (!agent) return;
    const sub = agent.subscribe({
      onRunStartedEvent: () => setHandles(null),
      onRunFailed: () => setHandles(null),
    });
    return () => sub.unsubscribe();
  }, [agent]);

  return handles;
}

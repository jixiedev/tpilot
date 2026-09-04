"use client";

import { useAgent } from "@copilotkit/react-core/v2";
import {
  selectGateInterrupt,
  type GateKind,
} from "./databotGateUtils";
import { GateHelpPopover } from "./GateHelpPopover";
import { useAgentRefresh } from "./useAgentRefresh";

/**
 * Compact chat notice while a human gate is pending.
 *
 * The gate is detected from the pending interrupt rather than from the
 * agent's ``stage``: the SQL subgraph flips ``stage`` to ``gate_sql`` as soon
 * as the model writes the gate reasons, which is before the gate actually
 * interrupts. Announcing "action required" that early would send the human
 * looking for a decision that is not on the screen yet.
 */
export function DatabotGateChatBanner() {
  const { agent, isReady } = useAgent({ agentId: "databot" });
  useAgentRefresh(isReady ? agent : undefined, isReady);

  const pending = agent?.pendingInterrupts;
  const cardsGate = selectGateInterrupt(pending, "cards");
  const sqlGate = selectGateInterrupt(pending, "sql");
  const gate: GateKind | null = cardsGate ? "cards" : sqlGate ? "sql" : null;

  if (!isReady || !gate) {
    return null;
  }

  return (
    <div className="chat-gate-notice chat-gate-notice--compact" role="status" data-testid="chat-gate-notice">
      <div className="chat-gate-notice-title">
        <span className="chat-gate-notice-kicker">Action required</span>
        {" — "}
        Submit your decision in the <strong>gate panel on the right</strong>.
        <GateHelpPopover gate={gate} className="chat-gate-notice-help" />
      </div>
    </div>
  );
}

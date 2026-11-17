"use client";

import { useAgent } from "@copilotkit/react-core/v2";
import { pendingGateKind } from "./databotGateUtils";
import { GateHelpPopover } from "./GateHelpPopover";
import { useAgentRefresh } from "./useAgentRefresh";
import { DATABOT_AGENT_ID, databotStateOf } from "./databotAgent";

/** Compact chat notice while a human gate is pending. */
export function DatabotGateChatBanner() {
  const { agent, isReady } = useAgent({ agentId: DATABOT_AGENT_ID });
  useAgentRefresh(isReady ? agent : undefined, isReady);

  // `pendingInterrupts` is only cleared when a *later* run finishes
  // successfully, so it stays populated after the user resolves a gate
  // (while the resumed run is going, or if that run errors). Mirror the
  // gate panel: show only for a parseable gate payload, never mid-run,
  // and never once databot is no longer the active subagent.
  const interrupts = agent?.pendingInterrupts ?? [];
  const gateKind =
    !agent?.isRunning && databotStateOf(agent?.state) !== undefined
      ? pendingGateKind(interrupts)
      : null;

  if (!isReady || !gateKind) {
    return null;
  }

  return (
    <div className="chat-gate-notice chat-gate-notice--compact" role="status" data-testid="chat-gate-notice">
      <div className="chat-gate-notice-title">
        <span className="chat-gate-notice-kicker">Action required</span>
        {" — "}
        Submit your decision in the <strong>gate panel on the right</strong>.
        <GateHelpPopover gate={gateKind} className="chat-gate-notice-help" />
      </div>
    </div>
  );
}

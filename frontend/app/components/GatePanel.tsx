"use client";

import { useAgent } from "@copilotkit/react-core/v2";
import type { DatabotAgentState } from "./types";
import { ChartGate, HumanGate } from "./GateDecision";
import { parseGateInterruptMessage } from "./databotGateUtils";
import { useInterruptHandles } from "./useInterruptHandles";

// ---------------------------------------------------------------------------
// GatePanel
// ---------------------------------------------------------------------------
// Renders the human gates that the LangGraph graph pauses at. The graph
// emits AG-UI v2 standard interrupts via the ``RUN_FINISHED`` event
// (the AG-UI server wraps the LangGraph ``interrupt(...)`` payload in
// an ``outcome.type === "interrupt"`` envelope — see
// ``agui_server.py`` for the flags that make this happen).
//
// We read the interrupt handles with ``useInterruptHandles`` instead of
// rendering through ``useInterrupt``'s ``render`` slot: that slot is frozen
// per interrupt, so the gate dock would keep showing the card selection and
// draft SQL from the moment the gate opened — the human's own edits in the
// right-hand panel would never show up in the gate they are approving.
//
// We parse the ``message`` field of each interrupt as a JSON payload
// matching the contract in ``agent/specialists/databot/gates.py``.
// ---------------------------------------------------------------------------

export function GatePanel() {
  const { agent, isReady } = useAgent({ agentId: "databot" });
  const liveState = isReady
    ? ((agent.state as DatabotAgentState | undefined) ?? undefined)
    : undefined;

  const handles = useInterruptHandles("databot");
  if (!handles?.interrupt) return null;

  const { interrupt, resolve, cancel } = handles;
  const value = parseGateInterruptMessage(interrupt.message);
  if (!value) return null;

  if (value.gate === "chart") {
    return (
      <div className="databot-gate-dock" data-testid="databot-gate-dock">
        <ChartGate
          value={value}
          onApprove={() => void resolve({ decision: "approve" })}
          onSkip={() => void resolve("dryrun")}
          onCancel={() => void cancel()}
        />
      </div>
    );
  }

  return (
    <div className="databot-gate-dock" data-testid="databot-gate-dock">
      <HumanGate
        value={value}
        liveSelectedCards={liveState?.review_cards}
        liveDraftSql={liveState?.draft_sql}
        liveSelectionSummary={liveState?.cards_selection_summary}
        onChoose={(decision, comments) => {
          const payload =
            comments.trim().length > 0
              ? { decision, comments: comments.trim() }
              : decision;
          void resolve(payload);
        }}
      />
    </div>
  );
}

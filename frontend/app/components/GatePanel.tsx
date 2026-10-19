"use client";

import { useAgent, useInterrupt } from "@copilotkit/react-core/v2";
import type { DatabotAgentState } from "./types";
import { ChartGate, HumanGate } from "./GateDecision";
import { parseGateInterruptMessage } from "./databotGateUtils";

// ---------------------------------------------------------------------------
// GatePanel
// ---------------------------------------------------------------------------
// Renders the human gates that the LangGraph graph pauses at. The graph
// emits AG-UI v2 standard interrupts via the ``RUN_FINISHED`` event
// (the AG-UI server wraps the LangGraph ``interrupt(...)`` payload in
// an ``outcome.type === "interrupt"`` envelope — see
// ``agui_server.py`` for the flags that make this happen). We mount
// the gate UI off the chat via ``useInterrupt({ renderInChat: false })``
// so it stays in the existing right-column slot; the hook gives us a
// live element whenever the graph is paused and a ``resolve(payload)``
// callback that round-trips a ``ResumeEntry`` back to the AG-UI
// endpoint, which the LangGraph server then turns into a graph
// ``Command(resume=...)`` to unblock the graph.
//
// We parse the ``message`` field of each interrupt as a JSON payload
// matching the contract in ``agent/specialists/databot/gates.py``.
// ---------------------------------------------------------------------------

export function GatePanel() {
  const { agent, isReady } = useAgent({ agentId: "databot" });
  const liveState = isReady
    ? ((agent.state as DatabotAgentState | undefined) ?? undefined)
    : undefined;

  const element = useInterrupt({
    agentId: "databot",
    renderInChat: false,
    render: ({ interrupt, resolve, cancel }) => {
      if (!interrupt) return <></>;
      const value = parseGateInterruptMessage(interrupt.message);
      if (!value) return <></>;
      if (value.gate === "chart") {
        return (
          <div className="databot-gate-dock" data-testid="databot-gate-dock">
            <ChartGate
              value={value}
              onApprove={() => resolve({ decision: "approve" })}
              onSkip={() => resolve("dryrun")}
              onCancel={() => cancel()}
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
              resolve(payload);
            }}
          />
        </div>
      );
    },
  });

  return element;
}

"use client";

import type { GateKind } from "./databotGateUtils";
import { gateUserInstructions } from "./databotGateUtils";

const GATE_NOTE: Partial<Record<GateKind, string>> = {
  cards:
    "Use checkboxes in the Cards tab to refine the model list before you approve.",
  sql: "Edit SQL in the SQL tab, or use Request changes to ask the agent to rewrite.",
};

type GateHelpPopoverProps = {
  gate: GateKind;
  className?: string;
};

/** Compact help trigger; full workflow steps appear on hover or keyboard focus. */
export function GateHelpPopover({ gate, className = "" }: GateHelpPopoverProps) {
  const instructions = gateUserInstructions(gate);
  const note = GATE_NOTE[gate];

  return (
    <span
      className={`gate-help-trigger ${className}`.trim()}
      tabIndex={0}
      aria-label={`How the ${gate} gate works`}
    >
      <span className="gate-help-trigger-icon" aria-hidden>
        ?
      </span>
      <div className="gate-help-popover" role="tooltip">
        <div className="gate-help-popover-title">{instructions.headline}</div>
        <ol className="gate-help-popover-steps">
          {instructions.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {note ? <div className="gate-help-popover-note">{note}</div> : null}
      </div>
    </span>
  );
}

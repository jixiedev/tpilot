/** Shared gate interrupt parsing and user-facing copy. */

export type GateKind = "cards" | "sql" | "chart";

export interface GateInterruptValue {
  question: string;
  options: { id: string; label: string; reason: string }[];
  default: string;
  gate: GateKind;
  review_cards?: unknown[];
  /** Factual committed-model summary (cards gate only). */
  selection_summary?: string;
  /** Full draft SQL (sql gate); Plan modal has no live Databot state. */
  draft_sql?: string;
}

export function parseGateInterruptMessage(message: unknown): GateInterruptValue | null {
  if (message == null) return null;

  let parsed: unknown = message;
  if (typeof message === "string") {
    if (!message.trim()) return null;
    try {
      parsed = JSON.parse(message);
    } catch {
      return null;
    }
  }

  if (
    parsed &&
    typeof parsed === "object" &&
    "question" in parsed &&
    "options" in parsed &&
    "default" in parsed &&
    "gate" in parsed
  ) {
    return parsed as GateInterruptValue;
  }
  return null;
}

export function gateKindFromStage(stage: string | undefined): GateKind | null {
  if (stage === "gate_cards") return "cards";
  if (stage === "gate_sql") return "sql";
  return null;
}

export interface GateUserInstructions {
  headline: string;
  steps: string[];
}

export function gateUserInstructions(
  gate: GateKind,
  surface: "dock" | "dialog" = "dock",
): GateUserInstructions {
  if (surface === "dialog") {
    if (gate === "cards") {
      return {
        headline: "Review Databot's model picks",
        steps: [
          "Check the selected models listed in this dialog.",
          "Approve to continue, Request changes with feedback to redraft, Halt, or Dry-run.",
        ],
      };
    }
    if (gate === "sql") {
      return {
        headline: "Review the drafted SQL",
        steps: [
          "Read the SQL in this dialog.",
          "Approve to run it, Request changes with feedback to rewrite, Halt, or Dry-run.",
        ],
      };
    }
    return {
      headline: "Optional chart",
      steps: [
        "Choose whether to generate a visualization or end the turn with the table results.",
      ],
    };
  }
  if (gate === "cards") {
    return {
      headline: "Review Databot's model picks",
      steps: [
        "Open the Cards tab on the right — check or uncheck models if needed.",
        "Use the gate panel (right column) to Approve, Request changes, Halt, or Dry-run.",
        "Approve locks the selection and continues to SQL drafting.",
      ],
    };
  }
  if (gate === "sql") {
    return {
      headline: "Review the drafted SQL",
      steps: [
        "Open the SQL tab on the right to read or edit the query (Save draft if you fix it yourself).",
        "To ask the agent to rewrite SQL, use Request changes and the feedback box in the gate panel.",
        "Approve runs the query; Halt stops; Dry-run previews without profile writes.",
      ],
    };
  }
  return {
    headline: "Optional chart",
    steps: [
      "Choose whether to generate a visualization or end the turn with the table results.",
    ],
  };
}

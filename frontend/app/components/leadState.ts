// The lead page (`/lead`) talks to the lead agent (`/agui/lead`). Its state:
//
//   { messages, plan, work_record, active_subagent: { name, state, paused? }, ... }
//
// - `plan`: this turn's steps (empty unless the lead planned).
// - `work_record`: every delegation so far, newest last.
// - `active_subagent`: the latest specialist's UI view; `paused` while it waits
//   for the user (the server overlays its live state).
// Keep in sync with `agent/lead/state.py`, `agent/lead/paused.py` and
// `agent/specialists/warehouse/warehouse_agent.py` (`ui_view`).

import type { ExecutionResult } from "./types";

/** CopilotKit / AG-UI agent id; must match `agui_server.LEAD_AGENT` and the runtime route. */
export const LEAD_AGENT_ID = "lead";

export const WAREHOUSE_SUBAGENT = "warehouse";

export type PlanStepStatus = "pending" | "done" | "blocked" | "failed" | "skipped";

export interface PlanStep {
  text: string;
  agent?: string;
  status: PlanStepStatus;
  added?: boolean;
}

export type SubagentStatus = "done" | "failed" | "halted" | "needs_input" | string;

export interface WorkRecordEntry {
  agent: string;
  task: string;
  status: SubagentStatus;
  summary?: string;
  artifacts?: Record<string, unknown>;
  step?: number | null;
  turn?: number;
}

export interface WarehouseTable {
  name: string;
  description?: string;
}

export interface WarehouseSqlReview {
  status?: "approved" | "revise" | "stopped" | string;
  sql?: string;
  explanation?: string;
  tables?: string[];
  comments?: string;
  edited?: boolean;
}

export interface WarehouseExecution {
  sql?: string;
  columns?: string[];
  rows?: Array<Record<string, unknown>>;
  row_count?: number;
  truncated?: boolean;
  error?: string;
}

/** `WarehouseAgent.ui_view`. */
export interface WarehouseView {
  /** Tables the SQL reads (or the review lists). */
  tables?: WarehouseTable[];
  /** Other models the search returned, by name; not used by the SQL. */
  candidates?: string[];
  sql_review?: WarehouseSqlReview;
  execution?: WarehouseExecution;
}

export interface ActiveSubagent {
  name: string;
  state?: Record<string, unknown>;
  paused?: boolean;
}

export interface LeadAgentState {
  plan?: PlanStep[];
  work_record?: WorkRecordEntry[];
  active_subagent?: ActiveSubagent | null;
  turn_index?: number;
  [key: string]: unknown;
}

export function leadStateOf(state: unknown): LeadAgentState {
  return (state ?? {}) as LeadAgentState;
}

/** Warehouse's view when it is the latest specialist, else `undefined`. */
export function warehouseViewOf(state: unknown): WarehouseView | undefined {
  const active = leadStateOf(state).active_subagent;
  if (!active || active.name !== WAREHOUSE_SUBAGENT) return undefined;
  return (active.state ?? {}) as WarehouseView;
}

/** Warehouse result in the shape `ExecutionChart` renders. */
export function asExecutionResult(execution: WarehouseExecution | undefined): ExecutionResult | undefined {
  if (!execution) return undefined;
  return { ...execution, ok: !execution.error };
}

/** The `delegate` tool's JSON result (`SubagentResult.tool_text`), or `null`. */
export interface DelegateResult {
  agent?: string;
  status?: SubagentStatus;
  summary?: string;
  artifacts?: Record<string, unknown>;
}

export function parseDelegateResult(result: unknown): DelegateResult | null {
  if (result && typeof result === "object") return result as DelegateResult;
  if (typeof result !== "string" || !result.trim().startsWith("{")) return null;
  try {
    return JSON.parse(result) as DelegateResult;
  } catch {
    return null;
  }
}

/** Interrupt payload of warehouse's SQL review (`agent/specialists/warehouse/tools.py`). */
export interface SqlReviewInterrupt {
  gate: "warehouse_sql";
  question: string;
  sql: string;
  explanation?: string;
  tables?: string[];
  options: string[];
  default?: string;
}

export function parseSqlReviewInterrupt(message: unknown): SqlReviewInterrupt | null {
  let parsed: unknown = message;
  if (typeof message === "string") {
    try {
      parsed = JSON.parse(message);
    } catch {
      return null;
    }
  }
  if (parsed && typeof parsed === "object" && (parsed as { gate?: unknown }).gate === "warehouse_sql") {
    return parsed as SqlReviewInterrupt;
  }
  return null;
}

/** Display name for a specialist id. */
export function agentLabel(name: string | undefined): string {
  const labels: Record<string, string> = {
    warehouse: "Warehouse",
    knowledge: "Knowledge",
    diagnostic: "Diagnostic",
    data_analysis: "Data analysis",
    swe: "SWE",
  };
  if (!name) return "Specialist";
  return labels[name] ?? name;
}

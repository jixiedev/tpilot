// Shared TypeScript shapes for the Databot v2 frontend.
//
// These mirror the backend Python `DatabotState` TypedDict so the
// frontend can treat state updates from the AG-UI bridge as
// strongly-typed. Keep these in sync with
// `agent/react/databot/state.py` in the backend.

export type DatabotStage =
  | "fetch"
  | "gate_cards"
  | "sql"
  | "gate_sql"
  | "execute"
  | "chart"
  | "done";

export type GateDecision =
  | "approve"
  | "deny-comments"
  | "deny-halt"
  | "dryrun";

export interface GateAuditEntry {
  gate: "cards" | "sql";
  decision: GateDecision;
  comments: string;
  reasons: Record<string, string>;
}

export interface MetricConflict {
  card_name: string;
  metric: string;
  glossary_term: string;
  reason: string;
}

export interface TableCardColumn {
  name: string;
  description?: string;
  data_tests?: string;
  entity?: { type?: string; name?: string; description?: string } | null;
  dimension?: { type?: string; label?: string } | null;
}

export interface TableCardMetric {
  name: string;
  type?: string;
  label?: string;
  description?: string;
  agg?: string;
  expr?: string;
}

export interface TableCard {
  name: string;
  model_type?: "native" | "derived";
  physical_tables?: string[];
  cte?: string;
  agg_time_dimension?: string;
  columns?: TableCardColumn[];
  metrics?: TableCardMetric[];
  owner?: string;
  usage?: string;
  description?: string;
  doclink?: string;
  confidence?: string;
  matched_chunk_type?: string;
  score?: number;
  yml_path?: string;
  sql_path?: string;
}

export interface ExecutionResult {
  ok?: boolean;
  columns?: string[];
  rows?: Array<Record<string, unknown>>;
  row_count?: number;
  truncated?: boolean;
  error?: string;
  sql?: string;
}

export interface DatabotAgentState {
  stage?: DatabotStage;
  candidate_cards?: TableCard[];
  selected_cards?: TableCard[];
  approved_cards?: TableCard[];
  metric_conflicts?: MetricConflict[];
  draft_sql?: string;
  approved_sql?: string;
  sql_validated?: boolean;
  execution_result?: ExecutionResult;
  gate_decisions?: GateAuditEntry[];
  cards_reasons?: Record<string, string>;
  sql_reasons?: Record<string, string>;
  dryrun?: boolean;
  halt_reason?: string;
  chart_requested?: boolean;
  deny_feedback?: string;
}

"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ExecutionResult } from "./types";

// ---------------------------------------------------------------------------
// ExecutionChart
// ---------------------------------------------------------------------------
// Given the `execution_result` from a finished databot turn, infer a
// suitable chart shape and let the user toggle between options.
//
// Heuristic:
//   - 0 rows                -> show a status block (ok/error)
//   - 1 row, 1 number col   -> "scalar" big-number card
//   - 1 col string + 1 col  -> single series (bar/line/pie)
//     number
//   - 1 col time-like +     -> time series (line)
//     1+ numeric cols
//   - 2+ key cols + 1+      -> grouped bar / stacked bar
//     numeric cols
//
// The user can override with a chart-type selector at the top.
// ---------------------------------------------------------------------------

type ChartKind = "bar" | "line" | "pie" | "table";

interface InferredShape {
  kind: ChartKind;
  xKey: string | null;
  yKeys: string[];
  numericKeys: string[];
  categoricalKeys: string[];
  timeKeys: string[];
  scalar: { value: number; label: string } | null;
}

const TIME_HINTS = ["date", "time", "ts", "timestamp", "dt", "month", "day", "year", "_at"];
const COLOR_PALETTE = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#a855f7",
];

function isNumeric(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "number") return Number.isFinite(v);
  if (typeof v === "string") {
    const t = v.trim();
    if (t === "") return false;
    const n = Number(t);
    return Number.isFinite(n);
  }
  return false;
}

function looksLikeTime(name: string, sample: unknown): boolean {
  const lower = name.toLowerCase();
  if (TIME_HINTS.some((h) => lower.includes(h))) return true;
  if (typeof sample === "string") {
    // ISO date or yyyy-mm-dd
    if (/^\d{4}-\d{2}(-\d{2})?(T.*)?$/.test(sample)) return true;
  }
  return false;
}

function inferShape(columns: string[], rows: Array<Record<string, unknown>>): InferredShape {
  const numericKeys: string[] = [];
  const timeKeys: string[] = [];
  const categoricalKeys: string[] = [];
  for (const col of columns) {
    const sample = rows[0]?.[col];
    if (isNumeric(sample)) {
      numericKeys.push(col);
    } else if (looksLikeTime(col, sample)) {
      timeKeys.push(col);
    } else {
      categoricalKeys.push(col);
    }
  }

  // Scalar: single row, single numeric column
  if (rows.length === 1 && numericKeys.length === 1 && columns.length <= 2) {
    const valueRaw = rows[0][numericKeys[0]];
    const value = typeof valueRaw === "number" ? valueRaw : Number(valueRaw);
    return {
      kind: "bar",
      xKey: columns.find((c) => c !== numericKeys[0]) ?? null,
      yKeys: numericKeys,
      numericKeys,
      categoricalKeys,
      timeKeys,
      scalar: { value, label: numericKeys[0] },
    };
  }

  // Time series: time key + ≥1 numeric
  if (timeKeys.length >= 1 && numericKeys.length >= 1) {
    return {
      kind: "line",
      xKey: timeKeys[0],
      yKeys: numericKeys,
      numericKeys,
      categoricalKeys,
      timeKeys,
      scalar: null,
    };
  }

  // Grouped: ≥1 categorical + ≥1 numeric
  if (categoricalKeys.length >= 1 && numericKeys.length >= 1) {
    return {
      kind: "bar",
      xKey: categoricalKeys[0],
      yKeys: numericKeys,
      numericKeys,
      categoricalKeys,
      timeKeys,
      scalar: null,
    };
  }

  // Fallback: table
  return {
    kind: "table",
    xKey: null,
    yKeys: numericKeys,
    numericKeys,
    categoricalKeys,
    timeKeys,
    scalar: null,
  };
}

const CHART_KIND_LABEL: Record<ChartKind, string> = {
  bar: "bar",
  line: "line",
  pie: "pie",
  table: "table",
};

export function ExecutionChart({ result }: { result: ExecutionResult | undefined | null }) {
  const [override, setOverride] = useState<ChartKind | null>(null);

  const shape = useMemo(() => {
    if (!result || !result.columns || !result.rows) return null;
    if (result.rows.length === 0) return null;
    return inferShape(result.columns, result.rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.columns?.join(","), result?.rows?.length, result?.error]);

  if (!result) {
    return <p className="muted">No execution result yet.</p>;
  }

  if (!result.ok) {
    return (
      <div className="exec-error">
        <p>
          <strong>Execution failed</strong>
          {result.sql && (
            <>
              {" "}— <code className="exec-sql">{truncate(result.sql, 120)}</code>
            </>
          )}
        </p>
        {result.error && <pre className="exec-error-msg">{result.error}</pre>}
      </div>
    );
  }

  if (!shape) {
    return <p className="muted">Query returned no rows.</p>;
  }

  if (shape.scalar) {
    return (
      <div className="exec-scalar">
        <p className="exec-scalar-value">{formatNumber(shape.scalar.value)}</p>
        <p className="exec-scalar-label">{shape.scalar.label}</p>
      </div>
    );
  }

  const allowedKinds: ChartKind[] = shape.timeKeys.length
    ? ["line", "bar", "table"]
    : shape.numericKeys.length === 1
    ? ["bar", "line", "pie", "table"]
    : ["bar", "line", "table"];
  const kind: ChartKind = (override && allowedKinds.includes(override) ? override : shape.kind) as ChartKind;

  return (
    <div className="exec-chart">
      <header className="exec-chart-header">
        <span className="muted">
          {result.row_count} row{result.row_count === 1 ? "" : "s"}
          {result.truncated ? " (truncated)" : ""}
        </span>
        <div className="exec-chart-picker" role="tablist">
          {allowedKinds.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={kind === k}
              className={`btn btn-tab ${kind === k ? "active" : ""}`}
              onClick={() => setOverride(k)}
            >
              {CHART_KIND_LABEL[k]}
            </button>
          ))}
        </div>
      </header>
      <div className="exec-chart-body">
        {kind === "bar" && shape.xKey && (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={result.rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey={shape.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {shape.yKeys.map((y, i) => (
                <Bar key={y} dataKey={y} fill={COLOR_PALETTE[i % COLOR_PALETTE.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
        {kind === "line" && shape.xKey && (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={result.rows}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey={shape.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              {shape.yKeys.map((y, i) => (
                <Line
                  key={y}
                  type="monotone"
                  dataKey={y}
                  stroke={COLOR_PALETTE[i % COLOR_PALETTE.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
        {kind === "pie" && shape.xKey && shape.yKeys.length >= 1 && (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={result.rows}
                dataKey={shape.yKeys[0]}
                nameKey={shape.xKey}
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {(result.rows ?? []).map((_, i) => (
                  <Cell key={i} fill={COLOR_PALETTE[i % COLOR_PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
        {kind === "table" && <ResultTable result={result} />}
      </div>
    </div>
  );
}

function ResultTable({ result }: { result: ExecutionResult }) {
  return (
    <div className="result-table-wrap">
      <table className="result-table">
        <thead>
          <tr>
            {result.columns?.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows?.map((row, i) => (
            <tr key={i}>
              {result.columns?.map((c) => (
                <td key={c}>{formatCell(row[c])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCell(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "number") return formatNumber(v);
  return String(v);
}

function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(2) + "K";
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toFixed(2);
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

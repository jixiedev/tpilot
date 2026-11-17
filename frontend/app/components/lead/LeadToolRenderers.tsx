"use client";

import { useDefaultRenderTool, useRenderTool } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { ToolCallCard } from "../ToolCallCard";
import {
  agentLabel,
  parseDelegateResult,
  type PlanStep,
} from "../leadState";
import { asList, formatToolResult, sqlPreview, truncate } from "../toolRenderUtils";
import { StatusPill } from "./StatusPill";

type Status = "inProgress" | "executing" | "complete";

function DelegateCard({
  status,
  agent,
  task,
  step,
  result,
}: {
  status: Status;
  agent?: string;
  task?: string;
  step?: number;
  result?: unknown;
}) {
  const parsed = status === "complete" ? parseDelegateResult(result) : null;
  const subtitle = [step ? `Step ${step}` : "", truncate(task ?? "", 140)].filter(Boolean).join(" · ");
  return (
    <ToolCallCard
      title={`Delegated to ${agentLabel(agent)}`}
      subtitle={subtitle || undefined}
      status={status}
      variant="default"
    >
      {status !== "complete" ? (
        <p className="tool-call-muted">{agentLabel(agent)} is working on it…</p>
      ) : parsed ? (
        <div className="lead-delegate-result">
          <StatusPill status={String(parsed.status ?? "done")} />
          {parsed.summary ? <p className="lead-delegate-summary">{truncate(parsed.summary, 1200)}</p> : null}
        </div>
      ) : (
        <pre className="tool-call-pre">{truncate(formatToolResult(result), 800)}</pre>
      )}
    </ToolCallCard>
  );
}

/** Tool cards for the lead page: delegation, plan, and warehouse's review and query. */
export function LeadToolRenderers() {
  useDefaultRenderTool();

  useRenderTool({
    name: "delegate",
    parameters: z.object({
      agent: z.string().optional(),
      task: z.string().optional(),
      step: z.number().optional(),
    }),
    render: ({ status, parameters, result }) => (
      <DelegateCard
        status={status}
        agent={parameters.agent}
        task={parameters.task}
        step={parameters.step}
        result={result}
      />
    ),
  });

  useRenderTool({
    name: "write_plan",
    parameters: z.object({ steps: z.any().optional() }),
    render: ({ status, parameters }) => {
      const steps = asList(parameters.steps).filter(
        (s): s is PlanStep => typeof s === "object" && s !== null && "text" in s,
      );
      return (
        <ToolCallCard
          title="Plan updated"
          subtitle={steps.length ? `${steps.length} step(s)` : "Writing the plan"}
          status={status}
          variant="default"
        >
          {steps.length ? (
            <ol className="lead-plan-inline">
              {steps.map((step, i) => (
                <li key={`${i}-${step.text}`}>
                  {step.text}
                  {step.agent ? <span className="lead-plan-agent"> · {agentLabel(step.agent)}</span> : null}
                </li>
              ))}
            </ol>
          ) : null}
        </ToolCallCard>
      );
    },
  });

  useRenderTool({
    name: "request_sql_approval",
    parameters: z.object({
      sql: z.string().optional(),
      explanation: z.string().optional(),
    }),
    render: ({ status, parameters, result }) => {
      const text = status === "complete" ? formatToolResult(result) : "";
      const outcome = text.startsWith("Approved")
        ? "Approved"
        : text.includes("asked for changes")
          ? "Changes requested"
          : text.includes("stopped")
            ? "Stopped"
            : text.startsWith("Not sent")
              ? "Not sent"
              : "";
      return (
        <ToolCallCard
          title="SQL review"
          subtitle={outcome || (status === "complete" ? "Reviewed" : "Waiting for your review")}
          status={status}
          variant="sql"
        >
          {parameters.sql ? <pre className="tool-call-pre">{sqlPreview(parameters.sql, 600)}</pre> : null}
          {outcome && outcome !== "Approved" ? (
            <p className="tool-call-muted">{truncate(text, 300)}</p>
          ) : null}
        </ToolCallCard>
      );
    },
  });

  useRenderTool({
    name: "run_sql",
    parameters: z.object({ sql: z.string().optional() }),
    render: ({ status, parameters, result }) => {
      const text = status === "complete" ? formatToolResult(result) : "";
      let subtitle = status === "complete" ? "Done" : "Running the approved query";
      if (text.startsWith("Not run")) subtitle = "Refused: not approved";
      else if (text.startsWith("SQL failed")) subtitle = "Query failed";
      else if (text.startsWith("{")) {
        try {
          const parsed = JSON.parse(text.split("\n")[0]) as { row_count?: number };
          subtitle = `${parsed.row_count ?? 0} row(s) — see Results`;
        } catch {
          /* keep default */
        }
      }
      return (
        <ToolCallCard
          title="Query"
          subtitle={subtitle}
          status={status}
          variant={subtitle.startsWith("Query failed") || subtitle.startsWith("Refused") ? "warning" : "sql"}
        >
          {parameters.sql ? <pre className="tool-call-pre">{sqlPreview(parameters.sql, 400)}</pre> : null}
          {text.startsWith("SQL failed") || text.startsWith("Not run") ? (
            <p className="tool-call-warning-text">{truncate(text, 400)}</p>
          ) : null}
        </ToolCallCard>
      );
    },
  });

  return null;
}

"use client";

import {
  useDefaultRenderTool,
  useRenderTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import { ToolCallCard } from "./ToolCallCard";
import { formatToolResult, isToolErrorText, truncate } from "./toolRenderUtils";

function stepLines(steps: unknown): string[] {
  if (!Array.isArray(steps)) return [];
  return steps.map((step) => String(step ?? "").trim()).filter(Boolean);
}

/**
 * Registers CopilotKit tool-call UI for Plan orchestration tools.
 * Without these, tool calls fall into "View in Inspector (local only)".
 */
export function PlanToolRenderers() {
  useDefaultRenderTool();

  useRenderTool({
    name: "create_plan",
    parameters: z.object({
      plan_id: z.string().optional(),
      title: z.string().optional(),
      steps: z.array(z.string()).optional(),
    }),
    render: ({ status, parameters, result }) => {
      const steps = stepLines(parameters.steps);
      const resultText = formatToolResult(result);
      return (
        <ToolCallCard
          title="Create plan"
          subtitle={
            parameters.title?.trim() ||
            parameters.plan_id?.trim() ||
            "Breaking down the task"
          }
          status={status}
          variant="answer"
        >
          {status !== "complete" ? (
            <p className="tool-call-muted">Drafting plan steps…</p>
          ) : steps.length > 0 ? (
            <ol className="tool-call-step-list">
              {steps.map((step, index) => (
                <li key={`${index}-${step.slice(0, 40)}`}>{truncate(step, 200)}</li>
              ))}
            </ol>
          ) : isToolErrorText(resultText) ? (
            <p className="tool-call-warning-text">{truncate(resultText, 400)}</p>
          ) : (
            <pre className="tool-call-pre">{truncate(resultText, 600)}</pre>
          )}
        </ToolCallCard>
      );
    },
  });

  useRenderTool({
    name: "planning",
    parameters: z.object({
      command: z.string().optional(),
      plan_id: z.string().optional(),
      step_index: z.number().optional(),
      step_status: z.string().optional(),
      title: z.string().optional(),
      steps: z.array(z.string()).optional(),
    }),
    render: ({ status, parameters, result }) => {
      const command = (parameters.command ?? "get").trim().toLowerCase();
      const resultText = formatToolResult(result);
      const subtitle =
        command === "mark_step"
          ? `Step ${parameters.step_index ?? "?"} → ${parameters.step_status ?? "…"}`
          : command === "update"
            ? "Updating plan"
            : command === "create"
              ? "Creating plan"
              : command === "list"
                ? "Listing plans"
                : `Plan · ${command}`;

      return (
        <ToolCallCard
          title="Planning"
          subtitle={subtitle}
          status={status}
          variant="default"
        >
          {status !== "complete" ? (
            <p className="tool-call-muted">Running planning command…</p>
          ) : isToolErrorText(resultText) ? (
            <p className="tool-call-warning-text">{truncate(resultText, 400)}</p>
          ) : (
            <pre className="tool-call-pre">{truncate(resultText, 700)}</pre>
          )}
        </ToolCallCard>
      );
    },
  });

  useRenderTool({
    name: "invoke_agent",
    parameters: z.object({
      agent_name: z.string().optional(),
      task: z.string().optional(),
    }),
    render: ({ status, parameters, result }) => {
      const agent = (parameters.agent_name ?? "specialist").trim().toLowerCase();
      const task = (parameters.task ?? "").trim();
      const resultText = formatToolResult(result);
      return (
        <ToolCallCard
          title={`Delegate · ${agent}`}
          subtitle={task ? truncate(task, 120) : "Running specialist"}
          status={status}
          variant="answer"
        >
          {status !== "complete" ? (
            <p className="tool-call-muted">Waiting for specialist output…</p>
          ) : isToolErrorText(resultText) ? (
            <p className="tool-call-warning-text">{truncate(resultText, 400)}</p>
          ) : (
            <pre className="tool-call-pre">{truncate(resultText, 900)}</pre>
          )}
        </ToolCallCard>
      );
    },
  });

  return null;
}

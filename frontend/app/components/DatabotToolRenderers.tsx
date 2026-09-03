"use client";

import {
  useDefaultRenderTool,
  useRenderTool,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import { ToolCallCard } from "./ToolCallCard";
import { DatabotAssistantReply } from "./DatabotAssistantReply";
import {
  cardNamesFromUnknown,
  formatToolResult,
  isToolErrorText,
  parseFetchRelatedModelsResult,
  parseGlossaryResult,
  sqlPreview,
  truncate,
} from "./toolRenderUtils";

function GlossaryToolCard({
  title,
  status,
  query,
  result,
}: {
  title: string;
  status: "inProgress" | "executing" | "complete";
  query?: string;
  result?: unknown;
}) {
  const parsed = status === "complete" ? parseGlossaryResult(result) : null;
  const resultText = formatToolResult(result);
  const subtitle = parsed?.query || query || "Glossary lookup";

  return (
    <ToolCallCard
      title={title}
      subtitle={truncate(subtitle, 120)}
      status={status}
      variant="glossary"
    >
      {status !== "complete" ? (
        <p className="tool-call-muted">Looking up metric definitions…</p>
      ) : parsed ? (
        parsed.names.length > 0 ? (
          <ul className="tool-call-chip-list">
            {parsed.names.map((name) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p className="tool-call-muted">
            No glossary terms matched (total {parsed.total}). Try GMV, revenue, or
            commission_revenue.
          </p>
        )
      ) : isToolErrorText(resultText) ? (
        <p className="tool-call-warning-text">{truncate(resultText, 400)}</p>
      ) : (
        <pre className="tool-call-pre">{truncate(resultText, 600)}</pre>
      )}
    </ToolCallCard>
  );
}

/**
 * Registers CopilotKit tool-call UI: custom cards for Databot pipeline
 * tools, plus the built-in default card for everything else.
 */
function CommitCardsToolRender({
  status,
  parameters,
  result,
}: {
  status: "inProgress" | "executing" | "complete";
  parameters: { selections?: unknown[] };
  result?: unknown;
}) {
  const selections = parameters.selections ?? [];
  const lines = selections
    .filter((s): s is Record<string, unknown> => typeof s === "object" && s !== null)
    .map((s) => {
      const sid = String(s.staging_id ?? s.card_id ?? s.id ?? "?");
      const dims = Array.isArray(s.selected_dimensions)
        ? s.selected_dimensions.join(", ")
        : "";
      const metrics = Array.isArray(s.selected_metrics)
        ? s.selected_metrics.join(", ")
        : "";
      return { sid, dims, metrics };
    });
  return (
    <ToolCallCard
      title="Models for review"
      subtitle={
        lines.length > 0
          ? `${lines.length} model(s) shortlisted`
          : "Shortlisting models"
      }
      status={status}
      variant="cards"
    >
      {status === "complete" && lines.length > 0 ? (
        <ul className="tool-call-selection-list">
          {lines.map((line) => (
            <li key={line.sid}>
              <code>{line.sid}</code>
              {line.metrics && (
                <span className="tool-call-pick">
                  metrics: <code>{line.metrics}</code>
                </span>
              )}
              {line.dims && (
                <span className="tool-call-pick">
                  dims: <code>{line.dims}</code>
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : status !== "complete" ? (
        <p className="tool-call-muted">Staging → committed_cards…</p>
      ) : (
        <p className="tool-call-muted">{formatToolResult(result)}</p>
      )}
    </ToolCallCard>
  );
}

export function DatabotToolRenderers() {
  useDefaultRenderTool();

  useRenderTool({
    name: "chat_completion",
    parameters: z.object({ reply: z.string().optional() }),
    render: ({ status, parameters, result }) => {
      const reply =
        parameters.reply ||
        (status === "complete" ? formatToolResult(result) : "");
      if (status !== "complete" || !reply) {
        return (
          <p className="tool-call-muted databot-reply-pending">Composing reply…</p>
        );
      }
      return <DatabotAssistantReply content={reply} />;
    },
  });

  useRenderTool({
    name: "fetch_related_models",
    parameters: z.object({
      query: z.string().optional(),
      limit: z.number().optional(),
    }),
    render: ({ status, parameters, result }) => {
      const parsed =
        status === "complete" ? parseFetchRelatedModelsResult(result) : null;
      const fallbackNames = cardNamesFromUnknown(result);
      const names = parsed?.names.length ? parsed.names : fallbackNames;
      const count = parsed?.count ?? names.length;
      const resultText = formatToolResult(result);
      const errored = status === "complete" && isToolErrorText(resultText);
      return (
        <ToolCallCard
          title="Semantic search"
          subtitle={parameters.query ? truncate(parameters.query, 100) : undefined}
          status={status}
          variant="cards"
        >
          {status !== "complete" ? (
            <p className="tool-call-muted">Searching indexed models…</p>
          ) : errored ? (
            <p className="tool-call-warning-text">
              {truncate(resultText, 400)}
              <br />
              <span className="tool-call-hint">
                Check Qdrant at localhost:6333 and wait for the embedding model to
                finish loading on first call.
              </span>
            </p>
          ) : count > 0 || names.length > 0 ? (
            <>
              <p className="tool-call-muted">
                Found {count} model{count === 1 ? "" : "s"} — see Cards panel for
                columns and metrics.
              </p>
              <ul className="tool-call-chip-list">
                {names.map((name) => (
                  <li key={name}>
                    <code>{name}</code>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="tool-call-muted">No matching dbt models in the index.</p>
          )}
        </ToolCallCard>
      );
    },
  });

  const commitCardsParams = z.object({
    selections: z.array(z.unknown()).optional(),
  });

  useRenderTool({
    name: "commit_cards",
    parameters: commitCardsParams,
    render: ({ status, parameters, result }) => (
      <CommitCardsToolRender
        status={status}
        parameters={parameters}
        result={result}
      />
    ),
  });

  useRenderTool({
    name: "commit_candidate_cards",
    parameters: commitCardsParams,
    render: ({ status, parameters, result }) => (
      <CommitCardsToolRender
        status={status}
        parameters={parameters}
        result={result}
      />
    ),
  });

  useRenderTool({
    name: "add_card_to_state",
    parameters: commitCardsParams,
    render: ({ status, parameters, result }) => (
      <CommitCardsToolRender
        status={status}
        parameters={parameters}
        result={result}
      />
    ),
  });

  useRenderTool({
    name: "mark_cards_selected",
    parameters: z.object({ cards: z.array(z.unknown()).optional() }),
    render: ({ status, parameters, result }) => {
      const names = cardNamesFromUnknown(parameters.cards);
      return (
        <ToolCallCard
          title="Selection for review"
          subtitle={
            names.length > 0
              ? `${names.length} model(s) for the cards gate`
              : "Finalizing selection"
          }
          status={status}
          variant="cards"
        >
          {status === "complete" ? (
            names.length > 0 ? (
              <ul className="tool-call-chip-list">
                {names.map((name) => (
                  <li key={name}>
                    <code>{name}</code>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tool-call-muted">
                {formatToolResult(result) || "Empty selection — check the gate panel."}
              </p>
            )
          ) : (
            <p className="tool-call-muted">Committing selected cards…</p>
          )}
        </ToolCallCard>
      );
    },
  });

  useRenderTool({
    name: "write_gate_reasons",
    parameters: z.object({
      gate: z.enum(["cards", "sql"]).optional(),
      reasons: z.array(z.string()).optional(),
    }),
    render: ({ status, parameters, result }) => {
      const gate = parameters.gate ?? "cards";
      const count = parameters.reasons?.filter((r) => r?.trim()).length ?? 0;
      return (
        <ToolCallCard
          title="Gate reasons"
          subtitle={`${gate} gate · ${count || "…"} option(s)`}
          status={status}
          variant="gate"
        >
          {status === "complete" ? (
            <>
              <p className="tool-call-hint">
                Open the gate panel on the right to approve or request changes.
              </p>
              {parameters.reasons && parameters.reasons.length > 0 ? (
                <ul className="tool-call-reason-list">
                  {parameters.reasons.map((reason, index) => (
                    <li key={`${index}-${reason.slice(0, 24)}`}>
                      {truncate(reason, 160)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="tool-call-muted">{formatToolResult(result)}</p>
              )}
            </>
          ) : (
            <p className="tool-call-muted">Writing gate option reasons…</p>
          )}
        </ToolCallCard>
      );
    },
  });

  useRenderTool({
    name: "propose_sql",
    parameters: z.object({
      sql: z.string().optional(),
      validated: z.boolean().optional(),
    }),
    render: ({ status, parameters, result }) => (
      <ToolCallCard
        title="SQL draft"
        subtitle={
          parameters.validated
            ? "Validated via EXPLAIN"
            : "Draft — validation pending"
        }
        status={status}
        variant="sql"
      >
        {status === "complete" ? (
          parameters.sql ? (
            <pre className="tool-call-sql">{sqlPreview(parameters.sql, 900)}</pre>
          ) : (
            <p className="tool-call-muted">{formatToolResult(result)}</p>
          )
        ) : (
          <p className="tool-call-muted">Committing SQL draft…</p>
        )}
      </ToolCallCard>
    ),
  });

  useRenderTool({
    name: "trino_explain",
    parameters: z.object({ sql: z.string().optional() }),
    render: ({ status, parameters, result }) => {
      const resultText = formatToolResult(result);
      const ok =
        /"ok"\s*:\s*true/i.test(resultText) ||
        /\bok=True\b/i.test(resultText) ||
        /parse.*ok/i.test(resultText);
      return (
        <ToolCallCard
          title="SQL validation"
          subtitle={parameters.sql ? sqlPreview(parameters.sql, 80) : "EXPLAIN check"}
          status={status}
          variant="sql"
        >
          {status === "complete" ? (
            <p
              className={
                ok ? "tool-call-badge tool-call-badge--ok" : "tool-call-badge tool-call-badge--warn"
              }
            >
              {ok ? "Plan validated" : "Check EXPLAIN output"}
            </p>
          ) : (
            <p className="tool-call-muted">Running EXPLAIN…</p>
          )}
        </ToolCallCard>
      );
    },
  });

  useRenderTool({
    name: "record_metric_conflict",
    parameters: z.object({
      card_name: z.string().optional(),
      metric: z.string().optional(),
      glossary_term: z.string().optional(),
      reason: z.string().optional(),
    }),
    render: ({ status, parameters }) => (
      <ToolCallCard
        title="Metric conflict"
        subtitle={
          parameters.metric && parameters.glossary_term
            ? `${parameters.metric} vs ${parameters.glossary_term}`
            : "Glossary disagreement"
        }
        status={status}
        variant="warning"
      >
        {status === "complete" ? (
          <p className="tool-call-warning-text">
            {parameters.reason
              ? truncate(parameters.reason, 280)
              : `Flagged on ${parameters.card_name ?? "card"}.`}
          </p>
        ) : (
          <p className="tool-call-muted">Recording conflict…</p>
        )}
      </ToolCallCard>
    ),
  });

  const glossaryRender = ({
    status,
    parameters,
    result,
    title,
  }: {
    status: "inProgress" | "executing" | "complete";
    parameters: { query?: string; q?: string };
    result?: unknown;
    title: string;
  }) => (
    <GlossaryToolCard
      title={title}
      status={status}
      query={parameters.query ?? parameters.q}
      result={result}
    />
  );

  useRenderTool({
    name: "search",
    parameters: z.object({ query: z.string().optional() }),
    render: ({ status, parameters, result }) =>
      glossaryRender({ status, parameters, result, title: "DataHub search" }),
  });

  useRenderTool({
    name: "get_entities",
    parameters: z.object({ query: z.string().optional() }),
    render: ({ status, parameters, result }) =>
      glossaryRender({ status, parameters, result, title: "DataHub entities" }),
  });

  useRenderTool({
    name: "datahub_list_glossary_terms",
    parameters: z.object({ query: z.string().optional() }),
    render: ({ status, parameters, result }) =>
      glossaryRender({ status, parameters, result, title: "Glossary terms" }),
  });

  useRenderTool({
    name: "datahub_graphql_query",
    parameters: z.object({ query: z.string().optional() }),
    render: ({ status, parameters, result }) => {
      const resultText = formatToolResult(result);
      return (
        <ToolCallCard
          title="DataHub GraphQL"
          subtitle={
            parameters.query ? sqlPreview(parameters.query, 100) : "Ad-hoc query"
          }
          status={status}
          variant="glossary"
        >
          {status !== "complete" ? (
            <p className="tool-call-muted">Querying DataHub…</p>
          ) : isToolErrorText(resultText) ? (
            <p className="tool-call-warning-text">{truncate(resultText, 400)}</p>
          ) : (
            <pre className="tool-call-pre">{truncate(resultText, 700)}</pre>
          )}
        </ToolCallCard>
      );
    },
  });

  return null;
}

"use client";

import { useCallback, useState } from "react";
import type { AbstractAgent } from "@ag-ui/client";
import { buildResumeArray } from "@ag-ui/client";
import type { DatabotAgentState } from "./types";

type UiAction =
  | {
      action: "update_card_selection";
      selected_card_names: string[];
    }
  | {
      action: "propose_sql";
      sql: string;
      validated?: boolean;
    }
  | {
      action: "request_sql_regenerate";
      feedback: string;
    };

interface ActionResponse {
  ok?: boolean;
  state?: Partial<DatabotAgentState>;
  error?: string;
  detail?: string;
}

async function postUiAction(
  threadId: string,
  payload: UiAction,
): Promise<ActionResponse> {
  const response = await fetch("/api/databot/actions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ thread_id: threadId, ...payload }),
  });

  const data = (await response.json()) as ActionResponse & { detail?: string };
  if (!response.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : typeof data.error === "string"
          ? data.error
          : `request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
}

function mergeAgentState(
  agent: AbstractAgent,
  patch: Partial<DatabotAgentState> | undefined,
) {
  if (!patch) return;
  const current = (agent.state ?? {}) as Record<string, unknown>;
  agent.setState({ ...current, ...patch });
}

export function useDatabotActions(agent: AbstractAgent | undefined, isReady: boolean) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runPatch = useCallback(
    async (payload: UiAction) => {
      if (!agent || !isReady) {
        throw new Error("agent not ready");
      }
      const threadId = agent.threadId;
      if (!threadId) {
        throw new Error("no active thread");
      }

      setIsPending(true);
      setError(null);
      try {
        const result = await postUiAction(threadId, payload);
        mergeAgentState(agent, result.state);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [agent, isReady],
  );

  const updateCardSelection = useCallback(
    async (selectedNames: string[]) => {
      await runPatch({
        action: "update_card_selection",
        selected_card_names: selectedNames,
      });
    },
    [runPatch],
  );

  const saveSqlDraft = useCallback(
    async (sql: string) => {
      await runPatch({
        action: "propose_sql",
        sql,
        validated: false,
      });
    },
    [runPatch],
  );

  const regenerateSql = useCallback(
    async (feedback: string) => {
      if (!agent || !isReady) {
        throw new Error("agent not ready");
      }

      const stage = (agent.state as DatabotAgentState | undefined)?.stage;
      const interrupts = agent.pendingInterrupts ?? [];

      if (stage === "gate_sql" && interrupts.length > 0) {
        setIsPending(true);
        setError(null);
        try {
          const responses: Record<
            string,
            { status: "resolved"; payload: { decision: string; comments: string } }
          > = {};
          for (const interrupt of interrupts) {
            const id = interrupt.id;
            if (!id) continue;
            responses[id] = {
              status: "resolved",
              payload: { decision: "deny-comments", comments: feedback },
            };
          }
          const resume = buildResumeArray(interrupts, responses);
          await agent.runAgent({ resume });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          setError(message);
          throw err;
        } finally {
          setIsPending(false);
        }
        return;
      }

      await runPatch({
        action: "request_sql_regenerate",
        feedback,
      });

      if (!agent.isRunning) {
        setIsPending(true);
        try {
          await agent.runAgent({});
        } finally {
          setIsPending(false);
        }
      }
    },
    [agent, isReady, runPatch],
  );

  return {
    updateCardSelection,
    saveSqlDraft,
    regenerateSql,
    isPending,
    error,
    clearError: () => setError(null),
  };
}

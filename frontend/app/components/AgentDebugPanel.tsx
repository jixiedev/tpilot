"use client";

import { useEffect, useState } from "react";
import { useAgent } from "@copilotkit/react-core/v2";

/**
 * AgentDebugPanel — minimal observability surface for the CopilotKit ↔
 * AG-UI ↔ LangGraph wiring (path B).
 *
 * Goal: confirm the "View in Inspector (local only)" regression is gone
 * by showing, in the main panel, the values that the runtime/AG-UI
 * client actually receives:
 *
 *   - ``agent.messages`` — full chat transcript (this is the
 *     ``MESSAGES_SNAPSHOT`` the AG-UI server emits and that CopilotKit
 *     was previously failing to surface).
 *   - ``agent.state.tools`` — server-registered tool list. Pre-path-B
 *     this was empty on the frontend, which is why tool calls were
 *     dropped into the "View in Inspector" bucket. After path B it
 *     should be populated.
 *   - ``agent.pendingInterrupts`` — human-gate interrupts (the existing
 *     ``GatePanel`` reads the same field).
 *   - ``agent.isRunning`` — coarse liveness signal.
 *
 * Pure read-only. Render it next to the existing ``GatePanel`` /
 * ``CopilotSidebar``; it is intentionally low-noise so it does not
 * distract from the chat during normal use.
 */
export function AgentDebugPanel() {
  const { agent, isReady } = useAgent({ agentId: "databot" });

  // ``agent`` is a class instance whose fields are mutated in place by
  // the AG-UI client when ``STATE_SNAPSHOT`` / ``MESSAGES_SNAPSHOT``
  // events arrive. React won't re-render on plain field mutation, so
  // we subscribe to the agent and bump a tick counter on every event.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!isReady) return;
    const sub = agent.subscribe({
      onStateSnapshotEvent: () => setTick((t) => t + 1),
      onMessagesSnapshotEvent: () => setTick((t) => t + 1),
      onToolCallStartEvent: () => setTick((t) => t + 1),
      onToolCallEndEvent: () => setTick((t) => t + 1),
      onToolCallResultEvent: () => setTick((t) => t + 1),
      onRunStartedEvent: () => setTick((t) => t + 1),
      onRunFinishedEvent: () => setTick((t) => t + 1),
      onEvent: () => setTick((t) => t + 1),
    });
    return () => sub.unsubscribe();
  }, [agent, isReady]);

  if (!isReady) {
    return (
      <aside className="agent-debug-panel" data-testid="agent-debug-panel">
        <header className="agent-debug-header">
          <h3>Agent debug</h3>
          <span className="agent-debug-status agent-debug-status--offline">
            not ready
          </span>
        </header>
        <p className="agent-debug-empty">Waiting for runtime sync…</p>
      </aside>
    );
  }

  const messages = agent.messages ?? [];
  const recentMessages = messages.slice(-10);
  const recentMessageOffset = messages.length - recentMessages.length;
  const state = (agent.state ?? {}) as Record<string, unknown>;
  const tools = (state.tools as Array<{ name: string; description?: string }> | undefined) ?? [];
  const pending = (agent as unknown as {
    pendingInterrupts?: Array<{ id?: string; reason?: string }>;
  }).pendingInterrupts ?? [];
  const threadId = agent.threadId;

  return (
    <aside className="agent-debug-panel" data-testid="agent-debug-panel">
      <header className="agent-debug-header">
        <h3>Agent debug</h3>
        <span
          className={
            "agent-debug-status " +
            (agent.isRunning
              ? "agent-debug-status--running"
              : "agent-debug-status--idle")
          }
        >
          {agent.isRunning ? "running" : "idle"}
        </span>
      </header>

      <dl className="agent-debug-grid">
        <dt>thread</dt>
        <dd className="agent-debug-mono">{threadId || "—"}</dd>
        <dt>messages</dt>
        <dd>{messages.length}</dd>
        <dt>tools (in state)</dt>
        <dd data-testid="agent-debug-toolcount">{tools.length}</dd>
        <dt>pending interrupts</dt>
        <dd data-testid="agent-debug-interruptcount">{pending.length}</dd>
      </dl>

      {tools.length > 0 && (
        <details className="agent-debug-section">
          <summary>tools ({tools.length})</summary>
          <ul className="agent-debug-tools">
            {tools.map((t) => (
              <li key={t.name}>
                <code className="agent-debug-mono">{t.name}</code>
                {t.description && (
                  <span className="agent-debug-tool-desc">{t.description}</span>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}

      {messages.length > 0 && (
        <details className="agent-debug-section" open>
          <summary>messages ({messages.length})</summary>
          <ol className="agent-debug-messages">
            {recentMessages.map((m, i) => (
              <li
                key={`${recentMessageOffset + i}:${m.role}:${m.id}`}
                className={`agent-debug-message agent-debug-message--${m.role}`}
              >
                <span className="agent-debug-message-role">{m.role}</span>
                <span className="agent-debug-message-id agent-debug-mono">{m.id}</span>
              </li>
            ))}
            {messages.length > 10 && (
              <li className="agent-debug-message agent-debug-message--more">
                … {messages.length - 10} earlier
              </li>
            )}
          </ol>
        </details>
      )}

      {pending.length > 0 && (
        <details className="agent-debug-section" open>
          <summary>pending interrupts ({pending.length})</summary>
          <ul className="agent-debug-interrupts">
            {pending.map((intr, idx) => (
              <li key={intr.id ?? idx}>
                <code className="agent-debug-mono">{intr.id ?? "?"}</code>
                {intr.reason && (
                  <span className="agent-debug-interrupt-reason">{intr.reason}</span>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="agent-debug-footnote">
        ticks: <span className="agent-debug-mono">{tick}</span>
      </p>
    </aside>
  );
}

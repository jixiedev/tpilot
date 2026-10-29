"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Interrupt } from "@ag-ui/client";
import { useAgent } from "@copilotkit/react-core/v2";
import { ChartGate, HumanGate } from "./GateDecision";
import {
  parseGateInterruptMessage,
  selectPlanGateInterrupt,
  isPlanReplayInterrupt,
  type PlanInterruptLike,
} from "./databotGateUtils";
import { useAgentRefresh } from "./useAgentRefresh";
import { useInterruptHandles } from "./useInterruptHandles";
import { useModalFocus } from "./useModalFocus";
import { usePlanInterruptUi } from "./PlanInterruptUiContext";
import { usePlanStopDismissal } from "./usePlanStopDismissal";

function genericQuestion(interrupt: PlanInterruptLike): string {
  const gate = parseGateInterruptMessage(interrupt.message);
  if (gate?.question.trim()) return gate.question.trim();
  if (typeof interrupt.message === "string" && interrupt.message.trim()) {
    const text = interrupt.message.trim();
    if (text[0] === "{" || text[0] === "[") {
      try {
        const parsed = JSON.parse(text) as { question?: unknown };
        if (typeof parsed.question === "string" && parsed.question.trim()) {
          return parsed.question.trim();
        }
      } catch {
        // plain text
      }
    }
    return text;
  }
  const reason = interrupt.reason?.trim();
  return reason || "Please choose how to continue.";
}

function GenericInterruptForm({
  question,
  onSubmit,
  onCancel,
}: {
  question: string;
  onSubmit: (reply: string) => void;
  onCancel: () => void;
}) {
  const [reply, setReply] = useState("");
  return (
    <div className="gate-panel" data-testid="plan-generic-interrupt">
      <header className="gate-hero">
        <div className="gate-hero-icon" aria-hidden>
          ?
        </div>
        <div className="gate-hero-text">
          <span className="tag tag-gate">confirm</span>
          <h3 className="gate-title">Specialist needs a decision</h3>
          <p className="gate-subtitle">{question}</p>
        </div>
      </header>
      <label className="gate-comments-label">
        <span className="gate-comments-heading">Your reply</span>
        <textarea
          className="gate-comments"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={3}
          placeholder="Type a reply, then continue"
        />
      </label>
      <div className="gate-options gate-options--pair">
        <button
          type="button"
          className="gate-option gate-option--approve"
          onClick={() => onSubmit(reply.trim() || "approve")}
        >
          <span className="gate-option-label">Continue</span>
        </button>
        <button type="button" className="btn btn-ghost gate-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function pickRenderableInterrupt(
  interrupt: Interrupt | PlanInterruptLike | null | undefined,
  interrupts: Array<Interrupt | PlanInterruptLike> | undefined,
): PlanInterruptLike | null {
  const fromList = selectPlanGateInterrupt(interrupts);
  if (fromList) return fromList;
  if (!interrupt || isPlanReplayInterrupt(interrupt)) return null;
  return interrupt;
}

export function PlanInterruptDialog() {
  const { agent, isReady } = useAgent({ agentId: "plan" });
  useAgentRefresh(isReady ? agent : undefined, isReady);
  const stopDismissed = usePlanStopDismissal(isReady ? agent : undefined, isReady);
  const { dismissed, dismiss, reopen } = usePlanInterruptUi();

  // A fresh run means a fresh gate — bring the dialog back up.
  useEffect(() => {
    if (!isReady || !agent) return;
    const sub = agent.subscribe({
      onRunStartedEvent: () => reopen(),
    });
    return () => sub.unsubscribe();
  }, [agent, isReady, reopen]);

  const handles = useInterruptHandles("plan");
  const modalRef = useRef<HTMLDivElement>(null);
  const onEscape = useCallback(() => dismiss(), [dismiss]);

  const selected = pickRenderableInterrupt(
    handles?.interrupt,
    handles?.interrupts,
  );
  const modalOpen = Boolean(selected) && !stopDismissed && !dismissed;

  // Trap focus only while the dialog is actually on screen.
  useModalFocus(modalRef, modalOpen, onEscape);

  if (!modalOpen || !selected || !handles) return null;

  const { resolve, cancel } = handles;
  const value = parseGateInterruptMessage(selected.message);
  let body: ReactNode;
  if (value?.gate === "chart") {
    body = (
      <ChartGate
        value={value}
        onApprove={() => void resolve({ decision: "approve" }, selected.id)}
        onSkip={() => void resolve("dryrun", selected.id)}
        onCancel={() => void cancel(selected.id)}
      />
    );
  } else if (value) {
    body = (
      <HumanGate
        value={value}
        surface="dialog"
        onChoose={(decision, comments) => {
          const payload =
            comments.trim().length > 0
              ? { decision, comments: comments.trim() }
              : decision;
          void resolve(payload, selected.id);
        }}
      />
    );
  } else {
    body = (
      <GenericInterruptForm
        question={genericQuestion(selected)}
        onSubmit={(reply) => void resolve(reply, selected.id)}
        onCancel={() => void cancel(selected.id)}
      />
    );
  }

  return (
    <div
      className="plan-interrupt-backdrop"
      data-testid="plan-interrupt-dialog"
      role="presentation"
    >
      <div
        ref={modalRef}
        className="plan-interrupt-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Specialist confirmation"
        tabIndex={-1}
      >
        {body}
      </div>
    </div>
  );
}

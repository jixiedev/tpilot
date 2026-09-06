"use client";

import { useState, type ReactNode } from "react";
import { useInterrupt } from "@copilotkit/react-core/v2";
import { ChartGate, HumanGate } from "./GateDecision";
import { parseGateInterruptMessage } from "./databotGateUtils";

function genericQuestion(interrupt: {
  reason?: string;
  message?: unknown;
}): string {
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

export function PlanInterruptDialog() {
  const element = useInterrupt({
    agentId: "plan",
    renderInChat: false,
    render: ({ interrupt, resolve, cancel }) => {
      if (!interrupt) return <></>;
      const value = parseGateInterruptMessage(interrupt.message);
      let body: ReactNode;
      if (value?.gate === "chart") {
        body = (
          <ChartGate
            value={value}
            onApprove={() => resolve({ decision: "approve" })}
            onSkip={() => resolve("dryrun")}
            onCancel={() => cancel()}
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
              resolve(payload);
            }}
          />
        );
      } else {
        body = (
          <GenericInterruptForm
            question={genericQuestion(interrupt)}
            onSubmit={(reply) => resolve(reply)}
            onCancel={() => cancel()}
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
            className="plan-interrupt-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Specialist confirmation"
          >
            {body}
          </div>
        </div>
      );
    },
  });

  return element;
}

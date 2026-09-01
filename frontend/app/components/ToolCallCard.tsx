"use client";

import type { ReactNode } from "react";
import type { ToolRenderStatus } from "./toolRenderUtils";

export type ToolCallVariant =
  | "default"
  | "cards"
  | "sql"
  | "gate"
  | "answer"
  | "warning"
  | "glossary";

interface ToolCallCardProps {
  title: string;
  subtitle?: string;
  status: ToolRenderStatus;
  variant?: ToolCallVariant;
  children?: ReactNode;
}

function statusLabel(status: ToolRenderStatus): string {
  if (status === "inProgress") return "Preparing";
  if (status === "executing") return "Running";
  return "Done";
}

export function ToolCallCard({
  title,
  subtitle,
  status,
  variant = "default",
  children,
}: ToolCallCardProps) {
  return (
    <div
      className={`tool-call-card tool-call-card--${variant} tool-call-card--${status}`}
      data-status={status}
    >
      <div className="tool-call-card-header">
        <div className="tool-call-card-titles">
          <span className="tool-call-card-title">{title}</span>
          {subtitle ? (
            <span className="tool-call-card-subtitle">{subtitle}</span>
          ) : null}
        </div>
        <span className={`tool-call-status tool-call-status--${status}`}>
          {statusLabel(status)}
        </span>
      </div>
      {children ? <div className="tool-call-card-body">{children}</div> : null}
    </div>
  );
}

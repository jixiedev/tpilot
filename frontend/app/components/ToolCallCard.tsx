"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ToolRenderStatus } from "./toolRenderUtils";

export type ToolCallVariant =
  | "default"
  | "cards"
  | "sql"
  | "gate"
  | "answer"
  | "warning"
  | "glossary";

/** Cards the user must read or act on stay open after the tool completes. */
const STAY_OPEN_VARIANTS: ReadonlySet<ToolCallVariant> = new Set(["gate", "answer", "warning"]);

interface ToolCallCardProps {
  title: string;
  subtitle?: string;
  status: ToolRenderStatus;
  variant?: ToolCallVariant;
  /** Override the default: open while running, folded when done (except gate/answer/warning). */
  defaultOpen?: boolean;
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
  defaultOpen,
  children,
}: ToolCallCardProps) {
  const autoOpen =
    defaultOpen ?? (status !== "complete" || STAY_OPEN_VARIANTS.has(variant));
  const [open, setOpen] = useState(autoOpen);
  const userToggled = useRef(false);

  useEffect(() => {
    if (!userToggled.current) setOpen(autoOpen);
  }, [autoOpen]);

  const foldable = Boolean(children);

  return (
    <div
      className={`tool-call-card tool-call-card--${variant} tool-call-card--${status}${
        open ? "" : " tool-call-card--folded"
      }`}
      data-status={status}
    >
      <button
        type="button"
        className="tool-call-card-header"
        aria-expanded={foldable ? open : undefined}
        disabled={!foldable}
        onClick={() => {
          userToggled.current = true;
          setOpen((prev) => !prev);
        }}
      >
        {foldable ? <span className="fold-chevron" aria-hidden="true" /> : null}
        <div className="tool-call-card-titles">
          <span className="tool-call-card-title">{title}</span>
          {subtitle ? (
            <span className="tool-call-card-subtitle">{subtitle}</span>
          ) : null}
        </div>
        <span className={`tool-call-status tool-call-status--${status}`}>
          {statusLabel(status)}
        </span>
      </button>
      {children && open ? <div className="tool-call-card-body">{children}</div> : null}
    </div>
  );
}

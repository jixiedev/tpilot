"use client";

const LABELS: Record<string, string> = {
  pending: "Pending",
  done: "Done",
  failed: "Failed",
  halted: "Stopped",
  blocked: "Blocked",
  skipped: "Skipped",
  needs_input: "Needs input",
  running: "Running",
  paused: "Waiting for you",
};

/** Small status chip shared by the plan, work record and delegate cards. */
export function StatusPill({ status }: { status: string }) {
  const key = (status || "pending").toLowerCase();
  return (
    <span className={`lead-pill lead-pill--${key}`} data-status={key}>
      {LABELS[key] ?? key}
    </span>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface FoldSectionProps {
  label: string;
  /** Kept open while true (e.g. still streaming); folds once it turns false. */
  active?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Collapsible chat row for secondary text (model thinking, planning narration).
 * Opens while `active`, folds when it ends, and remembers a manual toggle.
 */
export function FoldSection({ label, active = false, className, children }: FoldSectionProps) {
  const [open, setOpen] = useState(active);
  const userToggled = useRef(false);

  useEffect(() => {
    if (!userToggled.current) setOpen(active);
  }, [active]);

  return (
    <div className={`fold-section${open ? " fold-section--open" : ""} ${className ?? ""}`}>
      <button
        type="button"
        className="fold-section-header"
        aria-expanded={open}
        onClick={() => {
          userToggled.current = true;
          setOpen((prev) => !prev);
        }}
      >
        <span className="fold-chevron" aria-hidden="true" />
        <span>{label}</span>
      </button>
      {open ? <div className="fold-section-body">{children}</div> : null}
    </div>
  );
}

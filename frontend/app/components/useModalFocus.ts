"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Trap keyboard focus inside a modal overlay.
 *
 * The overlay is declared `aria-modal`, so assistive tech treats everything
 * outside it as inert — the DOM has to agree, otherwise Tab still walks
 * into the chat input that sits behind the dialog.
 *
 * Escape is routed to `onEscape` (kept in a ref so the effect is not
 * re-bound on every render, which would steal focus mid-typing).
 */
export function useModalFocus(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void,
) {
  const escapeRef = useRef(onEscape);

  // Keep the latest callback reachable from the keydown listener without
  // re-binding the listener (and re-stealing focus) on every render.
  useEffect(() => {
    escapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.getClientRects().length > 0,
      );

    // Move focus inside the dialog — prefer the first control, fall back to
    // the container (which the caller marks as focusable via tabIndex={-1}).
    const first = focusables()[0];
    (first ?? container).focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        escapeRef.current?.();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (!items.length) {
        event.preventDefault();
        container.focus();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === firstItem || current === container)) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && current === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      // Give focus back to whatever opened the dialog.
      previouslyFocused?.focus?.();
    };
  }, [ref, active]);
}

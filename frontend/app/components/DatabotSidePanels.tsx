"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AgentDebugPanel } from "./AgentDebugPanel";
import { DatabotArtifactPanel } from "./DatabotArtifactPanel";

const DEBUG_WIDTH_MIN = 200;
const DEBUG_WIDTH_MAX = 480;
const DEBUG_WIDTH_DEFAULT = 280;

type DatabotSidePanelsProps = {
  debugEnabled: boolean;
};

export function DatabotSidePanels({ debugEnabled }: DatabotSidePanelsProps) {
  const [debugWidth, setDebugWidth] = useState(DEBUG_WIDTH_DEFAULT);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDividerPointerDown = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onDividerPointerMove = useCallback((event: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const next = event.clientX - rect.left;
    setDebugWidth(Math.min(DEBUG_WIDTH_MAX, Math.max(DEBUG_WIDTH_MIN, next)));
  }, []);

  const onDividerPointerUp = useCallback((event: React.PointerEvent) => {
    dragging.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  useEffect(() => {
    if (!debugEnabled) dragging.current = false;
  }, [debugEnabled]);

  return (
    <div
      ref={containerRef}
      className={
        "databot-side-panels" + (debugEnabled ? " databot-side-panels--debug-on" : "")
      }
      data-testid="databot-side-panels"
    >
      {debugEnabled && (
        <>
          <div
            className="databot-side-debug"
            style={{ width: debugWidth, flex: `0 0 ${debugWidth}px` }}
          >
            <AgentDebugPanel />
          </div>
          <div
            className="databot-resize-handle"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize debug panel"
            onPointerDown={onDividerPointerDown}
            onPointerMove={onDividerPointerMove}
            onPointerUp={onDividerPointerUp}
            onPointerCancel={onDividerPointerUp}
          />
        </>
      )}
      <div className="databot-side-artifact">
        <DatabotArtifactPanel />
      </div>
    </div>
  );
}

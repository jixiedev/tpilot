import { useId, type ReactNode, type SVGProps } from "react";

/**
 * TahoePilot icon set: hand-drawn 24px stroke icons (currentColor) plus the
 * brand mark and the per-agent badges. No icon dependency.
 */

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number | string };

function Icon({ size = 16, strokeWidth = 1.8, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------ agents */

/** Lead: a compass — it finds the way and points work at a specialist. */
export const CompassIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.8 8.2 13.6 13.6 8.2 15.8 10.4 10.4Z" fill="currentColor" fillOpacity="0.18" />
    <path d="M12 3v1.6M12 19.4V21M3 12h1.6M19.4 12H21" />
  </Icon>
);

/** Databot: a database with a spark — retrieval with a bot in front. */
export const DatabotIcon = (p: IconProps) => (
  <Icon {...p}>
    <ellipse cx="10.5" cy="6" rx="6.5" ry="2.5" />
    <path d="M4 6v6c0 1.38 2.9 2.5 6.5 2.5 1 0 1.95-.09 2.8-.25" />
    <path d="M4 12v6c0 1.38 2.9 2.5 6.5 2.5 1.2 0 2.33-.12 3.3-.34" />
    <path d="M17 6v3" />
    <path d="M18.5 12.5l.75 2.1 2.1.75-2.1.75-.75 2.1-.75-2.1-2.1-.75 2.1-.75Z" fill="currentColor" />
  </Icon>
);

export const WarehouseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 20V9.3L12 4l9 5.3V20" />
    <path d="M7 20v-7.5h10V20" />
    <path d="M7 16.2h10M2 20h20" />
  </Icon>
);

export const KnowledgeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 6.6C10.4 5.1 7.9 4.5 4 4.5v13c3.9 0 6.4.6 8 2.1 1.6-1.5 4.1-2.1 8-2.1v-13c-3.9 0-6.4.6-8 2.1Z" />
    <path d="M12 6.6v13" />
  </Icon>
);

export const DiagnosticIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 12.5h3.5l2.2-5.5 4.1 11 2.4-5.5H21" />
  </Icon>
);

export const AnalysisIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 4v16h16" />
    <path d="M8 16v-3M12 16V9.5M16 16v-5" />
    <path d="M7.5 9.5 11 6.5l3 2 4.5-4" />
  </Icon>
);

export const CodeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m8.5 7.5-4.5 4.5 4.5 4.5M15.5 7.5l4.5 4.5-4.5 4.5M13.6 5l-3.2 14" />
  </Icon>
);

export const SlidersIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h8.5M16.5 7H20M4 17h3.5M11.5 17H20" />
    <circle cx="14.5" cy="7" r="2" />
    <circle cx="9.5" cy="17" r="2" />
  </Icon>
);

/* ---------------------------------------------------------- workspace */

export const PlanIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 6.5h10M10 12h10M10 17.5h10" />
    <path d="m3.8 6.5 1.4 1.4L7.8 5.3" />
    <path d="m3.8 12 1.4 1.4L7.8 10.8" />
    <circle cx="5.6" cy="17.5" r="1.3" />
  </Icon>
);

export const SparkleIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10.5 3.5 12.3 8.7 17.5 10.5 12.3 12.3 10.5 17.5 8.7 12.3 3.5 10.5 8.7 8.7Z" />
    <path d="m18.5 15 .7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7Z" />
  </Icon>
);

export const HistoryIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.6 12a8.4 8.4 0 1 0 2.5-6" />
    <path d="M3.6 4.4V8.2h3.8" />
    <path d="M12 7.6V12l3 1.9" />
  </Icon>
);

export const ShieldCheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3 5 5.8v5.4c0 4.3 2.9 7.8 7 9.3 4.1-1.5 7-5 7-9.3V5.8Z" />
    <path d="m9 12 2.1 2.1L15.2 10" />
  </Icon>
);

export const TableIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M3.5 9.5h17M9.5 9.5v10" />
  </Icon>
);

/* -------------------------------------------------------------- chrome */

export const SunIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </Icon>
);

export const MoonIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 14.6A8.2 8.2 0 0 1 9.4 4 8.2 8.2 0 1 0 20 14.6Z" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 12.5 4.2 4.2L19 7" />
  </Icon>
);

export const LogOutIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 4h3.5A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5H14" />
    <path d="M10 8l-4 4 4 4M6 12h9" />
  </Icon>
);

export const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.5 20c1.2-3.6 4-5.2 7.5-5.2s6.3 1.6 7.5 5.2" />
  </Icon>
);

export const LockIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Icon>
);

export const BugIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="7" y="8" width="10" height="12" rx="5" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8M12 12v8M3.5 13H7M17 13h3.5M4.5 8.5 7.3 10M19.5 8.5 16.7 10M4.5 18.5 7.4 17M19.5 18.5 16.6 17" />
  </Icon>
);

/* ------------------------------------------------------- agent lookup */

type IconComponent = (p: IconProps) => React.JSX.Element;

const AGENT_ICONS: Record<string, IconComponent> = {
  lead: CompassIcon,
  databot: DatabotIcon,
  warehouse: WarehouseIcon,
  knowledge: KnowledgeIcon,
  diagnostic: DiagnosticIcon,
  data_analysis: AnalysisIcon,
  swe: CodeIcon,
  model_selection: SlidersIcon,
};

/** Icon for an agent id (`warehouse`, `data_analysis`, ...); sparkle when unknown. */
export function AgentIcon({ name, ...rest }: IconProps & { name?: string }) {
  const Component = (name && AGENT_ICONS[name]) || SparkleIcon;
  return <Component {...rest} />;
}

/* --------------------------------------------------------- brand marks */

/**
 * TahoePilot mark: a faceted peak over lake ripples under a guiding star,
 * on a teal → indigo tile. Same drawing as `app/icon.svg`.
 */
export function TahoeMark({ size = 34, className }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={["brand-mark", className].filter(Boolean).join(" ")}
    >
      <TahoeMarkArt id={id} />
    </svg>
  );
}

function TahoeMarkArt({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#14b8a6" />
          <stop offset="0.55" stopColor="#2f6bf0" />
          <stop offset="1" stopColor="#5b3df5" />
        </linearGradient>
        <linearGradient id={`${id}-glow`} x1="16" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${id}-bg)`} />
      <rect width="32" height="16" rx="9" fill={`url(#${id}-glow)`} />
      <path d="M4.5 21.5 11.5 12.5l4.2 5.4" fill="#fff" fillOpacity="0.5" />
      <path d="M9.5 21.5 18.5 8.5l9 13Z" fill="#fff" />
      <path d="M18.5 8.5 27.5 21.5h-7.3Z" fill="#c7d7ff" />
      <path d="M6 24.6c1.6-1 3.2-1 4.8 0s3.2 1 4.8 0 3.2-1 4.8 0 3.2 1 4.8 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M10.5 27.6c1.4-.8 2.8-.8 4.2 0s2.8.8 4.2 0" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M8 5.2 8.75 7.25 10.8 8 8.75 8.75 8 10.8 7.25 8.75 5.2 8 7.25 7.25Z" fill="#fff" />
    </>
  );
}

/** Gradient tile with an agent's icon, used for the lead and databot brands. */
export function AgentBadge({
  agent,
  size = 34,
  className,
}: {
  agent: "lead" | "databot";
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={["agent-badge", `agent-badge--${agent}`, className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <AgentIcon name={agent} size={Math.round(size * 0.56)} strokeWidth={2} />
    </span>
  );
}

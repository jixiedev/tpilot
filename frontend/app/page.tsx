import Link from "next/link";
import { AgentBadge, AgentIcon, ArrowRightIcon, CheckIcon, TahoeMark } from "./components/icons";

const AGENTS = [
  {
    href: "/lead",
    id: "lead" as const,
    name: "Lead",
    title: "Ask TahoePilot",
    text: "One conversation for everything: the lead answers, asks when something is unclear, plans multi-step work and hands it to specialists. Data questions go to Warehouse, and you review every query before it runs.",
    points: ["Plans only when needed", "Live plan, specialist work and results", "SQL review in the chat"],
  },
  {
    href: "/databot",
    id: "databot" as const,
    name: "Databot",
    title: "Staged data retrieval",
    text: "The guided data pipeline: Databot proposes table cards for you to approve, drafts SQL for you to approve, runs it and explains the result.",
    points: ["Review and edit table cards", "Edit SQL before it runs", "Results table and chart"],
  },
];

const SPECIALISTS = [
  { id: "warehouse", name: "Warehouse" },
  { id: "knowledge", name: "Knowledge" },
  { id: "diagnostic", name: "Diagnostic" },
  { id: "data_analysis", name: "Data analysis" },
  { id: "swe", name: "SWE" },
];

export default function Home() {
  return (
    <main className="landing">
      <header className="landing-hero">
        <TahoeMark size={64} className="landing-hero-mark" />
        <h1>
          Tahoe<span>Pilot</span>
        </h1>
        <p>Your co-pilot for data, metrics, pipelines and code. Pick an agent — each has its own page and its own conversations.</p>
      </header>
      <div className="landing-grid">
        {AGENTS.map((agent) => (
          <Link key={agent.href} href={agent.href} className={`landing-card landing-card--${agent.id}`}>
            <span className="landing-card-top">
              <AgentBadge agent={agent.id} size={44} />
              <span className="landing-name">{agent.name}</span>
            </span>
            <span className="landing-title">{agent.title}</span>
            <span className="landing-text">{agent.text}</span>
            <ul className="landing-points">
              {agent.points.map((p) => (
                <li key={p}>
                  <CheckIcon size={14} strokeWidth={2.4} />
                  {p}
                </li>
              ))}
            </ul>
            <span className="landing-go">
              Open {agent.name} <ArrowRightIcon size={15} strokeWidth={2.2} />
            </span>
          </Link>
        ))}
      </div>
      <footer className="landing-crew" aria-label="Lead specialists">
        <span className="landing-crew-label">The lead&rsquo;s crew</span>
        <ul>
          {SPECIALISTS.map((s) => (
            <li key={s.id} className={`agent-chip agent-chip--${s.id}`}>
              <AgentIcon name={s.id} size={14} />
              {s.name}
            </li>
          ))}
        </ul>
      </footer>
    </main>
  );
}

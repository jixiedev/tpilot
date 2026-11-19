import Link from "next/link";

const AGENTS = [
  {
    href: "/lead",
    mark: "TP",
    name: "Lead",
    title: "Ask TahoePilot",
    text: "One conversation for everything: the lead answers, asks when something is unclear, plans multi-step work and hands it to specialists. Data questions go to Warehouse, and you review every query before it runs.",
    points: ["Plans only when needed", "Live plan, specialist work and results", "SQL review in the chat"],
    tone: "lead",
  },
  {
    href: "/databot",
    mark: "DB",
    name: "Databot",
    title: "Staged data retrieval",
    text: "The guided data pipeline: Databot proposes table cards for you to approve, drafts SQL for you to approve, runs it and explains the result.",
    points: ["Review and edit table cards", "Edit SQL before it runs", "Results table and chart"],
    tone: "databot",
  },
];

export default function Home() {
  return (
    <main className="landing">
      <header className="landing-head">
        <span className="lead-logo" aria-hidden="true">
          TP
        </span>
        <div>
          <h1>TahoePilot</h1>
          <p>Pick an agent. Each has its own page and its own conversations.</p>
        </div>
      </header>
      <div className="landing-grid">
        {AGENTS.map((agent) => (
          <Link key={agent.href} href={agent.href} className={`landing-card landing-card--${agent.tone}`}>
            <span className="landing-mark" aria-hidden="true">
              {agent.mark}
            </span>
            <span className="landing-name">{agent.name}</span>
            <span className="landing-title">{agent.title}</span>
            <span className="landing-text">{agent.text}</span>
            <ul className="landing-points">
              {agent.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <span className="landing-go">Open {agent.name} →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

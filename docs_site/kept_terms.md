# Reader-page writing rules

The published site is for data-team users, not for engineers. These rules decide what a
page may contain. The test suite enforces the same rules, so this file is the single source
of truth for both writers and tests.

## Never

- Python module names, or any path ending in `.py`.
- Source snippets in any language.
- Configuration keys, import statements, function or class internals.
- Inline spans shaped like code: `snake_case`, `CamelCase`, dotted or parenthesised calls.
  The exception is the kept-terms list below.
- Tables whose content is a file layout.
- Links that point at files on GitHub. A link goes to another page of this site, or to an
  external site a reader would actually want (product documentation, a status page).
  Never to a source file.
- The code-change log. It lives in the repository, not here.

## Always

- Describe components as classes and objects in plain language:

  > The agent catalog is a class that holds every agent the platform can create. It is
  > assembled once at startup, so asking it for an agent is cheap.

  Not: "the `AgentCatalog` class in `agent/catalog.py`".

- Keep product and system names: LangGraph, LangChain, Trino, Hive, S3, DataHub, Qdrant,
  Jira, Kubernetes, Airflow, MCP, SQLite, AG-UI, CopilotKit.
- Keep agent names as product concepts: intent, plan, databot, knowledge, diagnostic,
  data_analysis, swe.
- Keep capabilities, workflows, limits, guardrails and the human approval points.
- Keep operational instructions: how to install, how to start, how to ask a question, which
  switches exist, where configuration lives. Prefer the packaged command `tahoepilot` over
  a module path.

## Kept-terms list

These identifiers are allowed to stay because they are product concepts rather than code.

| Kind | Terms |
|---|---|
| Agents | `intent`, `plan`, `databot`, `knowledge`, `diagnostic`, `data_analysis`, `swe` |
| Products | `LangGraph`, `LangChain`, `Trino`, `Hive`, `S3`, `DataHub`, `Qdrant`, `Jira`, `Kubernetes`, `Airflow`, `MCP`, `SQLite`, `AG-UI`, `CopilotKit`, `Next.js`, `FastAPI`, `ReAct`, `TahoePilot` |
| Interface | `tahoepilot`, `AG-UI` |

Anything not on this list is rewritten into plain language.

## Voice

- Second person, present tense, short sentences. "Ask a question. A specialist answers."
- Lead with what the reader gets, then how it works.
- No hedging, no marketing adjectives the product has not earned.
- Headings say what the section answers, not what it contains.

## Diagrams

A diagram is a model of the system, not a list of boxes. Draw each element with the
shape that matches its role — see the notation table in `docs_site/README.md` — and
organise the drawing into bands with `c.layer(...)`.

A diagram is referenced as raw HTML so the theme CSS applies:

```html
<figure class="tp-diagram">
  <img src="assets/diagrams/system.svg" alt="How a request reaches an agent">
  <figcaption>Both clients reach the same agent catalog.</figcaption>
</figure>
```

Diagram labels are reader-facing. The generator rewrites code-shaped labels, so
`cli.py` never reaches the page.

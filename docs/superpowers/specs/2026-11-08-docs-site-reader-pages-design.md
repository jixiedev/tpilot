# Docs site reader pages — design

**Date**: 2026-11-08
**Status**: awaiting review
**Supersedes**: the reader-filter design of the same date; the site is now built from
hand-written reader pages instead of being filtered out of the repository READMEs.

## Context

The site at `jixiedev.github.io/tpilot/` is assembled at build time from the repository's
READMEs (`docs_site/assembler.py`). Those sources are written for engineers: they name
Python modules, show source snippets, and use config keys as vocabulary.

Measured over the 13 published sources: 364 `.py` mentions, 61 fenced code blocks and 5342
inline code spans. The page published as *Optimization log* is a 110 KB record of code
changes.

The people reading the site are data-team users. They want to know what the platform does,
what it can reach, and how a question flows. They do not read code.

## Goal

The published site contains no implementation detail: no module files, no source snippets,
no config keys, no identifiers used as code. Components are described as classes and
objects in plain language.

## Decisions

| Decision | Choice |
|---|---|
| Platform source code | Untouched. `agent/`, `tools/`, `config/`, `memory/`, `rag/`, `evals/`, `frontend/` are not modified. |
| Docs-site tooling | May change: `docs_site/*.py`, `mkdocs.yml`, `docs_site/requirements.txt`, `tests/`, `.github/workflows/`. |
| Site content | Hand-written reader pages. The site no longer sources the repository READMEs. |
| Old assembly tooling | `assembler.py` and `gen_pages.py` are deleted. `diagrams.py` stays. |
| Optimization log | Not published. |
| Built-in tool reference | Keep the full table (52 rows), drop the file column, humanize tool names. |
| Install / getting-started | Kept. Commands and configuration locations are operational instructions, not implementation detail. |

## Architecture

The site becomes a plain MkDocs site: static markdown in the docs directory, no build-time
content generation.

```
docs_site/pages/                 hand-written reader pages (markdown, the whole content)
docs_site/pages/assets/diagrams/ generated SVG diagrams, committed as static files
docs_site/pages/stylesheets/     theme CSS
docs_site/overrides/home.html    landing page template
mkdocs.yml                       nav + theme; no plugin that generates content
```

`mkdocs.yml` loses the `gen-files` plugin. MkDocs publishes the markdown in the docs
directory as it is.

### Diagrams

`docs_site/diagrams.py` keeps rendering the HUD-style SVG, and gains:

- a **reader label map**, so a diagram shows `terminal` instead of `cli.py`,
  `agents` instead of `agent/`, `local storage` instead of `.local/`;
- a **command line**, `python -m docs_site.diagrams --write docs_site/pages/assets/diagrams`,
  that regenerates the committed SVG files.

Pages reference a diagram as raw HTML so the existing theme CSS keeps applying:

```html
<figure class="tp-diagram">
  <img src="assets/diagrams/system.svg" alt="How a request reaches an agent">
  <figcaption>Both clients reach the same agent catalog.</figcaption>
</figure>
```

### What is removed

| File | Reason |
|---|---|
| `docs_site/assembler.py` | Its job was assembling repository READMEs into pages. The site no longer sources them. |
| `docs_site/gen_pages.py` | The `gen-files` entry point; the plugin is gone. |
| The *Optimization log* page | A record of code changes; not reader material. The source file stays in the repository, the page is not published. |

`docs_site/requirements.txt` drops `mkdocs-gen-files`. The `docs` extra in
`pyproject.toml` is left as is unless `uv lock` can regenerate the lockfile offline; a
stale extra costs one unused package and must not break dependency installation.

## Content rules

Every reader page follows these rules. They are the definition of "reader-facing" for this
site.

### Removed

- Python module names and any file path ending in `.py`.
- Source snippets in every language.
- Configuration keys, import statements, function and class internals.
- Code-shaped inline spans: `snake_case`, `CamelCase`, dotted or parenthesised calls —
  except the names on the kept-terms list.
- Tables whose only content is a file layout.
- The *Optimization log* page.

### Kept

- Product and system names: LangGraph, LangChain, Trino, Hive, S3, DataHub, Qdrant, Jira,
  Kubernetes, Airflow, MCP.
- Agent names as product concepts: `intent`, `plan`, `databot`, `knowledge`, `diagnostic`,
  `data_analysis`, `swe`.
- Capabilities, workflows, limits, guardrails, human approval points.
- Operational instructions: how to install, how to start, how to ask, where configuration
  lives, which command-line switches exist.

### Kept-terms list

One list, defined once and used by both the writing rules and the tests, names the
identifiers that are allowed to stay because they are product concepts rather than code:

- the seven agent names: `intent`, `plan`, `databot`, `knowledge`, `diagnostic`,
  `data_analysis`, `swe`;
- product and system names: LangGraph, LangChain, Trino, Hive, S3, DataHub, Qdrant, Jira,
  Kubernetes, Airflow, MCP, SQLite, AG-UI, CopilotKit.

Anything not on the list is rewritten. The list lives in `docs_site/kept_terms.md` so the
writers and the tests read the same source.

### Components

A component is described as a class or an object, in plain language:

> The agent catalog is a class that holds every agent the platform can create. It is
> assembled once at startup, so asking it for an agent is cheap.

Not: "the `AgentCatalog` class in `agent/catalog.py`".

### Tool reference

The table keeps all 52 rows. The *Module* column is dropped. The *Registry key* column
becomes a natural-language name:

| Registry key | Reader name |
|---|---|
| `trino_run_query` | Trino: run query |
| `trino_explain` | Trino: explain query |
| `propose_sql` | Propose SQL |
| `fetch_related_models` | Fetch related models |

The generic rule covers most names: split the identifier on `_`, keep a known prefix as a
qualifier (`trino`, `hive`, `s3`, `k8s`), and title-case the rest. A short list of names
that read badly under that rule is overridden explicitly.

### Commands

Operational commands stay. Where an equivalent form avoids a module name, it is preferred:
the launch command is `tahoepilot`, not `python main.py`.

## Pages

| Page | File | Content |
|---|---|---|
| Home | `index.md` + `overrides/home.html` | What the platform is, the seven agents, what makes it different. No code formatting. |
| Getting started | `getting-started.md` | What you can do, how to ask, how answers are approved, how to connect your own data, how to install and run. |
| Architecture | `architecture.md` | The components, how a request flows, where the human gates are. Carries the system diagram. |
| Agents | `agents.md` | The seven agents, their capabilities, how routing works. |
| Databot | `databot.md` | The staged data question flow and its approval gates. |
| Databot graph | `databot-graph.md` | The state machine diagram. The existing `docs/databot-graph.html` is copied into the site's assets as a new file and embedded. |
| Tools | `tools.md` | The 52 built-in tools by capability, read-only guarantees, connection and scope concepts. |
| Configuration | `configuration.md` | How configuration works as a concept; no key names. |
| Memory | `memory.md` | Session memory, context compression, user profiles. |
| Knowledge | `knowledge.md` | What gets indexed, how retrieval works, how results are reranked. |
| Evals | `evals.md` | How the platform is evaluated and what a passing run looks like. |
| Web UI | `web-ui.md` | The browser experience. |
| Roadmap | `roadmap.md` | The existing English roadmap, copied in. |
| 路线图 | `roadmap-zh.md` | The existing Chinese roadmap, copied in. |

## Tests

`tests/test_docs_site.py` is rewritten to cover the new pipeline. It builds the site into a
temporary directory and asserts:

| Test | Assertion |
|---|---|
| `test_build_is_strict_clean` | `mkdocs build --strict` succeeds with no warnings. |
| `test_nav_entries_resolve` | Every nav entry maps to a file in the docs directory. |
| `test_no_module_names` | No `.py` appears in any built page outside an operational block. |
| `test_no_source_snippets` | No fenced code block in a language other than shell. |
| `test_no_identifier_code_spans` | No inline span matches `snake_case`, `CamelCase`, dotted or parenthesised forms. |
| `test_no_file_path_tables` | No table column holds a file path. |
| `test_diagram_labels_are_reader_facing` | No SVG label contains a path or an identifier. |
| `test_changelog_not_published` | The optimization log is neither generated nor in the nav. |

The build in the test uses the same MkDocs configuration as the site, so the assertions run
against the real output.

## Risks

| Risk | Mitigation |
|---|---|
| The site drifts from the repository | Accepted deliberately: the site is the reader-facing surface and is maintained as its own content. The repository keeps the developer documentation. |
| Hand-written pages miss a capability | Each page is written from its source README; a first pass is checked against the subsystem's tool and agent inventory. |
| A future page reintroduces code | The test suite fails on the next change. |
| Diagrams drift from the code that draws them | `diagrams.py` keeps generating them; the command line regenerates the committed assets. |

## Non-goals

- Changing what the platform does.
- Touching platform source code.
- Keeping the repository README as the site's content source.
- Publishing the code-change log.

# Docs site reader layer — design

**Date**: 2026-11-08
**Status**: awaiting review
**Scope**: the published GitHub Pages site only. Repository documentation keeps its developer-facing voice.

## Context

The site at `jixiedev.github.io/tpilot/` is assembled at build time from the repository's
READMEs (`docs_site/assembler.py`). Those sources are written for engineers: they name Python
modules, show source snippets, and use config keys as the vocabulary.

Measured over the 13 published sources: 364 `.py` mentions, 61 fenced code blocks
(bash 22, plain 80, python 8, toml 6, json/jsonc 3, text 3) and 5342 inline code spans.
The page that is published as *Optimization log* is a 110 KB record of code changes.

The site readers are data-team users who want to know what the platform does, what it can
reach, and how a question flows. They do not read code.

## Goal

No implementation detail reaches the published site: no module files, no source snippets,
no config keys, no identifier-as-code. Components are described as classes and objects in
plain language.

## Decisions

| Decision | Choice |
|---|---|
| Layer to change | Published site only. Repository READMEs stay developer-facing. |
| *Optimization log* page | Removed from the site. It stays in the repository. |
| Mechanism | Automatic filtering as a guarantee, plus a term dictionary for readable prose. |
| Built-in tool reference | Keep the full table (52 rows); drop the file column; humanize tool names. |
| Install / getting-started | Keep. Commands and configuration paths are operational instructions, not implementation detail. |

The last decision draws the line the whole design rests on:

- **Implementation detail — removed.** Python modules, source snippets, config keys, imports,
  function and class internals, file-layout tables.
- **Operational instruction — kept.** How to install, how to start, how to ask a question,
  which command-line switches exist, where configuration lives.

## Architecture

A new module `docs_site/reader.py` sits in front of the assembler and produces the reader
view of every page. The repository sources are never modified.

```
source README (developer voice)
  -> diagrams.replace_ascii()      existing: ASCII fences -> inline SVG
  -> reader.reader_view()          NEW: developer voice -> reader voice
  -> assembler._rewrite_*           existing: link rewriting
  -> MkDocs page
```

`reader.py` owns:

| Piece | Responsibility |
|---|---|
| `PagePolicy` | Per-page rules: which sections are kept verbatim, which are dropped, which tables drop which columns. |
| `SECTION_DROP` | Headings whose section is implementation detail and is removed whole. |
| `TERMS` | Term dictionary: identifier -> reader-facing phrase. |
| `reader_view()` | Section-aware rewrite of one markdown document. |
| `audit()` | Returns the list of violations in one document; empty list means compliant. |

Term dictionary lives in `docs_site/reader_terms.py` so the vocabulary can be reviewed as
data rather than as code.

### Section classification

`reader_view()` splits the source into sections by heading, then classifies each section:

| Class | Treatment | Examples |
|---|---|---|
| `verbatim` | Emitted unchanged. | `## Quick start` in the root README, `### Install`, `### Run the CLI` |
| `drop` | Removed whole. | *Package map*, *Python API*, *Repository layout*, *Where to start reading code*, *Adding a tool*, *Extension notes*, *File formats*, *Exit codes and CI* |
| `rewrite` | Default. Code removed, terms mapped. | Everything else |

`verbatim` sections still get the file-name rule applied: a command block that happens to
contain a `.py` path is still rewritten, but the commands themselves stay.

### Rewrite rules

Applied in order to `rewrite` sections:

1. **Fenced blocks.** Kept: `bash` (installation and run commands). Removed: `python`,
   `toml`, `json`, `jsonc`, `yaml`, `text`, and untagged blocks that are not ASCII
   architecture art (that art is already replaced by SVG before this stage).
2. **Tables.** A column whose header names a file, path, module or source location is
   dropped. A first column holding identifiers is humanized.
3. **Inline code spans.** A span is classified:
   - operational (command, flag, configuration path) -> kept as plain text, no code formatting;
   - a known identifier -> replaced by its dictionary phrase;
   - otherwise (snake_case, CamelCase, dotted or parenthesised) -> humanized by
     the generic rules (`propose_sql` -> "propose SQL"); dropped only when the
     span is a bare path or resolves to an empty phrase.
4. **Backticks.** The site never renders code formatting; everything that survives is plain
   prose.

### Term dictionary

Two tiers:

- **Explicit map** for names a reader should recognise as a component, phrased so the
  component reads as a class or object:

  | Identifier | Reader phrasing |
  |---|---|
  | `AgentCatalog` | the agent catalog — a class that creates and holds agents |
  | `BaseAgent` | the base agent class |
  | `LangGraph` | LangGraph (kept: product name) |

- **Generic rules** for the rest: `propose_sql` -> "propose SQL", `max_tool_calls` ->
  "maximum tool calls", `tools/data/trino.py` -> dropped.

Agent names (`intent`, `plan`, `databot`, `knowledge`, `diagnostic`, `data_analysis`,
`swe`) stay: they are product concepts, not code.

### Diagrams

`docs_site/diagrams.py` renders labels such as `cli.py`, `main.py`, `agent/`,
`config/agents`, `.local/`, `AgentCatalog`. A reader label map is applied at render time
for the site only; the ASCII art in the repository is untouched.

| Label | Reader label |
|---|---|
| `cli.py`, `main.py`, `repl` | terminal |
| `agent/`, `graph/` | agents, orchestration |
| `tools/`, `memory/`, `rag/` | tools, memory, knowledge |
| `config/agents` | configuration |
| `.local/` | local storage |
| `AgentCatalog` | agent catalog |

### Pages

| Page | Treatment |
|---|---|
| Home | Hand-written. Keeps the install block; `<code>intent</code>` style tags become styled text; the configuration path stays because it is operational. |
| Getting started | The root README's *Quick start* survives verbatim; the rest of the page is rewritten. |
| Architecture | Rewritten; its three SVG diagrams get reader labels. |
| Agents: framework, databot, databot graph | Rewritten. The graph page keeps its HTML diagram (a picture, not code). |
| Subsystems: tools, configuration, memory, RAG, evals, web UI | Rewritten. The tool reference table keeps all 52 rows minus the file column. |
| Project: roadmap (EN/ZH) | Already free of code; unchanged apart from link rewriting. |
| Optimization log | **Removed** from `assembler._REPO_PAGES` and from the MkDocs nav. |

## Enforcement

Compliance is a build-time guarantee, not a review convention.

`docs_site/audit.py` renders every page through the same reader path the site uses and
reports violations:

- a `.py` token anywhere;
- a fenced block in a code language (outside `verbatim` sections);
- an inline code span matching an identifier pattern (`snake_case`, `CamelCase`, dotted,
  parenthesised) outside `verbatim` sections;
- a reader diagram label still containing a path or identifier;
- a section that should have been dropped.

Run as `python -m docs_site.audit`; exits non-zero and lists the offending page and line.
The GitHub Pages workflow runs it before `mkdocs build --strict`, so a future documentation
edit that reintroduces code fails the deploy instead of shipping.

The same audit is wrapped by `tests/test_reader.py` for local runs.

## Testing

| Test | Assertion |
|---|---|
| `test_no_module_files_anywhere` | No `.py` in any rendered page, including verbatim sections. |
| `test_no_code_blocks_in_rewritten_sections` | No python/toml/json/yaml blocks outside verbatim sections. |
| `test_no_identifier_code_spans` | No identifier-shaped inline code outside verbatim sections. |
| `test_operational_sections_survive` | Install and run commands are still present on the getting-started page. |
| `test_tool_table_has_no_file_column` | The tool reference keeps 52 rows and no file column. |
| `test_diagram_labels_are_reader_facing` | No diagram label contains a path or identifier. |
| `test_changelog_page_is_gone` | The changelog is not generated and not in the nav. |
| `test_audit_is_clean` | `audit()` returns no violations for every published page. |

## Risks

| Risk | Mitigation |
|---|---|
| Over-filtering empties a page | Term dictionary plus per-page policy; every page is reviewed by hand after the first build. |
| Under-filtering leaks an identifier | The audit fails the build; the test suite fails locally. |
| The site drifts from the repository | Both are updated in the same commit; the site is assembled from the repository, never from a copy. |
| Dictionary growth | Terms live in a data file with a reviewable format; unknown identifiers fall back to generic humanization, never to raw code. |

## Non-goals

- Rewriting repository documentation into a user-facing voice.
- Changing what the platform does.
- Removing the ASCII art from the repository READMEs.
- A second, hand-maintained copy of the site content.

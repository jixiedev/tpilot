# Observability (eval loop)

Run JSON case suites against TahoePilot agents. Cases are grouped by **eval-set category**, then by agent file.

## Layout

```
observability/
  case.py         # EvalCase subclasses per workload, CaseLoader
  runner.py       # EvalRunner: run one case on one model → EvalRunResult
  scorer.py       # EvalScorer: EvalRunResult → EvalScore (per-dimension)
  pipeline.py     # EvalPipeline: load → run → score → EvalReport, CLI defaults
  timing.py       # EvalTimer: per-call model / tool timing → TurnTiming
  cases/
    functional/   # outcome correctness
      databot.json
      knowledge.json
      intent.json
    performance/  # tool-call / status budget
      databot.json
      knowledge.json
      intent.json
    harness/      # cheap smoke / tool-path without gold answers
      knowledge.json
      intent.json
```

Only `cases/<eval_set>/<agent>.json` is loaded. Do not put bare `*.json` under `cases/`.

## Run

From the repo root (after `uv sync`):

```bash
# default: --agent databot --eval-set functional, model MiniMax-M3
uv run python -m observability

uv run python -m observability --agent knowledge
uv run python -m observability --agent intent --eval-set functional harness
uv run python -m observability -a databot -g functional performance --model MiniMax-M3
uv run python -m observability -a knowledge -m MiniMax-M3 <other-model>   # compare models

uv run python -m observability --list-eval-sets
uv run python -m observability --list-cases
uv run python -m observability --agent knowledge --eval-set harness --list-cases
uv run python -m observability --list-models
uv run python -m observability --fail-under 0.8
```

| Flag | Meaning |
|------|---------|
| `-a` / `--agent` | `databot` \| `knowledge` \| `intent` (default: `databot`) |
| `-g` / `--eval-set` | One or more of `functional` `performance` `harness` |
| `-m` / `--model` | One or more names from `models/models.toml`; every case runs on each (default: `MiniMax-M3`) |
| `--cases-dir` | Override the cases root |
| `--fail-under` | Exit `1` if suite average is below this value |
| `--list-eval-sets` | Print available eval-set directories |
| `--list-cases` | Print `eval_set/agent/name` lines for `-a` / `-g` |
| `--list-models` | Print model names from `models.toml` |

### Default eval sets

| `--agent` | Default `--eval-set` |
|-----------|----------------------|
| `databot` | `functional` |
| `knowledge` | `functional` `harness` |
| `intent` | `functional` `harness` |

## Eval-set meaning

Each directory is a scoring slice. The same prompt may appear in more than one slice with different fields filled in.

| Eval set | What it scores | What fixtures should carry |
|----------|----------------|----------------------------|
| `functional` | Tools / routing / expected output (Databot also cards and `sql_runs`) | Gold outcomes (`expected_output`, cards). No `max_tool_calls`. |
| `performance` | `max_tool_calls` budget (intent: status only) | `max_tool_calls` (or intent status). Outcome fields optional. |
| `harness` | Tools + budget + output (smoke; Databot also `sql_runs`) | Cheap cases; free-form tool-path OK with empty `expected_output`. |

## Case schema

Shared file shape:

```json
{
  "cases": [
    {
      "name": "example",
      "query": "..."
    }
  ]
}
```

Fixtures describe the task only. Which model(s) to evaluate is chosen on the command line (`--model`), never in the case file.

### ReAct / Databot

```json
{
  "name": "find_dataset_metadata",
  "query": "… Reply with only {database}.{table} …",
  "tools": {
    "required": ["fetch_related_models", "commit_cards"],
    "allowed": [
      "fetch_related_models",
      "commit_cards",
      "datahub_list_glossary_terms",
      "datahub_graphql_query",
      "record_metric_conflict"
    ],
    "forbidden": []
  },
  "expected_table_cards": ["fct_dau"],
  "expected_output": "core_data.fct_dau"
}
```

| Field | Meaning |
|-------|---------|
| `tools.required` | Must appear (order-aware; unordered → partial credit) |
| `tools.allowed` | If non-empty, every actual tool must be in this set |
| `tools.forbidden` | Any hit → tools score 0 |
| `max_tool_calls` | Soft budget on tool-call count (`performance` / `harness`) |
| `expected_output` | ReAct: JSON object; the reply must be that bare object, scored per field. Databot: the exact reply string (e.g. `{database}.{table}`). Omit to skip. |
| `expected_table_cards` | Databot only: ordered card names from committed/review/approved |
| `draft_tools` | Databot only: same shape as `tools`, scored as `draft_tools` (`functional`) |
| `expected_sql` | Databot only: reference SQL (loaded, not scored yet) |

Empty `required` + empty `allowed` means no tools may be called.

Databot also always scores **`sql_runs`** (`functional` / `harness`; no fixture field): 1 if the approved SQL executed (`execution_result.ok` in the final state), 0 if Trino returned an error or the turn ended before `execute_sql`. The eval runner answers both gates with `dryrun`, which skips the profile write but still executes the SQL.

Answers are compared strictly — no parsing or normalization beyond trimming surrounding whitespace:

- **String** (`DatabotEvalCase`): the trimmed reply must equal `expected_output` exactly (case-sensitive). Prose, markdown, or a differently qualified name (`hive.core_data.fct_dau`) score 0.
- **Object** (`ReactEvalCase`): the whole reply must parse as one JSON object (no fences, no prose); each expected field must be exactly equal (`"3"` ≠ `3`). Score = fraction of matching fields.

So the `query` must state the exact reply format, e.g. *"Reply with only the table identity in the form {database}.{table}. Do not wrap it in markdown fences and do not add any other text."* or *"Reply with a single JSON object only … Required shape: {"result": <number>}"*. A model that does not follow the format scores low by design.

### Intent

```json
{
  "name": "data_gmv_query",
  "query": "…",
  "expected_status": "published",
  "expected_intentions": ["DATA"],
  "expected_routes": ["databot"]
}
```

| Field | Meaning |
|-------|---------|
| `expected_status` | `published` \| `rejected` \| `clarify` \| … |
| `expected_intentions` | Ordered intention labels |
| `expected_routes` | Ordered specialist routes (`databot`, `knowledge`, `plan`, …) |

Intent cases run with `handoff=False` and score routing only.

## Scoring flow

```
EvalCase ──EvalRunner.run(case, model)──▶ EvalRunResult ──EvalScorer.score()──▶ EvalScore
   ▲                                                                                 │
   └──────────────── EvalPipeline.run(agents, eval_sets, models) ──▶ EvalReport ◀────┘
```

1. `CaseLoader` reads `cases/<eval_set>/<agent>.json`; the agent picks the `EvalCase` subclass, and JSON keys matching its dataclass fields are copied in (`query` → `prompt`).
2. `EvalRunner` binds one agent per (agent, model), runs the case once per allowed model, and records reply, final state, and tool calls (only for `traced` cases).
3. `EvalScorer` scores only the dimensions that eval set owns (`EvalScorer.DIMENSIONS`); `answer` is scored only when `expected_output` is set.
4. Case average = mean over models; suite average = mean over cases (`--fail-under` uses this).

### Timing

Every run also records where its time went (`EvalRunResult.timing`, a `TurnTiming`). Timing is reported, never scored:

```
  timing: wall=172.0s model=120.3s/14 calls tools=40.1s/15 calls
    by stage: fetch_cards model=60.2s tools=19.9s | generate_sql model=48.0s tools=18.7s | …
    by tool: trino_explain 4x 12.0s (max 4.1s), fetch_related_models 3x 9.8s (max 4.0s), …
```

`EvalTimer` (`timing.py`) is a LangChain callback handler. `EvalRunner` activates it around `agent.run`, and a configure hook attaches it to every model and tool run in that turn: all agents, Databot's stage subgraphs, and parallel tool batches, with no agent changes. The stage is the top-level graph node of the run (from `langgraph_checkpoint_ns`), so Databot shows its pipeline stages and a plain ReAct agent shows `step_reason` / `step_action` (only one stage → the line is omitted).

Read the numbers with two caveats: tools in one batch run in parallel, so `tools=` (a sum of call durations) can exceed the wall time it took; and a model call made inside a tool is counted both as a model call and in that tool's duration. Wall time minus model and tool time is graph overhead plus gate handling.

`agent/middleware/performance.py` (`PerformanceMiddleware`) is not used here: LangChain `AgentMiddleware` hooks only run inside `langchain.agents.create_agent`, and TahoePilot agents are built with `graph/builder.py`.

Fixtures are trusted input: a malformed file fails with the underlying `KeyError` / `TypeError` rather than a friendly message.

### Adding a workload

Subclass `EvalCase` (or `ToolPathEvalCase` for tool-calling agents) with typed fields, `kind`, and optional `traced` / `run_kwargs`. Map the agent name to it in `CaseLoader.CASE_TYPES` (this is also the `--agent` choice list), add a `kind` column to `EvalScorer.DIMENSIONS`, and register a `_<kind>_dimensions` method in `EvalScorer.__init__`.

To evaluate another agent with an existing workload shape, add one line to `CaseLoader.CASE_TYPES` (e.g. `"diagnostic": ReactEvalCase`), a `DEFAULT_EVAL_SETS` entry, and its fixtures.

# Observability (eval loop)

Run JSON case suites against TahoePilot agents. Cases are grouped by **eval-set category**, then by agent file.

## Layout

```
observability/
  case.py         # case models, ToolsSpec, EvalCase subtypes, CaseLoader
  evaluator.py    # scorers and expected_output matching
  trace.py        # EvalReactListener, TracedAgentTurn
  runner.py       # EvalHarness, agent pool, CLI defaults
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

uv run python -m observability --list-eval-sets
uv run python -m observability --list-cases
uv run python -m observability --agent knowledge --eval-set harness --list-cases
uv run python -m observability --list-models
uv run python -m observability --fail-under 0.8
```

| Flag | Meaning |
|------|---------|
| `-a` / `--agent` | `databot` \| `knowledge` \| `intent` (default: `databot`) |
| `-g` / `--groups` / `--eval-set` | One or more of `functional` `performance` `harness` |
| `--model` | Name from `models/models.toml` (default: `MiniMax-M3`) |
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
| `functional` | Tools / routing / expected output (Databot also cards) | Gold outcomes (`expected_output`, cards). No `max_tool_calls`. |
| `performance` | `max_tool_calls` budget (intent: status only) | `max_tool_calls` (or intent status). Outcome fields optional. |
| `harness` | Tools + budget + output (smoke) | Cheap cases; free-form tool-path OK with empty `expected_output`. |

## Case schema

Shared file shape:

```json
{
  "models": ["MiniMax-M3"],
  "cases": [
    {
      "name": "example",
      "query": "...",
      "models": ["MiniMax-M3"]
    }
  ]
}
```

File-level `models` apply to every case unless a case overrides `models`.

### ReAct / Databot

```json
{
  "name": "find_dataset_metadata",
  "query": "… Reply with only {database}.{table} …",
  "tools": {
    "required": ["search"],
    "allowed": ["search"],
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
| `expected_output` | JSON object fields, a `{database}.{table}` string, or `{}` to skip |
| `expected_table_cards` | Databot only: ordered card names from committed/review/approved |

Empty `required` + empty `allowed` means no tools may be called.

Metric-style replies should require `{"result": <number>}`. Table-style replies should require `{database}.{table}`.

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

1. Load `cases/<eval_set>/<agent>.json` for the selected agents, models, and eval sets.
2. Run each case once per allowed model; attach a turn trace.
3. Score only the dimensions owned by that eval set; skip empty `expected_output`.
4. Case average = mean over models; suite average = mean over cases (`--fail-under` uses this).

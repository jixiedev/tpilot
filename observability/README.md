# Observability (eval loop)

Run JSON case suites against TahoePilot agents and score tool order, ReAct rounds, and answers (or intent routing for `--agent intent`).

Each case lists one or more model names from `models/models.toml`. The harness runs the case once per model, averages those scores for the case, then averages across cases.

Requires the same LLM / tool setup as the main CLI (repo-root `.env`, `models/models.toml`, and any Hive/Trino/Qdrant/MCP deps used by the selected agent).

## Run

From the repo root (after `uv sync`):

```bash
# default: --agent tahoe, groups general + tahoe
uv run python -m observability

# pick an agent (default groups are agent-specific)
uv run python -m observability --agent tahoe
uv run python -m observability --agent databot
uv run python -m observability --agent knowledge
uv run python -m observability --agent intent

# override case groups (files under observability/cases/<group>.json)
uv run python -m observability --agent tahoe --groups general
uv run python -m observability -a tahoe -g general tahoe

# list available group keys / model names
uv run python -m observability --list-groups
uv run python -m observability --list-models

# custom cases directory
uv run python -m observability --cases-dir path/to/cases

# fail CI / scripts when average score is below a threshold (exit 1)
uv run python -m observability --agent tahoe --fail-under 0.8
```

Equivalent without `uv`:

```bash
python -m observability --agent tahoe
```

## Case `models`

Top-level file default (applies to every case unless overridden):

```json
{
  "models": ["sensenova-6.7-flash-lite", "glm-4.7-flash"],
  "default": [
    {
      "name": "arithmetic",
      "query": "...",
      "expected_tools": [],
      "total_rounds": 1,
      "answer": { "result": "3" }
    }
  ]
}
```

Per-case override:

```json
{
  "name": "local_only",
  "models": ["qwen3-ctx40k"],
  "query": "..."
}
```

Names must exist under `[model.*]` in `models/models.toml`.

Scoring:

1. Run case × each listed model → per-model score  
2. **Case average** = mean of those model scores  
3. **Suite average** = mean of case averages (`--fail-under` uses this)

## Agents and default groups

| `--agent` | Default `--groups` | Case file(s) |
|-----------|--------------------|--------------|
| `tahoe` | `general` `tahoe` | `cases/general.json`, `cases/tahoe.json` |
| `databot` | `databot` | `cases/databot.json` |
| `knowledge` | `knowledge` | `cases/knowledge.json` |
| `intent` | `intent` | `cases/intent.json` |

## CLI flags

| Flag | Meaning |
|------|---------|
| `-a` / `--agent` | `tahoe` \| `databot` \| `knowledge` \| `intent` (default: `tahoe`) |
| `-g` / `--groups` | One or more group keys matching `cases/<group>.json` |
| `--cases-dir` | Directory of case JSON files (default: `observability/cases`) |
| `--fail-under` | Exit `1` if suite average is below this value |
| `--list-groups` | Print available group keys and exit |
| `--list-models` | Print `models.toml` names and exit |

## Scoring dimensions

- **ReAct agents** (`tahoe`, `databot`, `knowledge`): equal-weight average of tool-order (subsequence), round budget, and JSON answer fields (`answer` empty → answer score skipped).
- **Intent** (`intent`): router status, intention labels, and specialist route order (`execute_plan=False`).

Each run prints per-model lines, a `case avg`, then `Average score: …`.

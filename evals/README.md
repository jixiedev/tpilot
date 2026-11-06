# Evals

`evals/` runs JSON case suites against TahoePilot agents and scores each run. ReAct agents (`databot`, `knowledge`) are scored on tool order, ReAct rounds, and JSON answer fields. The intent router (`intent`) is scored on routing status, detected intentions, and the chosen route.

The CLI is `python -m evals`. Cases live in this repo under `evals/cases/`, so a case change is reviewed with the code it tests.

Related docs:

- [`agent/README.md`](../agent/README.md) — agents, `AgentCatalog`, `AgentListener`, and the intent orchestrator being evaluated.
- [`agent/specialists/databot/README.md`](../agent/specialists/databot/README.md) — Databot behavior that the `databot` cases exercise.
- [`tools/README.md`](../tools/README.md) — tool names that appear in `expected_tools`.
- [`config/README.md`](../config/README.md) — per-agent tool sets and prompts in `config/agents/*.toml`.
- [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) — overall platform layout.

## Concepts

| Term | Meaning |
|------|---------|
| Group | One case file, `evals/cases/<group>.json`. Selected with `--groups`. The group key is the file stem. |
| Suite | A named list of cases inside a group file (any top-level key other than `models`). A file that is a bare JSON list has one suite named `default`. |
| Case | One query plus expectations. Two types: `ToolCallCase` (ReAct agents) and `IntentRouterCase` (intent router). Reported as `<group>/<suite>/<name>`. |
| Model fan-out | Each case lists model names from `models/models.toml`. The case runs once per model, each on a fresh session. |
| Case score | Per model run: the equal-weight mean of three dimension scores in `[0, 1]` (`CaseScore.total`). |
| Case average | Mean of a case's per-model scores. A cancelled run counts as 0. |
| Suite average | Mean of case averages across every selected group. Printed as `Average score` and compared with `--fail-under`. |

## Design

- **Repo-local JSON cases.** No external eval service or dataset store; cases are small JSON files next to the harness.
- **Behavior, not only answers.** A ReAct run is judged on which tools were called and in what order, how many reasoning rounds it took, and on structured fields in the reply.
- **Partial credit.** Calling the right tools in the wrong order earns half credit per covered tool instead of zero. Exceeding the round budget lowers the score gradually.
- **Per-model averaging.** Every model in a case counts equally for that case, and every case counts equally for the suite, regardless of how many models it runs on.
- **Same agent construction as production.** Agents are built through `AgentCatalog` with the configured prompts and tools, with an in-memory checkpointer and history compression disabled for ReAct agents.

## Layout

| Path | Role |
|------|------|
| `evals/__main__.py` | CLI, agent construction (`create_eval_agent`), default groups |
| `evals/case_base.py` | `BaseCase`, case-file loading, `score_sequence`, `run_case_aggregates`, group aliases |
| `evals/tool_case.py` | `ToolCallCase`, `CaseResult`, `CaseAggregate`, `run_cases`, output formatting |
| `evals/intent_case.py` | `IntentRouterCase`, `extract_routing_outcome`, `run_intent_cases` |
| `evals/answer_match.py` | `score_answer`, `extract_json_object`, `values_equal` |
| `evals/listeners.py` | `EvalReactListener` (records tool calls and reason steps), `CaseScore` |
| `evals/cases/*.json` | Case groups: `databot`, `general`, `intent`, `knowledge`, `tahoe` |

Tests: `tests/test_evals_cases.py`, `tests/test_evals_intent_cases.py`, `tests/test_evals_answer_match.py`.

## How a run works

```
python -m evals --agent A --groups G1 G2
   |
   v
iter_raw_cases: for each group file -> each suite -> each raw case
   |   (file-level "models" is the default for cases without their own)
   v
find_cases / find_intent_cases  -> ToolCallCase | IntentRouterCase
   |
   v
run_case_aggregates
   for case in cases:
     for model in case.models:
        agent = cache[model] or create_eval_agent(A, model)   # one agent per model, reused
        result = case.run(agent)                               # fresh session id per run
     case average = mean(model scores)
   suite average = mean(case averages)
   |
   v
print per-model lines, "case avg", "Average score: X (N case(s), M model run(s))"
exit 1 if --fail-under and average < threshold
```

ReAct runs (`ToolCallCase.run`): the harness clears the agent's secondary listeners, registers an `EvalReactListener`, runs one turn with `user_id="case_bot"` and `print_output=False`, scores it, then clears the listener again. The agent must support `register_secondary` (`BaseReactAgent`), otherwise the run fails with a `TypeError`.

Intent runs (`IntentRouterCase.run`): the orchestrator runs with `handoff=False`, so it stops after publishing a route and never executes the target agent. The resulting graph state is normalized by `extract_routing_outcome`.

## Scoring

### Sequence score (`score_sequence`)

Used for tool order, intentions, and routes.

| Condition | Score | `reason` |
|-----------|-------|----------|
| `expected` empty and `actual` empty | 1.0 | the case's empty reason (e.g. `no tools expected`) |
| `expected` empty and `actual` not empty | 0.0 | same |
| `expected` is an ordered subsequence of `actual` | 1.0 | `ordered match` |
| otherwise | `0.5 * len(overlap) / len(set(expected))`, where `overlap = set(expected) & set(actual)` | `unordered partial` (with `overlap`) |

Extra calls between expected ones do not cost anything: `["search", "get_entities"]` matches `["search", "list_schema_fields", "get_entities"]`. Repeated names in `expected` must each appear in order for a full match; the partial score uses sets.

### ToolCallCase

| Dimension | Field in `CaseScore` | Rule |
|-----------|----------------------|------|
| Tools | `tool_score` | `score_sequence(expected_tools, tool names in call order)` |
| Rounds | `round_score` | `actual` = reason steps that issued at least one tool call (the final answer step is not a round). `expected = max(0, total_rounds)`. If `expected == 0`: `actual == 0` → 1.0, any tool round → 0.0. Otherwise: `actual <= 0` → 0.0; `actual <= expected` → 1.0; else `max(0, 1 - (actual - expected) / expected)`. |
| Answer | `answer_score` | `score_answer(reply, answer)`, see below |

Total = `(tool_score + round_score + answer_score) / 3`.

Round examples with `total_rounds: 2`: 1 or 2 rounds → 1.0, 3 rounds → 0.5, 4 or more → 0.0. With `total_rounds: 0` (a no-tool case): answering directly → 1.0, so a correct no-tool answer can reach a total of 1.0.

### Answer matching (`score_answer`)

- `answer` empty → 1.0 and `skipped: true`.
- The reply is searched for a JSON object, trying in order: the first fenced ` ```json { ... } ``` ` block, the whole reply if it starts with `{`, then the span from the first `{` to the last `}`. The first candidate that parses to an object wins. No object → 0.0 with `parse_error`.
- Score = matched keys / expected keys. Keys are reported as `matched`, `missing`, or `mismatched`.
- `values_equal`: two numbers compare as floats; everything else compares as stripped, case-folded strings (`"3"` matches `3`, `"tahoe-949"` matches `"TAHOE-949"`). An empty expected string matches any value, as long as the key is present.

### IntentRouterCase

The three dimensions reuse `CaseScore` fields; the output labels them `status`, `intentions`, `routes`.

| Dimension | Field in `CaseScore` | Rule |
|-----------|----------------------|------|
| Status | `tool_score` | 1.0 if the normalized status equals `expected_status` (lower-cased), else 0.0 |
| Intentions | `round_score` | `score_sequence` over upper-cased labels |
| Routes | `answer_score` | `score_sequence` over route names |

`extract_routing_outcome(state)`:

| Graph state | `status` | `intentions` | `routes` |
|-------------|----------|--------------|----------|
| empty | `pending` | `[]` | `[]` |
| interrupt pending (clarification question) | `clarify` | from state | `[]` |
| `status == "published"` | `published` | `user_intentions` | `[route_target]` |
| `status == "rejected"` | `rejected` | `[]` | `[]` |
| anything else | that status, or `pending` | from state | `[]` |

A published intention routes to the agent resolved by `AgentCatalog.resolve_route_target` (`PLAN` → `plan`); a reply with several labels also routes to `plan`. So `expected_routes` holds at most one name in practice.

`IntentRouterCase.run` leaves a clarifying question unanswered: the run stops there and scores as `clarify`, and it is not counted as a cancelled run. The model still emits a tentative label while asking; a `clarify` case with empty `expected_intentions` does not check it, while a case that lists labels does.

## Case files

### Shape

A group file is an object whose keys are suite names mapping to lists of cases. The optional top-level `models` (string or list) is the default for every case in the file. A file may also be a bare list of cases (one suite, `default`).

Every case needs `name`, `query`, and a non-empty `models` (its own or the file default). Model names must exist under `[model.*]` in `models/models.toml`; check with `--list-models`.

### ToolCallCase example

```jsonc
{
  "models": ["MiniMax-M3"],      // default for cases below
  "jira": [                                    // suite name
    {
      "name": "jira_superset_security",        // required; unique within the suite
      "query": "How should we address security vulnerabilities in Superset? Reply with a single JSON object only. Required shape: {\"jira_ticket\": \"<value>\"}",
      "models": ["MiniMax-M3", "glm-4.7-flash"],   // optional override
      "expected_tools": ["fetch_related_jira_tickets"],          // ordered; [] = no tool calls allowed
      "total_rounds": 2,                       // tool-calling rounds budget; default 1 (0 if expected_tools is [])
      "answer": { "jira_ticket": "TAHOE-949" } // JSON fields to check; {} = skip answer scoring
    }
  ]
}
```

| Field | Required | Default | Meaning |
|-------|----------|---------|---------|
| `name` | yes | | Case name |
| `query` | yes | | User message for the turn |
| `models` | yes, unless the file sets it | file `models` | Models to fan out to |
| `expected_tools` | no | `[]` | Tool names that must appear in this order |
| `total_rounds` | no | `1`, or `0` when `expected_tools` is empty | Tool-calling ReAct rounds allowed without penalty. `0` means the case expects a direct answer. |
| `answer` | no | `{}` | Expected key/value pairs in the reply's JSON object |

When `answer` is set, tell the model in `query` to reply with a single JSON object of that shape; otherwise the parse step fails and the answer scores 0.

### IntentRouterCase example

```jsonc
{
  "models": ["MiniMax-M3"],
  "router": [
    {
      "name": "composite_gmv_definition_then_query",
      "query": "Look up the GMV metric definition in team docs, then query yesterday's GMV from the warehouse.",
      "expected_status": "published",          // required: published | rejected | clarify | ...
      "expected_intentions": ["PLAN"],         // ordered labels; case-insensitive
      "expected_routes": ["plan"]              // [] = no route expected
    },
    {
      "name": "clarify_small_talk",
      "query": "hello",
      "expected_status": "clarify",
      "expected_intentions": [],
      "expected_routes": []
    }
  ]
}
```

| Field | Required | Default | Meaning |
|-------|----------|---------|---------|
| `name`, `query`, `models` | as above | | |
| `expected_status` | yes | | Normalized routing status |
| `expected_intentions` | no | `[]` | Intention labels in detection order |
| `expected_routes` | no | `[]` | Route target agent names |

The intention labels and route targets come from the intent agent's configuration; see [`agent/README.md`](../agent/README.md).

`.jsonc` comments above are for explanation only. Case files must be plain JSON.

## Agents and default groups

| `--agent` | Case type | Default `--groups` |
|-----------|-----------|--------------------|
| `databot` (default) | `ToolCallCase` | `databot` |
| `knowledge` | `ToolCallCase` | `knowledge` `general` `tahoe` |
| `intent` | `IntentRouterCase` | `intent` |

Current groups:

| Group | Suites | Cases | Used for |
|-------|--------|-------|----------|
| `databot` | `catalog` | 1 | DataHub `search` lookup |
| `general` | `default` | 2 | No-tool answers (`arithmetic`, `greeting`; `total_rounds: 0`) |
| `intent` | `router` | 10 | Routing to each label (multi-specialist requests → `PLAN`) and a clarifying question for small talk |
| `knowledge` | `jira` | 1 | `fetch_related_jira_tickets` with a JSON answer |
| `tahoe` | `planning` | 1 | `planning` tool before replying |

`knowledge_case` is accepted as an alias for the `knowledge` group (`GROUP_ALIASES`).

## Usage

Prerequisites are the same as the main CLI: repo-root `.env` (loaded by `evals/__main__.py`), `models/models.toml`, and whatever backends the agent's tools reach (Trino / Hive, DataHub MCP, Qdrant and the RAG models from [`rag/README.md`](../rag/README.md)). Every case run calls the listed LLMs.

```bash
# default: --agent databot, groups: databot
uv run python -m evals

# pick an agent; groups default per agent
uv run python -m evals --agent knowledge
uv run python -m evals -a intent

# choose groups explicitly
uv run python -m evals -a knowledge -g knowledge general

# cases from another directory
uv run python -m evals -a databot --cases-dir path/to/cases -g my_group

# discover groups and models (no LLM calls)
uv run python -m evals --list-groups
uv run python -m evals --list-models

# gate on the suite average
uv run python -m evals -a knowledge --fail-under 0.8
```

Without `uv`, use the project interpreter: `.venv/bin/python -m evals ...`.

| Flag | Meaning |
|------|---------|
| `-a` / `--agent` | `databot` \| `knowledge` \| `intent` (default `databot`) |
| `-g` / `--groups` | One or more group keys (`cases/<group>.json`); default depends on the agent |
| `--cases-dir` | Directory of case files (default `evals/cases`) |
| `--fail-under` | Exit `1` when the suite average is below this value |
| `--list-groups` | Print group keys found in the cases directory and exit (honors `--cases-dir`) |
| `--list-models` | Print model names from `models/models.toml` (default marked `(default)`) and exit |

### Output

```
[0.67] knowledge/jira/jira_superset_security model=MiniMax-M3 (tools=1.00 rounds=1.00 answer=0.00)
  tools: expected=['fetch_related_jira_tickets'] actual=['fetch_related_jira_tickets'] (ordered match)
  rounds: expected=2 actual=2
  answer mismatched keys: ['jira_ticket']
  case avg: 0.667 (1 model: MiniMax-M3)
Average score: 0.667 (1 case(s), 1 model run(s))
```

A cancelled run prints `[CANCELLED]` and counts as 0. Intent lines show `status=`, `intentions=`, `routes=` instead.

### Exit codes and CI

| Code | When |
|------|------|
| `0` | Run finished and `--fail-under` is unset or met |
| `1` | Suite average is below `--fail-under` |
| `2` | Configuration error: missing group file (`FileNotFoundError`), bad case or unknown model (`ValueError`), agent without listener support (`TypeError`) |

Other exceptions (for example an LLM or backend error during a turn) propagate and end the process with a traceback. In CI, run one agent per job and treat both `1` and `2` as failures:

```bash
uv run python -m evals --agent intent --fail-under 0.9
uv run python -m evals --agent knowledge --fail-under 0.7
```

## Adding cases

1. Pick the group file for the agent (or create `evals/cases/<new_group>.json`; it becomes a group key automatically).
2. Add the case to an existing suite or a new suite key. Give it a `name`, `query`, and expectations; rely on the file-level `models` unless the case needs others.
3. Use tool names exactly as registered (see [`tools/README.md`](../tools/README.md) and the agent's tool list in `config/agents/<agent>.toml`).
4. Run `--list-groups`, then run the group with one cheap model before adding more models.
5. A new group is not run by default. Pass it with `-g`, or add it to `DEFAULT_GROUPS` in `evals/__main__.py`.

## Pitfalls

- **`expected_tools: []` means "no tools".** Any tool call then scores 0 on the tools dimension. There is no "don't care" value.
- **No-tool cases need `total_rounds: 0`.** `reason_round_count` counts only reason steps that issued tool calls, so a direct answer is 0 rounds. With `total_rounds: 0` (the default when `expected_tools` is `[]`) that scores 1.0; with an explicit `total_rounds: 1` or more, 0 rounds still scores 0.0 and the case caps at 0.67.
- **Rounds are tool-calling rounds,** not LLM calls. Set `total_rounds` to the number of tool-calling steps you expect, not including the final answer step.
- **Answer comparison is string-based.** Nested objects and lists are compared through `str()`, so key order and quoting matter. `true` and `1` compare equal (booleans are numbers). Prefer flat string or number fields.
- **The JSON search is greedy.** If the reply has prose with braces before the JSON, the first-to-last-brace candidate may not parse; ask for a bare JSON object.
- **One agent per model is reused across cases** within a run, with a fresh session id per case. State kept outside the session (for example a profile store) can leak between cases.
- **Intent runs never hand off,** so they do not test the target agent. Test the target agent with its own `--agent` run.
- **Unknown model names fail the whole run** with exit code 2 when that model's agent is built, after earlier cases have already run.

# Evals

`evals/` runs JSON case suites against TahoePilot agents and scores each run. ReAct agents (`databot`, `knowledge`) are scored on tool order, ReAct rounds, and JSON answer fields. The lead agent (`lead`) is scored on its decision (answer, clarify, delegate or plan), the specialists it delegates to, and how many delegations it uses.

The CLI is `python -m evals`. Cases live in this repo under `evals/cases/`, so a case change is reviewed with the code it tests.

Related docs:

- [`agent/README.md`](../agent/README.md) — agents, `AgentCatalog`, `AgentListener`, and the lead agent being evaluated.
- [`agent/specialists/databot/README.md`](../agent/specialists/databot/README.md) — Databot behavior that the `databot` cases exercise.
- [`tools/README.md`](../tools/README.md) — tool names that appear in `expected_tools`.
- [`config/README.md`](../config/README.md) — per-agent tool sets and prompts in `config/agents/*.toml`.
- [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) — overall platform layout.

## Concepts

| Term | Meaning |
|------|---------|
| Group | One case file, `evals/cases/<group>.json`. Selected with `--groups`. The group key is the file stem. |
| Suite | A named list of cases inside a group file (any top-level key other than `models`). A file that is a bare JSON list has one suite named `default`. |
| Case | One query plus expectations. Two types: `ToolCallCase` (ReAct agents) and `LeadRoutingCase` (lead agent). Reported as `<group>/<suite>/<name>`. |
| Model fan-out | Each case lists model names from `models/models.toml`. The case runs once per model, each on a fresh session. |
| Case score | Per model run: the equal-weight mean of three dimension scores in `[0, 1]` (`CaseScore.total`). |
| Case average | Mean of a case's per-model scores. A cancelled run counts as 0. |
| Suite average | Mean of case averages across every selected group. Printed as `Average score` and compared with `--fail-under`. |

## Design

- **Repo-local JSON cases.** No external eval service or dataset store; cases are small JSON files next to the harness.
- **Behavior, not only answers.** A ReAct run is judged on which tools were called and in what order, how many reasoning rounds it took, and on structured fields in the reply.
- **Partial credit.** Calling the right tools in the wrong order earns half credit per covered tool instead of zero. Exceeding the round budget lowers the score gradually.
- **Per-model averaging.** Every model in a case counts equally for that case, and every case counts equally for the suite, regardless of how many models it runs on.
- **Same agent construction as production.** Agents are built through `AgentCatalog` with the configured prompts and tools, with an in-memory checkpointer and history compression disabled.

## Layout

| Path | Role |
|------|------|
| `evals/__main__.py` | CLI, agent construction (`create_eval_agent`), default groups |
| `evals/case_base.py` | `BaseCase`, case-file loading, `score_sequence`, `run_case_aggregates`, group aliases |
| `evals/tool_case.py` | `ToolCallCase`, `CaseResult`, `CaseAggregate`, `run_cases`, output formatting |
| `evals/routing_case.py` | `LeadRoutingCase`, `RoutingStub`, `extract_lead_outcome`, `run_routing_cases` |
| `evals/selection_case.py` | `ModelSelectionCase`, `run_selection_cases`, per-arm comparison report and `--out` JSON |
| `evals/answer_match.py` | `score_answer`, `extract_json_object`, `values_equal` |
| `evals/listeners.py` | `EvalReactListener` (records tool calls and reason steps), `CaseScore` |
| `evals/cases/*.json` | Case groups: `databot`, `general`, `knowledge`, `routing`, `tahoe` |

Tests: `tests/test_evals_cases.py`, `tests/test_evals_routing_cases.py`, `tests/test_evals_answer_match.py`.

## How a run works

```
python -m evals --agent A --groups G1 G2
   |
   v
iter_raw_cases: for each group file -> each suite -> each raw case
   |   (file-level "models" is the default for cases without their own)
   v
find_cases / find_routing_cases  -> ToolCallCase | LeadRoutingCase
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

Lead runs (`LeadRoutingCase.run`): the harness swaps the lead's specialists for stubs, runs one turn with `user_id="case_bot"` and `print_output=False`, and classifies the turn with `extract_lead_outcome`. No specialist actually runs.

## Scoring

### Sequence score (`score_sequence`)

Used for tool order and lead routes.

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

### LeadRoutingCase

Scores the lead agent's first decision for a request, not the specialists' work. During the run every specialist is replaced by a `RoutingStub` (the case sets `agent.specialists.get_or_create`), whose `run_as_subagent` records the `SubagentTask` and returns a short `done` result, so the lead finishes its turn without calling real backends.

The three dimensions reuse `CaseScore` fields; the output labels them `decision`, `economy`, `routes`.

| Dimension | Field in `CaseScore` | Rule |
|-----------|----------------------|------|
| Decision | `tool_score` | 1.0 if the classified decision is one of the `expected_decision` values, else 0.0 |
| Economy | `round_score` | 1.0 if the number of delegations is at most `max_delegations`, else 0.0 |
| Routes | `answer_score` | `score_sequence(expected_routes, delegated agent names in call order)` |

`extract_lead_outcome(state)` classifies the current turn's messages:

| Turn | `decision` |
|------|------------|
| `write_plan` was called | `plan` |
| one or more `delegate` calls, no plan | `delegate` |
| no tools and the reply ends with `?` (or `？`) | `clarify` |
| no tools otherwise | `answer` |

`routes` lists the `agent` argument of every `delegate` call in order (including rejected ones, such as a second call in the same AI message).

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

### LeadRoutingCase example

```jsonc
{
  "models": ["MiniMax-M3"],
  "lead": [
    {
      "name": "composite_gmv_definition_then_query",
      "query": "Look up the GMV metric definition in team docs, then query yesterday's GMV from the warehouse.",
      "expected_decision": "plan",                  // required: answer | clarify | delegate | plan
      "expected_routes": ["knowledge", "warehouse"] // specialists in delegation order; [] = none
    },
    {
      "name": "answer_small_talk",
      "query": "hello",
      "expected_decision": "answer",
      "expected_routes": []
    }
  ]
}
```

| Field | Required | Default | Meaning |
|-------|----------|---------|---------|
| `name`, `query`, `models` | as above | | |
| `expected_decision` | yes | | `answer`, `clarify`, `delegate` or `plan`, or a list of accepted values (for example `["answer", "clarify"]` for a greeting); any other value raises `ValueError` |
| `expected_routes` | no | `[]` | Specialist names the lead delegates to, in order |
| `max_delegations` | no | `len(expected_routes) + 1` | Delegations allowed before the economy score drops to 0 |
| `stub_results` | no | `{}` | Per specialist, `{"status", "summary"}` its `RoutingStub` returns instead of the default `done` result (for example a `failed` warehouse run) |

Specialist names are the registered agents that are not front agents (`warehouse`, `knowledge`, `diagnostic`, `data_analysis`, `swe`; not `lead` or `databot`); see [`agent/README.md`](../agent/README.md). Data questions route to `warehouse`.

`.jsonc` comments above are for explanation only. Case files must be plain JSON.

## Agents and default groups

| `--agent` | Case type | Default `--groups` |
|-----------|-----------|--------------------|
| `databot` (default) | `ToolCallCase` | `databot` |
| `knowledge` | `ToolCallCase` | `knowledge` `general` `tahoe` |
| `lead` | `LeadRoutingCase` | `routing` |
| `model_selection` | `ModelSelectionCase` | `model_selection` |

Current groups:

| Group | Suites | Cases | Used for |
|-------|--------|-------|----------|
| `databot` | `catalog` | 1 | DataHub `search` lookup |
| `general` | `default` | 2 | No-tool answers (`arithmetic`, `greeting`; `total_rounds: 0`) |
| `knowledge` | `jira` | 1 | `fetch_related_jira_tickets` with a JSON answer |
| `routing` | `lead` | 15 | One delegation to each specialist (data questions to `warehouse`), plans for multi-specialist requests, direct answers, clarifying questions for ambiguous requests, and a specialist infrastructure error that the lead reports instead of debugging |
| `tahoe` | `planning` | 1 | `planning` tool before replying |

`knowledge_case` is accepted as an alias for the `knowledge` group (`GROUP_ALIASES`).

## Usage

Prerequisites are the same as the main CLI: repo-root `.env` (loaded by `evals/__main__.py`), `models/models.toml`, and whatever backends the agent's tools reach (Trino / Hive, DataHub MCP, Qdrant and the RAG models from [`rag/README.md`](../rag/README.md)). Every case run calls the listed LLMs.

```bash
# default: --agent databot, groups: databot
uv run python -m evals

# pick an agent; groups default per agent
uv run python -m evals --agent knowledge
uv run python -m evals -a lead

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
| `-a` / `--agent` | `databot` \| `knowledge` \| `lead` \| `model_selection` (default `databot`) |
| `--arms` | `model_selection` only: retrieval arms to compare (default `rag catalog hybrid`) |
| `--out` | `model_selection` only: write every run and the per-arm summary to a JSON file |
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

A cancelled run prints `[CANCELLED]` and counts as 0. Lead lines show `decision=`, `economy=`, `routes=` instead, plus the delegation count.

### Exit codes and CI

| Code | When |
|------|------|
| `0` | Run finished and `--fail-under` is unset or met |
| `1` | Suite average is below `--fail-under` |
| `2` | Configuration error: missing group file (`FileNotFoundError`), bad case or unknown model (`ValueError`), agent without listener support (`TypeError`) |

Other exceptions (for example an LLM or backend error during a turn) propagate and end the process with a traceback. In CI, run one agent per job and treat both `1` and `2` as failures:

```bash
uv run python -m evals --agent lead --fail-under 0.9
uv run python -m evals --agent knowledge --fail-under 0.7
```

## Model selection: comparing retrieval tools

`--agent model_selection` measures how well each retrieval setup leads an LLM to
the right dbt model. The `model_selection` agent
([`agent/specialists/model_selection`](../agent/specialists/model_selection/model_selection_agent.py),
`config/agents/model_selection.toml`) only chooses a model: it has no SQL,
schema or query tools, and ends with a JSON choice
(`model`, `alternatives`, `root_id`, `member_id`, `reason`). It is a front agent,
so the lead never delegates to it.

Every case runs once per **arm** (and per LLM), each with only that arm's tools
and workflow prompt:

| Arm | Tools | Workflow |
|-----|-------|----------|
| `rag` | `fetch_related_models` | vector search over the Qdrant dbt index |
| `catalog` | `search_metric_catalog`, `find_models_metrics` | metric root -> member -> assigned models; `null` when the catalog has nothing |
| `hybrid` | all three | catalog first, `fetch_related_models` as fallback (the databot order; warehouse uses the catalog only) |

Case fields (`evals/cases/model_selection.json`):

| Field | Required | Meaning |
|-------|----------|---------|
| `name`, `query`, `models` | as above | |
| `expected_models` | yes | dbt model names a reviewer accepts (string or list; `db.` prefix and case ignored); `[]` means the right answer is `"model": null` |
| `kind` | no | `metric` (default), `lookalike` (a similar-sounding model is wrong), `entity` (columns or entities, not a metric) or `out_of_corpus` (no model answers; `expected_models: []`); the report breaks selection down by kind |
| `max_tool_calls` | no | economy budget, default 4 |
| `notes` | no | why the gold models were picked |

Scores per run, each `0`-`1`, total is their mean:

| Dimension | Rule |
|-----------|------|
| `selection` | the chosen model is in `expected_models` |
| `recall` | an expected model was among the staged candidates, so a miss is a retrieval miss (recall 0) or a choice miss (recall 1) |
| `economy` | tool calls within `max_tool_calls`, `1 - over / budget` above it |

After the per-run lines the CLI prints a case x arm matrix of chosen models
(`*` = accepted) and a per-arm table: selection, recall, economy, mean tool
calls, mean staged candidates, mean seconds and average total.

```bash
uv run python -m evals -a model_selection
uv run python -m evals -a model_selection --arms rag hybrid --out /tmp/selection.json
```

`expected_models: []` marks a question no model answers: the run is correct
only when the agent replies `"model": null`. Each finished run is appended to
`<out>.partial.jsonl`, and a crashed run is recorded as a miss with its error.

Report and re-score (stored replies against the current cases and parser, no
new LLM calls):

```bash
uv run python -m evals.selection_report --rescore evals/results/model_selection_69_*.json
```

Results and analysis of the 69-case run: [`MODEL_SELECTION_EVAL.md`](MODEL_SELECTION_EVAL.md).

The `rag` and `hybrid` arms need Qdrant and the embedding models; the
`catalog` arm only reads `tools/data/lib`. A gold model missing from the Qdrant
index can never be found by `rag`: check `recall` before blaming the choice.

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
- **Lead runs stub every specialist,** so they test only the lead's choice, not the specialists' work or what the lead writes from real results. Test a specialist with its own `--agent` run.
- **`clarify` is detected from punctuation.** A reply without tools that ends with a question mark counts as `clarify`; an answer that happens to end with a question scores as `clarify` too.
- **Unknown model names fail the whole run** with exit code 2 when that model's agent is built, after earlier cases have already run.

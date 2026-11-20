# Evals

`evals/` runs JSON case batches against TahoePilot agents and scores each run. Every agent is evaluated by the same framework: one case type, one runner, and a set of checks that each case turns on with its expectation keys.

The CLI is `python -m evals`. Cases live in this repo under `evals/cases/`, so a case change is reviewed with the code it tests.

Related docs:

- [`agent/README.md`](../agent/README.md) — agents, `AgentCatalog`, `AgentListener`, and the lead agent.
- [`agent/specialists/databot/README.md`](../agent/specialists/databot/README.md) — Databot behavior.
- [`tools/README.md`](../tools/README.md) — tool names that appear in `expected_tools`.
- [`config/README.md`](../config/README.md) — per-agent tool sets and prompts in `config/agents/*.toml`.

## Concepts

| Term | Meaning |
|------|---------|
| Agent folder | `evals/cases/<agent>/`. The folder name is the agent under test (`--agent`). |
| Batch | One file, `evals/cases/<agent>/<objective>.json`: a batch of cases with one objective, e.g. `knowledge/not_in_catalog.json`. Selected with `--groups`; by default every batch of the agent runs. |
| Case | One query plus expectations. There is one case type, `EvalCase`; reported as `<agent>/<batch>/<name>`. |
| Check | One scored dimension in `[0, 1]`, turned on by an expectation key in the case (see [Checks](#checks)). |
| Variant | A batch-level run option: the case runs once per variant, each with its own agent built from different `run_context` overrides (e.g. the retrieval arms of `model_selection`). |
| Model fan-out | Each case lists LLM names from `config/models.toml`; it runs once per LLM (and variant), each on a fresh session. |
| Run score | Mean of the run's checks. A cancelled or crashed run scores 0. |
| Case average | Mean over the case's LLM runs, per variant. |
| Suite average | Mean of the case averages. Printed as `Average score` and compared with `--fail-under`. |

## Layout

| Path | Role |
|------|------|
| `evals/__main__.py` | CLI and agent construction (`create_eval_agent`) |
| `evals/case.py` | `EvalCase`, `BatchRun`, loading `cases/<agent>/<batch>.json` |
| `evals/checks.py` | The checks, `score_sequence`, load-time validation |
| `evals/runner.py` | `run_turn` (listener, specialist stubs), `RunRecord`, `run_cases`, `extract_lead_outcome` |
| `evals/report.py` | CLI lines, per-variant summary, case × variant matrix, `--out` JSON |
| `evals/answer_match.py` | JSON reply parsing and value matching for the `answer` check |
| `evals/listeners.py` | `EvalReactListener` (tool calls and reason steps of a turn) |
| `evals/timing.py` | `EvalTimer` (LangChain callback): wall time plus every model and tool call, by stage and by tool; reported, not scored |
| `evals/selection_report.py` | Markdown report and re-scoring of `--out` files (paired variant comparison) |
| `evals/cases/<agent>/*.json` | The batches |
| `evals/results/<agent>/` | Finished runs of that agent's evals: `--out` JSON files (and their `.partial.jsonl`) plus a `README.md` write-up of what was run and found |

Tests: `tests/test_evals_framework.py`, `tests/test_evals_answer_match.py`, `tests/test_evals_knowledge_cases.py`, `tests/test_model_selection_eval.py`.

## Batches

| Agent | Batch | Cases | Objective |
|-------|-------|-------|-----------|
| `warehouse` | `find_table` | 52 | Golden queries: the table that answers a data question, described by grain, filters and purpose (22 of 71 also name a look-alike to avoid). Warehouse answers directly, without the SQL review gate, as `{"models_selected": ["<db>.<table>"], "proposed_sql": ["..."]}` (empty lists when it cannot tell). Scores the selected source, that the proposed SQL reads the right table and compiles on Trino (EXPLAIN only), that the table was found, that no gate tool was used, and a 12-call budget |
| `warehouse` | `find_metric` | 19 | As `find_table`, for a metric: `models_selected` holds `<db>.<table>.<metric>` |
| `knowledge` | `metric_definition` | 12 | Metric definitions from the metric catalog: `search_metric_catalog` → `describe_metric_models`; scores `root_id`, `member_id` and an accepted `model` (lookalike members, a Chinese query) |
| `knowledge` | `not_in_catalog` | 1 | A metric not in the catalog: stop after two catalog searches and answer `null` |
| `knowledge` | `lineage_dag` | 7 | The Airflow DAG (and task) that produces a table, from DataHub lineage |
| `knowledge` | `lineage_upstream` | 4 | A table's upstream tables (extra upstreams allowed) |
| `knowledge` | `lineage_dag_tables` | 2 | The tables a DAG produces (all expected tables listed) |
| `knowledge` | `lineage_downstream` | 2 | Downstream consumers; no gold yet, tools and rounds only |
| `knowledge` | `jira_lookup` | 1 | Past work from Jira with the right ticket key |
| `knowledge` | `direct_answer` | 2 | Simple questions answered without tools |
| `knowledge` | `planning_tool` | 1 | A multi-step request planned with the planning tool |
| `lead` | `route_to_specialist` | 8 | A single-specialist request is delegated once, to the right specialist |
| `lead` | `route_metric_questions` | 8 | Definitions, formulas, which-model → knowledge; numbers → warehouse; define-then-query → plan |
| `lead` | `route_lineage_questions` | 5 | Upstream, downstream, DAG-of-table, tables-of-DAG → knowledge; a failed DAG → diagnostic |
| `lead` | `plan_multi_specialist` | 2 | Several specialists in sequence start with a plan |
| `lead` | `answer_directly` | 2 | Small talk and capability questions are answered directly |
| `lead` | `clarify_ambiguous` | 2 | An ambiguous request gets a clarifying question |
| `lead` | `report_specialist_error` | 1 | A specialist's infrastructure error is reported, not debugged |
| `model_selection` | `metric`, `lookalike`, `entity`, `out_of_corpus` | 41, 14, 7, 7 | Pick the dbt model for a data question, per retrieval variant (`rag`, `catalog`, `hybrid`) |

The lineage gold comes from `semantic_models` `config.meta` (`dag`, `task`, `upstream_table`) because DataHub was unreachable when the cases were written; each case's `notes` says to verify it against DataHub.

## Batch file

```jsonc
{
  "description": "A metric that is not in the catalog: answer null instead of guessing.",
  "models": ["MiniMax-M3"],                       // default LLMs for every case
  "run": {                                         // optional
    "stub_specialists": true,                      // record delegations, run no specialist (lead)
    "gate_reply": "approve",                       // answer every human gate with this reply
    "variants": {"rag": {"retrieval": "rag"}}      // run once per variant with these run_context overrides
  },
  "defaults": {"total_rounds": 4},                 // merged under every case
  "cases": [
    {
      "name": "not_in_catalog",                    // unique in the batch
      "query": "What is our NPS ...? Reply with a single JSON object ... {\"root_id\": ...}",
      "expected_tools": ["search_metric_catalog"],
      "total_rounds": 3,
      "answer": {"root_id": null, "member_id": null, "model": null},
      "notes": "why the gold is what it is"         // optional; also "kind", "models", "stub_results"
    }
  ]
}
```

A file may also be a bare list of cases. Every case needs `name`, `query`, `models` (its own or the batch default) and at least one expectation. Unknown keys, bad expectation shapes and duplicate names fail at load time with exit code 2, before any LLM call. `.jsonc` comments above are for explanation only.

| Case field | Meaning |
|------------|---------|
| `name`, `query`, `models` | As above |
| `kind` | Free label; the model-selection report breaks results down by it |
| `notes` | Why the gold was chosen |
| `reference_sql` | SQL that answers the question; kept with the gold, not scored |
| `stub_results` | With `stub_specialists`: per specialist, the `{"status", "summary"}` its stub returns (e.g. a `failed` warehouse run) |
| expectation keys | See [Checks](#checks) |

## Checks

A case runs only the checks whose keys it sets; its score is their mean.

| Key | Check | Score |
|-----|-------|-------|
| `expected_tools` | `tools` | `score_sequence(expected, tool calls in order)`: 1.0 for an ordered subsequence, `0.5 × coverage` for the right tools in the wrong order; `[]` means no tool may be called |
| `total_rounds` | `rounds` | Tool-calling reason steps (the final answer step is not a round). `0` expects a direct answer (0 rounds → 1.0, any → 0.0). Otherwise 0 rounds → 0.0, within budget → 1.0, above → `1 - over / budget` |
| `answer` | `answer` | Share of expected JSON keys whose value matches in the reply (see below). `{}` turns it off |
| `expected_decision` | `decision` | 1.0 if the turn's first move is one of the values: `answer`, `clarify`, `delegate`, `plan` |
| `expected_routes` | `routes` | `score_sequence(expected, delegated specialists in order)` |
| `expected_routes` / `max_delegations` | `delegations` | 1.0 if delegations ≤ `max_delegations` (default: expected routes + 1) |
| `expected_models` | `selection` | The reply's `model` (`db.` prefix and case ignored) is one of them; `[]` expects `"model": null` |
| `expected_models` | `recall` | An expected model was among the staged candidates; left out when `expected_models` is `[]` |
| `max_tool_calls` | `economy` | Tool calls within budget, `1 - over / budget` above it |
| `allowed_tools` / `forbidden_tools` | `tool_policy` | 0 if any call is outside `allowed_tools` or in `forbidden_tools`, else 1 |
| `expected_tables` | `tables` | `score_sequence` over the tables the turn settled on, by model name: Databot's cards (approved, else review, else committed); Warehouse's reviewed-SQL tables, else the models it staged |
| `expected_reply` | `reply` | The trimmed reply equals this string exactly (the query states the format) |
| `expected_sql_tables` | `sql_tables` | Share of the expected tables that the reply's `proposed_sql` reads (FROM / JOIN, catalog prefix ignored) |
| `expect_sql_compiles` | `sql_compiles` | Share of the reply's `proposed_sql` statements that Trino can plan with `EXPLAIN`; nothing is executed |
| `expect_sql_runs` | `sql_runs` | The approved SQL executed without error (Databot `execution_result`, Warehouse `execution`); `false` expects it not to run |

First move (`decision`), from the turn's messages: `plan` if the first tool batch calls `write_plan`; `delegate` if it (or a later step) delegates; `clarify` if no tools and the reply ends with `?`; else `answer`.

### Answer matching

The reply is searched for a JSON object: the first fenced ```` ```json ```` block, then the whole reply if it starts with `{`, then the first-to-last-brace span. No object → 0.0 with `parse error`. Each expected key then matches when:

| Expected | Rule |
|----------|------|
| number | Numeric equality (`"3"` matches `3`) |
| string | Stripped, case-folded equality; `""` matches any value |
| `null` | The reply's value is `null` (or `""`, `"null"`, `"none"`) |
| list, reply scalar | The value is one of the items (several acceptable answers) |
| list, reply list | Every expected item is in the reply's list, any order, extras allowed |

## How a run works

```
python -m evals --agent A [--groups B1 B2] [--variants V] [--run-context k=v]
   |
   v
load_cases(A, batches): cases/A/<batch>.json -> EvalCase (validated)
   |
   v
run_cases: for case -> for variant -> for LLM
     agent = cache[(LLM, run_context, stub mode)] or create_eval_agent(A, LLM, run_context)
     record = run_turn(case, agent)        # listener + timer attached, stubs / gate replies if requested
     run = score_run(case, record)         # the case's checks; crash or cancel = 0
   case average per variant = mean over LLMs; suite average = mean over case averages
   |
   v
print each run; with several variants a case × variant matrix and a per-variant table;
--out writes every run plus the summary (and <out>.partial.jsonl while running)
```

A turn runs with `user_id="case_bot"` (or `--user-id`) and `print_output=False`. With `[trino].user_identity = "impersonate"`, Trino runs the SQL as that user. A run that raises is recorded with its error (score 0) and the eval goes on.

## Usage

Prerequisites are the same as the main CLI: repo-root `.env` and the secrets file, `config/models.toml`, and whatever backends the agent's tools reach (Trino / Hive, DataHub, Qdrant and the RAG models). Every run calls the listed LLMs.

```bash
# every batch of an agent
uv run python -m evals --agent knowledge
uv run python -m evals -a lead

# chosen batches
uv run python -m evals -a knowledge -g not_in_catalog metric_definition

# variants (model_selection) and extra run_context
uv run python -m evals -a model_selection --variants rag hybrid --out evals/results/model_selection/<date>_<label>.json
uv run python -m evals -a model_selection --run-context rag_collection=metric_catalog_models

# discover batches and models (no LLM calls)
uv run python -m evals --list-groups
uv run python -m evals --list-models

# gate on the suite average
uv run python -m evals -a knowledge --fail-under 0.8
```

| Flag | Meaning |
|------|---------|
| `-a` / `--agent` | Agent folder under the cases dir (default `databot`) |
| `-g` / `--groups` | Batch names in that folder; default all |
| `-m` / `--models` | LLMs to run every case on, replacing the cases' own `models` |
| `--user-id` | `user_id` of every turn (default `case_bot`) |
| `--cases-dir` | Directory holding `<agent>/<batch>.json` (default `evals/cases`) |
| `--variants` / `--arms` | Run only these variants of batches that define `run.variants` |
| `--run-context KEY=VALUE` | Extra `run_context` for every agent built (repeatable); `--rag-collection NAME` is a shortcut |
| `--out` | Write every run and the per-variant summary to a JSON file; keep runs worth keeping in `evals/results/<agent>/` |
| `--fail-under` | Exit `1` when the suite average is below this value |
| `--list-groups` / `--list-cases` / `--list-models` | Print `<agent>/<batch>`, the cases of `--agent` (and `--groups`), or model names, and exit |

### Output

```
[1.00] knowledge/not_in_catalog/not_in_catalog model=MiniMax-M3 (tools=1.00 rounds=1.00 answer=1.00)
  tools: expected=['search_metric_catalog'] actual=['search_metric_catalog', 'search_metric_catalog'] (ordered match)
  rounds: expected<=3 actual=2
  answer: all keys match
Average score: 1.000 (1 case(s), 1 run(s))
```

Every run also prints its timing, e.g. for a Databot turn (by stage = pipeline layer):

```
  timing: wall=61.9s model=48.9s/11 calls tools=12.9s/11 calls
    by stage: layer_prepare_cards model=21.6s tools=0.0s | layer_prepare_sql model=22.6s tools=5.9s | ...
    by tool: trino_run_query 1x 6.9s (max 6.9s), trino_explain 2x 4.0s (max 2.2s), ...
```

Exit codes: `0` finished (and `--fail-under` met), `1` below `--fail-under`, `2` configuration error (missing batch, bad case, unknown model). In CI run one agent per job and treat `1` and `2` as failures.

## Results

Runs worth keeping go in `evals/results/<agent>/`, next to the agent's cases folder:

- the `--out` JSON (`<date>_<label>.json`) and its `.partial.jsonl`;
- a `README.md` per agent: what was run (batches, LLMs, date, backends), the scores per batch, what failed and why, and what changed because of it.

| Results | Write-up |
|---------|----------|
| `evals/results/model_selection/` | [Semantic search vs. metric catalog](results/model_selection/README.md) |
| `evals/results/knowledge/` | [Metric and lineage questions](results/knowledge/README.md) |
| `evals/results/lead/` | [Routing metric and lineage questions](results/lead/README.md) |
| `evals/results/warehouse/` | [Golden table and metric queries](results/warehouse/README.md) |

## Model selection: comparing retrieval tools

`--agent model_selection` measures how well each retrieval setup leads an LLM to the right dbt model. The `model_selection` agent ([`agent/specialists/model_selection`](../agent/specialists/model_selection/model_selection_agent.py), `config/agents/model_selection.toml`) only chooses a model and ends with a JSON choice (`model`, `alternatives`, `root_id`, `member_id`, `reason`). It is a front agent, so the lead never delegates to it.

Its batches define three variants, each with only that arm's tools and workflow prompt:

| Variant | Tools | Workflow |
|---------|-------|----------|
| `rag` | `fetch_related_models` | vector search over the Qdrant dbt index |
| `catalog` | `search_metric_catalog`, `find_models_metrics` | metric root → member → assigned models; `null` when the catalog has nothing |
| `hybrid` | all three | catalog first, `fetch_related_models` as fallback |

Cases use `expected_models` (→ `selection`, `recall`), `max_tool_calls` (→ `economy`, default 4 in the batch `defaults`) and `kind`. With several variants the CLI prints a case × variant matrix of chosen models (`*` = accepted) and a per-variant table of every check's mean, tool calls, seconds and average.

Report and re-score stored replies against the current cases and parser (no new LLM calls):

```bash
uv run python -m evals.selection_report --rescore evals/results/model_selection/69_*.json
```

Results and analysis of the 69-case run: [`results/model_selection/README.md`](results/model_selection/README.md). The `rag` and `hybrid` variants need Qdrant and the embedding models; `catalog` only reads `config/metrics/`.

## Adding cases

1. Pick the agent folder and the batch whose objective the case tests, or create `evals/cases/<agent>/<objective>.json` (it is picked up automatically and runs by default).
2. Give the case a `name`, `query` and the expectation keys for what it should be scored on; put shared expectations in the batch `defaults`.
3. Use tool names exactly as registered (see [`tools/README.md`](../tools/README.md) and `config/agents/<agent>.toml`).
4. When `answer` is set, tell the model in `query` to reply with a single JSON object of that shape.
5. Run `--list-groups`, then the batch with one cheap model.

A new kind of evaluation is a new check in `evals/checks.py` (a function plus its trigger key in `CHECKS`), not a new case class.

## Pitfalls

- **`expected_tools: []` means "no tools".** Any tool call then scores 0 on `tools`. Leave the key out to not check tools.
- **No-tool cases need `total_rounds: 0`.** A direct answer has 0 tool-calling rounds; with a budget of 1 or more it scores 0 on `rounds`.
- **Rounds are tool-calling rounds,** not LLM calls; the final answer step does not count.
- **Answer comparison is string-based** for scalars; prefer flat string or number fields, and lists only with the list rules above.
- **One agent is reused** across cases for the same LLM, run_context and stub mode, with a fresh session per case; state outside the session (a profile store) can leak between cases.
- **`stub_specialists` tests only the lead's choice,** not the specialists' work. Test a specialist with its own agent folder.
- **`clarify` is detected from punctuation.** A no-tool reply ending with `?` counts as `clarify`.

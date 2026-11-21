# Model selection evaluation: semantic search vs. metric catalog

How well does each way of finding warehouse tables lead an LLM to the right dbt
model? This document records why we measured it, how, and what we found.

- Date: 2026-11-18
- LLM: MiniMax-M3 (one model, one run per case and arm)
- Cases: [`evals/cases/model_selection/`](../../cases/model_selection/) (`metric`, `lookalike`, `entity`, `out_of_corpus`; 69 cases)
- Raw results (this folder): [`69_rag.json`](69_rag.json),
  [`69_catalog_hybrid.json`](69_catalog_hybrid.json); an earlier run: [`2026-11-18.json`](2026-11-18.json)
- Reproduce: see [How to re-run](#how-to-re-run)

## 1. Motivation

Data questions in TahoePilot are answered in two steps: choose the table (dbt
model), then write SQL against it. A wrong table gives a wrong number even with
perfect SQL, and the error is hard to spot because the query still runs.

Until now the agents found tables with **semantic search**
(`fetch_related_models`): vector search over the dbt model descriptions indexed
in Qdrant. It covers every indexed hive model and also answers column and
entity questions. Its ranking follows text similarity, though, so a question
can surface a table that *mentions* the metric but measures a different variant,
for example `fct_dau_w_bots` (keeps bot and guest traffic) above `fct_dau` for
"DAU excluding bots".

The repo now has a curated **metric catalog** (`tools/data/lib`): 75 metric roots,
455 members (exact variants such as with/without Limited Time Deals, distinct
users vs. user-days) and a mapping from 39 dbt models' metrics to
`(root_id, member_id)` with a `related_ratio`. Two tools use it:
`search_metric_catalog` (resolve the question to a root and member) and
`find_models_metrics` (stage the models assigned to that pair).

The expectation was **higher precision, lower coverage**. Before changing which
tool the agents rely on, we wanted numbers:

1. Does the catalog pick the right table more often than semantic search?
2. Where exactly do they differ?
3. What does each cost in tool calls and time?
4. What happens when nothing in the corpus fits the question?

An earlier pass with 8 hand-written cases (see `docs/CHAT_OPTIMIZATION.md`,
"Model selection eval") showed a difference on a single case, which is too thin
to act on. This run uses 69 cases.

## 2. What is compared

A dedicated, eval-only agent, `model_selection`
(`agent/specialists/model_selection`, `config/agents/model_selection.toml`),
receives a data question and must answer with one JSON object:

```json
{"model": "<dbt model or null>", "alternatives": [], "root_id": null,
 "member_id": null, "reason": "<grain, dimensions, metric definition>"}
```

It never writes SQL or queries data, so a run measures table choice only. The
lead agent never delegates to it.

The same agent runs in three **arms**. Each arm gets only its own tools and its
own workflow section in the prompt; the choosing rules and output format are
shared.

| Arm | Tools | Workflow |
|-----|-------|----------|
| `rag` | `fetch_related_models` | semantic search, up to two re-phrasings |
| `catalog` | `search_metric_catalog`, `find_models_metrics` | root → member → assigned models; `null` if nothing fits |
| `hybrid` | all three | catalog first, semantic search as fallback (databot's order) |

Shared choosing rules: compare candidates on description, grain, dimensions,
time column and metric definition; `related_ratio` and search score are
preferences, not the decision; answer `null` when no candidate measures what is
asked.

**Same corpus for every arm.** The production Qdrant collection
(`aug_dbt_models`) was built on 2026-10-08 and is missing 25 of the 39 catalog
models (everything under `wish/` and `wishpost/`). Comparing against it would
measure index staleness, not retrieval quality. The 39 models were therefore
ingested into a new collection, `metric_catalog_models` (5,234 points), and the
`rag` and `hybrid` arms search only that collection
(`--rag-collection metric_catalog_models`). All three arms see exactly the same
39 models.

## 3. Cases

69 questions in four kinds. Gold answers were judged per question from the
member definitions and each model's grain and columns, not copied from the
catalog's assignment lists (see [Threats to validity](#6-threats-to-validity)).

| Kind | Cases | What it tests |
|------|-------|---------------|
| `metric` | 41 | Plain metric questions across all business areas: GMV, orders, buyers, ATV, take rate, refunds, ratings, delivery, inventory, users, FX, ERP, WishPost P&L and fee breakdowns, merchant attributes, Product Boost |
| `lookalike` | 14 | A sibling table is the trap: bots vs. no bots, guests vs. registered, ULC-active vs. same-day DAU, merchant accounts vs. merchants, SKUs vs. products, refund lines vs. refunded orders, buyer-paid shipping vs. WishPost logistics fees, merchant COGS vs. logistics cost |
| `entity` | 7 | "Which table has X" questions with no metric (merchant profile, product attributes, order tracking, user profile, ERP call log, experiment metrics) |
| `out_of_corpus` | 7 | No model among the 39 answers it (ad spend, support tickets, search queries, push opens, headcount, app latency, Product Boost budgets). The correct answer is `null` |

Each case lists every model a reviewer would accept (`expected_models`), so a
question answerable from either the line-level fact or a daily rollup accepts
both. `notes` explain the trap for look-alike cases.

## 4. Scoring

Per run (one case, one arm), each in `[0, 1]`:

| Dimension | Rule |
|-----------|------|
| **selection** | chosen model is in `expected_models`; for `out_of_corpus`, the agent answered with JSON and `"model": null` |
| **recall** | an accepted model was among the staged candidates at all. Separates a retrieval miss (recall 0) from a choice miss (recall 1, selection 0). Not counted for `out_of_corpus` |
| **economy** | tool calls within the budget of 4; `1 - over/4` above it |

Also recorded: number of tool calls, staged candidates, wall-clock seconds,
replies without a JSON answer, crashed runs.

Selection is the headline. Arms are compared **paired on the same cases**
(wins / losses / ties) with an exact two-sided sign test on the discordant
cases; with one run per case this is the honest way to ask whether a difference
is more than noise.

## 5. Results (2026-11-18)

All three arms ran all 69 cases once with MiniMax-M3 on the 39-model corpus.
Scores are after re-scoring stored replies with the fixed answer parser and the
corrected gold labels (`--rescore`; see 5.3).

### 5.1 Overall

| Arm | Runs | Selection | Recall | Economy | Mean tool calls | Mean candidates | Mean seconds |
|-----|------|-----------|--------|---------|-----------------|-----------------|--------------|
| catalog | 69 | 1.00 (69/69) | 1.00 | 0.89 | 3.7 | 2.1 | 15.0 |
| hybrid | 69 | 1.00 (69/69) | 1.00 | 0.88 | 4.0 | 4.8 | 76.8 |
| rag | 69 | 0.97 (67/69) | 1.00 | 0.77 | 4.0 | 9.6 | 131.6 |

Seconds are not comparable across arms: `catalog` and `hybrid` ran in one
process while `rag` ran in another, and both used the BGE-M3 embedder and
reranker on the same laptop GPU. `catalog` makes no embedding calls, so it was
barely affected; `rag`'s look-alike, entity and out-of-corpus cases ran after
the other process had finished and averaged 62–138 s instead of 162 s for the
metric cases. In the 8-case run, with one process, `rag` averaged 78 s and
`catalog` 17 s.

### 5.2 By case kind

Correct selections / runs:

| Kind | catalog | hybrid | rag |
|------|---------|--------|-----|
| metric | 41/41 | 41/41 | 40/41 |
| lookalike | 14/14 | 14/14 | 13/14 |
| entity | 7/7 | 7/7 | 7/7 |
| out_of_corpus | 7/7 | 7/7 | 7/7 |

Cost by kind (mean tool calls / runs over the 4-call budget / mean candidates):

| Kind | catalog | hybrid | hybrid runs that fell back to search | rag |
|------|---------|--------|--------------------------------------|-----|
| metric | 3.2 / 1 / 2.1 | 3.5 / 1 / 2.9 | 16 of 41 | 3.8 / 10 / 8.5 |
| lookalike | 3.0 / 0 / 2.4 | 3.5 / 1 / 3.6 | 5 of 14 | 3.5 / 3 / 7.4 |
| entity | 3.7 / 1 / 2.0 | 3.6 / 2 / 4.1 | 5 of 7 | 2.9 / 1 / 7.6 |
| out_of_corpus | 8.4 / 7 / 1.4 | 8.4 / 7 / 19.6 | 7 of 7 | 7.6 / 6 / 21.9 |

Paired comparison (exact sign test on discordant cases):

| Comparison | Cases | Wins | Losses | Ties | p |
|------------|-------|------|--------|------|---|
| catalog vs hybrid | 69 | 0 | 0 | 69 | 1.00 |
| catalog vs rag | 69 | 2 | 0 | 67 | 0.50 |
| hybrid vs rag | 69 | 2 | 0 | 67 | 0.50 |

The two cases where the arms disagree, both lost by `rag`:

| Case | catalog / hybrid | rag | Why `rag` missed |
|------|------------------|-----|------------------|
| `dau_yesterday_without_bots` (lookalike) | ✓ `fct_dau` | ✗ `fct_dau_w_bots` | Took the `good_dau` metric (users with a click or add-to-cart) to mean "excluding bots". Choice miss: `fct_dau` was among its candidates |
| `merchant_ticket_response_time` (metric) | ✓ `commerce_merchant` | ✗ `null` | Saw only `ticket_handling_state` in the search hit and concluded no model has response times. Choice miss: `commerce_merchant`, which has `avg_ticket_response_time_seconds`, was its top candidate |

### 5.3 Corrections made while reviewing results

Four raw misses (two `catalog`, two `rag`) turned out to be measurement errors:
one parser bug and two gold labels. All were fixed before the numbers above:

- **Answer parser.** `catalog` raw selection was 0.97: two replies
  (`warehouse_shipping_option_price`, `merchant_profile_table`) scored as "no
  JSON". MiniMax-M3 puts a `<think>` block with braces of its own before the
  answer, and the first-to-last-brace extraction grabbed the wrong span. The
  answers inside were correct (`master_warehouse_shipping`, `commerce_merchant`).
  `parse_selection` now drops `<think>` blocks and falls back to the last
  balanced object with a `model` key.
- **A gold label.** For `orders_yesterday` `rag`
  chose `fct_daily_buyer`, which the gold list did not accept. Its
  per-buyer-day transaction count sums to total checkouts, so it does answer the
  question; the label was widened and the change is noted in the case.

- **A second gold label.** For `parcel_combine_ratio` `rag` chose
  `finance_monthly_profits_1y`, which the gold list did not accept. That table
  has an `avg_combination_ratio` metric (`pre_tracking_id_cnt /
  post_tracking_id_cnt`) across all WishPost programs, so it answers the
  question; `finance_monthly_profits_by_combine_ratio_1y` covers the
  warehouse-combination programs only. The label was widened and the change is
  noted in the case. Without it `rag` would score 66/69.

All corrections were applied to all arms by re-scoring the stored replies; no
run was repeated. Two of the three label fixes favoured `rag`, which is the
point of reviewing every miss rather than only the arm's own misses.

### 5.4 Findings

1. **On accuracy the arms are close.** On this corpus every arm put an accepted
   model among its candidates on every case (recall 1.00); `rag` then chose
   wrong twice, `catalog` and `hybrid` never. 2–0 is not significant (p = 0.5),
   so the evaluation does not show that the catalog chooses better. Both `rag`
   misses were choice misses on a misread column or metric, the kind of
   mistake the catalog avoids by handing the LLM the matched metric definition.
2. **The catalog does the same job with far less input.** It shows the LLM 2.1
   candidates on average against 9.6 for `rag`, stays within the 4-call budget
   on 60 of 69 cases against 49 of 69, and makes no embedding or reranker calls.
   This is the clear, measurable difference.
3. **Look-alike traps were mostly not traps.** `rag` passed 13 of 14: with full
   model descriptions in front of it, the LLM usually reads "bots excluded",
   "guests" or "per SKU" correctly. The catalog's `not_a` field made it 14 of 14.
4. **Every arm says "no" correctly, but at a price.** All 7 out-of-corpus cases
   were answered `null` by every arm, after 7.6–8.4 tool calls (20 of 21 runs
   over budget). The catalog arms keep trying other roots; `rag` keeps
   rephrasing. Warehouse uses the catalog tools in production, so a "nothing
   fits" question costs it about 8 calls before it reports.
5. **`hybrid`'s fallback adds cost, not accuracy.** It tied `catalog` on all 69
   cases, yet called `fetch_related_models` in 33 of them, including 16 of 41
   metric cases the catalog covers. On this corpus, where the catalog covers
   every model, the fallback only matters for models the catalog lacks (see 6).

**What this means for the agents.** The catalog-first order in databot and
catalog-only warehouse are supported: same accuracy, about a quarter of the
candidates, fewer calls. The two changes the data points to are a tighter
fallback rule for databot (fall back only when the catalog has no fitting root
or stages nothing) and a cap on "nothing fits" retries.

### 5.5 Bug found by the evaluation

The first `catalog`/`hybrid` run crashed: the model called two retrieval tools in
one step and both returned `staging_cards`, which LangGraph rejects
(`InvalidUpdateError: Can receive only one value per step`). The same crash
could happen in production in databot's fetch stage and in warehouse. Fixed with
a merge reducer on `staging_cards` (`staging_cards_reducer`, union by
`staging_id`) in the databot fetch loop, warehouse and model_selection. In the
finished `catalog` run, 8 of 69 runs made more than one `find_models_metrics`
call and would have been exposed. The runner now records a crashed run as a
miss and continues, and writes each finished run to a `.partial.jsonl` file.

## 6. Threats to validity

- **Gold labels and the catalog share an author's view.** The gold answers were
  judged from the catalog's member definitions and the model descriptions, the
  same material the catalog arm reads. This favours `catalog`. A table owner
  should review the gold labels, especially where several models are accepted.
- **Small corpus.** With only 39 models, semantic search has few distractors.
  The production index has several hundred models; `rag` precision there will be
  lower, and the catalog's coverage gap (questions outside the 39) will matter
  more. This evaluation measures choice quality on covered data, not coverage.
- **One LLM, one run per case.** No variance estimate; MiniMax-M3 only.
- **Case wording.** Questions were written by the evaluator and are cleaner than
  real user questions (no typos, no mixed languages, no vague time ranges).
- **Timing.** Two eval processes shared one laptop GPU for most of the run;
  seconds are not comparable across arms.
- **Ceiling effect.** Two arms scored 69/69, so the cases cannot tell them
  apart. Harder cases (vaguer wording, metrics split across several models) are
  needed to measure a difference in choice quality.

## 7. Next steps

- Tighten `hybrid`'s fallback rule: fall back only when the catalog has no
  fitting root or stages nothing, not as a second opinion (33 of 69 runs fell
  back with no change in the answer).
- Have a table owner review the gold labels.
- Re-run with a second LLM and 2–3 repeats per case.
- Cap the "nothing fits" search: after two catalog lookups that find no fitting
  root, answer instead of trying more roots.
- Run `rag` once against the full production index (`aug_dbt_models`, after
  re-ingesting the missing `wish/` and `wishpost/` models) to measure coverage.

## How to re-run

```bash
# both runs use the 39-model collection so every arm sees the same corpus
uv run python -m evals -a model_selection --arms rag \
  --rag-collection metric_catalog_models --out evals/results/model_selection/69_rag.json
uv run python -m evals -a model_selection --arms catalog hybrid \
  --rag-collection metric_catalog_models --out evals/results/model_selection/69_catalog_hybrid.json

# merged report (accepts the .partial.jsonl files of an unfinished run too);
# --rescore re-scores stored replies with the current parser and gold labels
uv run python -m evals.selection_report --rescore evals/results/model_selection/69_*.json
```

The `rag` and `hybrid` arms need Qdrant (`metric_catalog_models`) and the local
BGE-M3 embedding and reranker models.

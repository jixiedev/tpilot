# Warehouse evals: golden table and metric queries

Given a data question, can Warehouse name the table (or the metric on that
table) that answers it and write a read-only Trino SQL query for it?

- Date: 2026-11-20
- LLM: MiniMax-M3 (one run per case)
- Cases: [`evals/cases/warehouse/`](../../cases/warehouse/). There are 71 cases:
  - 52 in `find_table` (which table answers the question);
  - 19 in `find_metric` (which metric on which table answers it).

  They were ported from the `ci-add-golden-query-benchmark` branch.
- Raw results: [`2026-11-20_golden_queries.json`](2026-11-20_golden_queries.json)
  (baseline) and [`2026-11-20_golden_queries_explain_rule.json`](2026-11-20_golden_queries_explain_rule.json)
  (after the EXPLAIN rule; see [Optimization log](#optimization-log)), each with its `.partial.jsonl`
- Backends:
  - DataHub GMS was reached through `kubectl port-forward deploy/datahub-gms 8080:8080`.
  - Trino ran as `case_bot`, used for `trino_desc_table`, `trino_explain` and the scoring EXPLAINs only.
  - No query was executed.

```bash
uv run python -m evals -a warehouse \
  --out evals/results/warehouse/2026-11-20_golden_queries.json
```

## Setup

Each case asks the original golden question. It then tells Warehouse not to
request SQL approval and not to run SQL. Instead it must reply with one JSON
object:

```json
{"models_selected": ["<database>.<table>"], "proposed_sql": ["<one read-only Trino query>"]}
```

`find_metric` asks for `<database>.<table>.<metric>`. If Warehouse can't
determine an answer, it leaves both lists empty. The gate tools
(`request_sql_approval`, `run_sql`) are `forbidden_tools`, and
`gate_reply: stop` is a safety net.

| Check | What it scores |
|-------|----------------|
| `answer` | `models_selected` contains the gold table or metric |
| `tables` | The model Warehouse staged is the gold table, by name |
| `sql_tables` | The proposed SQL reads the gold `db.table` (FROM/JOIN) |
| `sql_compiles` | Trino `EXPLAIN` plans the proposed SQL |
| `tool_policy` | Only Warehouse's non-gate tools were used |
| `economy` | No more than 12 tool calls |

`reference_sql` (54 cases) is stored but not scored yet.

## Results (baseline)

| Batch | Cases | Average | Perfect | answer | tables | sql_tables | sql_compiles | tool_policy | economy |
|-------|-------|---------|---------|--------|--------|------------|--------------|-------------|---------|
| `find_table` | 52 | **0.981** | 43 | 1.000 | 1.000 | 1.000 | 0.923 | 1.000 | 0.965 |
| `find_metric` | 19 | **0.982** | 17 | 1.000 | 1.000 | 1.000 | 0.895 | 1.000 | 0.996 |
| **All** | **71** | **0.981** | 60 | 1.000 | 1.000 | 1.000 | 0.915 | 1.000 | 0.973 |

There were no errors, no cancellations and no gate calls.

### Table and metric choice: all 71 right

- **Table and metric choice was right in all 71 cases.** Every reply named
  exactly one model (or metric), and it was the gold one. The staged model
  matched it too. The usual path was:
  1. `search_metric_catalog`;
  2. `find_models_metrics`;
  3. `trino_desc_table`;
  4. `datahub_get_table_docs`, to confirm grain and partitions.

  Lookalikes resolved correctly. For example:
  - `fct_transaction_variations` was chosen over `fact_trans_detail` for the
    core_data variants;
  - the WishPost finance cases went to `finance_monthly_profits_1y`;
  - the two corrected golds held: `core_data.fct_dau` and `wish.dim_all_merchants`.
- **The proposed SQL always read the gold table**, and only that table. No
  reply joined in a second table.
- **Format:** 70 of 71 replies were strict JSON. The other one
  (`find_feed_product_tile_ctr_dataset`) didn't pass `json.loads`, but the
  check's lenient parser recovered the object, so it scored 1.0.

A perfect `answer` score says more about this case set than about how good
Warehouse is. Most golden questions name the metric in business terms that
the catalog indexes directly. The `model_selection` batch (vague,
lookalike-heavy questions) is the harder test of choice.

### SQL that doesn't plan: 6 of 71

| Case | Trino error | Cause |
|------|-------------|-------|
| `find_wishpost_overall_logistics_purchase_cost` | `grouping()` referenced in ORDER BY | `GROUPING SETS` with an `ORDER BY` on the `GROUPING(...)` output |
| `find_wishpost_overall_logistics_profit_margin` | same | same |
| `find_wishpost_overall_pnl_pre_combine_parcel_volume` (metric) | same | same |
| `find_wishpost_overall_logistics_sales_revenue` | `Column 'dt' is ambiguous` | `latest_partition` CTE `dt` vs table `dt` |
| `find_consolidated_merchandise_revenue_excl_ltd_metric` (metric) | `to_timestamp(integer)` not found | `transaction_time` is unix seconds; needs `from_unixtime` |
| `find_avg_star_rating_event_log_dataset` | `varchar = date` | Compared the string `dt` partition with a `DATE` |

- **None of the 6 failing runs called `trino_explain`.** All 29 runs that did
  call it produced SQL that plans. One EXPLAIN costs about 1.7 s, so it's
  cheap insurance.
- Four of the six are on `wishpost.finance_monthly_profits_1y`. The agent
  reached for `GROUPING SETS` to add an "all delivery programs" row, a pattern
  it got wrong every time.

### Over budget: 6 runs

| Case | Tool calls | Wall time |
|------|-----------|-----------|
| `find_consolidated_paid_shipping_dataset` | 21 | 331 s |
| `find_consolidated_buyer_tax_amount_dataset` | 17 | 563 s |
| `find_consolidated_distinct_variations_dataset` | 17 | 195 s |
| `find_consolidated_discount_amount_dataset` | 14 | — |
| `find_take_rate_dataset` | 13 | — |
| `find_wishpost_overall_pnl_pre_combine_parcel_volume` (metric) | 13 | 187 s |

Four of the six are `wish.fact_trans_detail` questions. The table was found
early. The extra calls went to repeated `datahub_get_table_docs` and
`trino_desc_table` while working out line-item vs transaction grain and the
unix `transaction_time`. The resulting SQL was right and planned.

## Timing

| | Mean per run | Median | Max | Total |
|-|--------------|--------|-----|-------|
| Wall | 97.7 s | 75.8 s | 563 s | 116 min |
| Model | 82.7 s (85%) | | | |
| Tools | 16.1 s | | | |

- Runs averaged 7.8 tool calls, 7.1 reasoning rounds, and about 10 model calls.
  A model call took 8.2 s on average. The slowest single call was 117 s.
- `datahub_get_table_docs` took 79% of tool time: 183 calls, 900 s, about
  4.9 s each, roughly 2.6 per run. All other tools together took about 250 s.
  `search_metric_catalog` and `find_models_metrics` are effectively free.

## Optimization log

Each step changes one thing, re-runs all 71 cases into a new results file
(earlier files are kept), and compares against the step before it.

### Step 1: always EXPLAIN the final SQL (2026-11-20)

**Hypothesis.** All 6 baseline compile failures came from runs that never
called `trino_explain`, and all 29 runs that called it produced SQL that plans.
Making the check mandatory should fix compile errors for little cost.

**Change.** In [`config/agents/warehouse.toml`](../../../config/agents/warehouse.toml),
workflow step 3 changed:

- Before: "Optionally check the SQL parses with `trino_explain`".
- After: "Always check the final SQL with `trino_explain` before you request
  approval or give the SQL in an answer, also when you will not run it. If it
  fails, fix the SQL and check again (at most twice)."

Nothing else changed: same cases, LLM, budget and backends. The Trino-specific
hints (`GROUPING()` in ORDER BY, unix `transaction_time`) were left out on
purpose, so this step measures the rule alone.

**Results:** [`2026-11-20_golden_queries_explain_rule.json`](2026-11-20_golden_queries_explain_rule.json)

| | Baseline | EXPLAIN rule |
|-|----------|--------------|
| Average | 0.981 | **0.995** |
| Perfect cases | 60 / 71 | **65 / 71** |
| `find_table` / `find_metric` | 0.981 / 0.982 | 0.995 / 0.994 |
| `sql_compiles` | 0.915 (6 fail) | **1.000** (0 fail) |
| `answer`, `tables`, `sql_tables`, `tool_policy` | 1.000 | 1.000 |
| `economy` | 0.973 | 0.971 |
| Runs over 12 tool calls | 6 | 6 |
| Runs that called `trino_explain` | 29 | 67 |
| `trino_explain` calls / time | 50 / 83 s | 99 / 187 s |
| Mean tool calls / rounds | 7.8 / 7.1 | 8.7 / 7.9 |
| Mean wall (median, max) | 97.7 s (76 s, 563 s) | 96.0 s (86 s, 261 s) |
| Mean model / tool time | 82.7 s / 16.1 s | 77.2 s / 19.8 s |
| Total wall | 116 min | 114 min |

What happened:

- **All 6 compile failures are fixed.** Each of those cases now ran EXPLAIN,
  usually got an error on the first try, and fixed the SQL (2 EXPLAINs in 5 of
  them). That includes the three `GROUPING()` / ORDER BY cases, the ambiguous
  `dt`, the `to_timestamp(integer)` and the `varchar = date` partition filter.
- **Rule adherence was 67 of 71.** The 4 runs without EXPLAIN
  (`find_wish_day_partitioned_product_catalogue`,
  `find_registered_engagement_dau_dataset`,
  `find_refund_line_merchant_item_cost_dataset`,
  `find_merchant_txn_item_cost_dataset`) still produced SQL that plans.
- **Cost.** About 0.9 more tool calls per run and 3.7 s more tool time.
  - 24 runs needed 2 to 4 EXPLAINs, which means the first draft failed
    roughly a third of the time.
  - Mean wall time didn't go up: less model time made up for it (single runs
    vary, and the worst run fell from 563 s to 261 s).
- **Budget is unchanged at 6 runs over 12 calls, but the set changed.**
  - Two runs that already failed to compile now spend extra calls on fixes:
    `find_wishpost_overall_pnl_pre_combine_parcel_volume` (18 calls) and
    `find_consolidated_merchandise_revenue_excl_ltd_metric` (14).
  - `find_consolidated_distinct_variations_dataset` used 23 calls (17 before),
    including 4 EXPLAINs.
  - `find_wish_add_to_cart_events_dataset` (13) and `find_buyer_rate_dataset`
    (15) are new.
  - `find_consolidated_paid_shipping_dataset` (21 calls before),
    `find_consolidated_discount_amount_dataset` and `find_take_rate_dataset`
    are now within budget.

  The remaining over-budget runs are about discovery (table docs, grain) plus
  repair loops, not about EXPLAIN itself.

**Decision.** Keep the rule. Every SQL query now plans, the scores the rule
doesn't target didn't drop, and the cost is about one tool call per run.

### Candidates for step 2

- **Cut the cost of a first draft that fails.** Add short Trino notes to the
  prompt for the error types seen in step 1: GROUPING() can't be referenced in
  ORDER BY (use `UNION ALL` for a total row); `dt` partitions are `varchar`
  `'YYYY-MM-DD'`; `transaction_time` is unix seconds, so use `from_unixtime`.
  Measure: fewer EXPLAIN retries and fewer runs over budget.
- **Cache `datahub_get_table_docs` within a turn** (79% of tool time in the
  baseline). Measure: tool time and calls on the `fact_trans_detail` cases.

## Side finding

`agent/refine_profile.py` logged "structured profile refine failed" on all 71
turns. MiniMax-M3 puts a `<think>` block before the JSON, so the
`UserProfile` structured parse fails and the code falls back to a plain parse.
This doesn't affect scores. It does waste one structured call per turn and
hides real parse failures. Strip think blocks before validating, as the eval
runner now does for replies.

## Next steps

1. ~~**Make Warehouse EXPLAIN before answering.**~~ Done in step 1 of the
   [Optimization log](#optimization-log): `sql_compiles` went from 0.915 to 1.000.
   Original note: Add a prompt rule: run
   `trino_explain` on the final SQL and fix it until it plans. That would have
   fixed all 6 compile failures. Add a note on Trino's `GROUPING()` / ORDER BY
   restriction (or "use `UNION ALL` for a total row"), and on unix-seconds
   `transaction_time` (`from_unixtime`).
2. **Cache or trim `datahub_get_table_docs`.** It's most of the tool time and
   the main cost in the over-budget runs. Cache it per table within a turn,
   and/or have `trino_desc_table` carry the column docs.
3. **Score SQL shape against `reference_sql`:** measure, filters, grouping and
   date window. All replies read the right table and most plan, so the open
   question is whether they compute the right number. Execution-free options
   are an LLM judge over (question, reference_sql, proposed_sql), or a
   structural comparison of the parsed queries.
4. **Harder choice cases.** Port the `model_selection` questions as a
   Warehouse batch in this JSON format, so table choice is tested on vague and
   lookalike questions too.
5. **Routing:** the lead still sends "which model has X" to Knowledge. Decide
   whether table and metric location questions go to Warehouse, then align
   `route_metric_questions`.
6. Fix the `<think>` parse in `refine_profile.py` (see the side finding).

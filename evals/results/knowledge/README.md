# Knowledge evals: metric and lineage questions

Can the Knowledge agent answer data-knowledge questions — what a metric means
and which model carries it, and where a table comes from — with the right
tools and the right answer?

- Date: 2026-11-20
- LLM: MiniMax-M3 (one run per case)
- Cases: [`evals/cases/knowledge/`](../../cases/knowledge/) — `metric_definition`,
  `not_in_catalog`, `lineage_dag`, `lineage_upstream`, `lineage_dag_tables`,
  `lineage_downstream` (28 cases)
- Raw results: [`2026-11-20_metric_lineage.json`](2026-11-20_metric_lineage.json)
  (and its `.partial.jsonl`)
- Routing of the same questions by the lead: [`../lead/README.md`](../lead/README.md)

```bash
uv run python -m evals -a knowledge \
  -g metric_definition not_in_catalog lineage_dag lineage_upstream lineage_dag_tables lineage_downstream \
  --out evals/results/knowledge/2026-11-20_metric_lineage.json
```

## Results

| Batch | Cases | Average | Perfect | Checks |
|-------|-------|---------|---------|--------|
| `metric_definition` | 12 | **0.963** | 10 | tools, rounds, answer (`root_id`, `member_id`, `model`) |
| `not_in_catalog` | 1 | **1.000** | 1 | tools, rounds, answer (all `null`) |
| `lineage_dag` | 7 | 0.083 | 0 | tools, rounds, answer (`dag`) |
| `lineage_upstream` | 4 | 0.333 | 0 | tools, rounds, answer (`upstream_tables`) |
| `lineage_dag_tables` | 2 | 0.167 | 0 | tools, rounds, answer (`tables`) |
| `lineage_downstream` | 2 | 0.500 | 0 | tools, rounds (no gold yet) |
| **All** | **28** | **0.564** | 11 | |

Wall time: about 31 minutes (lineage runs used their full 10-round budget).

### Metric questions: solid

Every metric case followed the intended path — `search_metric_catalog` for the
root, again for the member, then `describe_metric_models` — in 3 rounds, and
picked the right `root_id` and `member_id`, including the lookalikes (GMV with
LTD → `sum_w_ltd`, DAU with guests → `w_guests`, DAU without bots → `fct_dau`)
and the Chinese query. `not_in_catalog` (NPS) stopped after two catalog
searches and answered `null`, as the stop rule added on 2026-11-19 asks.

The two cases below 1.0 had the right answer:

| Case | Score | What happened |
|------|-------|---------------|
| `atv` | 0.67 | Right root, member and model, but the reply was cut off before the closing `}`, so no JSON object parsed. |
| `dau_including_guests` | 0.89 | Answered `core_data.fct_dau_w_bots`; the gold is `fct_dau_w_bots` and the `answer` check compares strings, so the schema prefix made it a mismatch. A case/scoring issue, not an agent error. |

### Lineage questions: not a valid measurement yet

**DataHub was failing during the whole run.** The DataHub tools could reach the
host but every call failed TLS verification:

```
DataHubGraphQLError: DataHub GraphQL connection failed:
[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate
```

Python's CA bundle on the dev Mac does not include the company CA that signs
`datahub.s.tahoe.wish.site`. So these scores measure how Knowledge behaves
when its lineage source is broken, not whether it can answer lineage
questions. In 11 of 15 lineage replies the agent itself said DataHub was
unavailable.

What the runs still show:

| Observation | Count |
|-------------|-------|
| Lineage runs that used the full 10-round budget | 14 of 15 |
| Runs that called `datahub_get_lineage` at all | 5 of 15 |
| Tool calls by name across lineage runs | `bash` 66, `search_metric_catalog` 26, `describe_metric_models` 19, `datahub_list_datasets` 13, `fetch_related_jira_tickets` 13, `k8s_*` 18, `datahub_get_lineage` 5 |
| Replies with the requested JSON | 8 of 15 (the rest ran out of rounds) |

1. **No rule for lineage questions.** Knowledge's prompt has a rule for metric
   questions but none for lineage, so after a DataHub failure it searched
   everything it has: shell commands in its workspace (looking for Airflow DAG
   files), k8s pods and logs, Jira, the metric catalog.
2. **No stop rule after a tool failure.** It kept going until the round cap
   instead of reporting "DataHub is unavailable" after the first error.
3. **Correct answers came from elsewhere.** `dag_dim_all_merchants`
   (`DailyIncrementalMerchants`) and `upstream_fct_dau` (`sweeper_pt.requests`)
   were right because `describe_metric_models` returned model descriptions
   that mention them, not from DataHub.
4. **Gold is still unverified.** The `dag`, `task` and `upstream_table` gold
   comes from `semantic_models` `config.meta`; it has not been checked against
   DataHub, and `downstream` has no gold at all.

## Re-run with working DataHub (lineage, 2026-11-20)

DataHub GMS was reached through `kubectl port-forward deploy/datahub-gms 8080:8080`
(`[datahub].gms_url = "http://localhost:8080"`, local only). Before the run the
lineage gold was checked against DataHub and corrected (see the case `notes`):
two DAG cases without DataHub lineage were dropped (`dim_all_merchants`,
`merchant_authorization`), `wishpost_order_clean_full_cycle` uses DataHub's
names (`WishpostOrderCleanFullCycle` / `TempWishpostOrderFullCycleQueryTask`,
not the YAML's), `erp_daily_dump` and `ulc_active_buyers` cases were added, and
downstream questions now ask for the Airflow DAGs that read a table (DataHub
records downstream consumers as jobs, not tables).

Raw results: [`2026-11-20_lineage_datahub.json`](2026-11-20_lineage_datahub.json)

| Batch | Cases | Average | Perfect |
|-------|-------|---------|---------|
| `lineage_dag` | 6 | 0.556 | 0 |
| `lineage_upstream` | 4 | 0.812 | 2 |
| `lineage_dag_tables` | 2 | 0.958 | 1 |
| `lineage_downstream` | 2 | 0.958 | 1 |
| **All** | **14** | **0.744** | 4 |

With DataHub reachable the agent stayed on DataHub tools (`datahub_get_lineage`
21 calls, `datahub_list_datasets` 12, `datahub_list_data_jobs` 8; one stray
`search_metric_catalog`, no `bash`/k8s/Jira) and no run hit the round cap.

- **DAG of a table: right in 4 of 6, tools scored 0 in all 6.** The agent found
  the DAG from `datahub_list_datasets`, whose result already carries the
  producing DataJob as 1-hop lineage, so it never called `datahub_get_lineage`.
  That is the efficient path, so the batch now expects `datahub_list_datasets`
  (not re-run yet). The two misses (`dag_fct_refund`,
  `dag_and_task_full_cycle`) ended without a parseable JSON reply.
- **Upstream, tables of a DAG, downstream DAGs: 0.81–0.96.** Answers matched
  DataHub; the losses are round-budget overruns and one upstream answer
  (`upstream_full_cycle`) that listed different tables.
- Still open from the first run: a lineage rule and a stop-on-tool-failure rule
  in Knowledge's prompt, and a CA-bundle fix so DataHub works without the
  port-forward.

## Next steps

1. **Fix DataHub TLS** on machines that run evals: point Python at the company
   CA bundle (for example `SSL_CERT_FILE`), or add a CA-bundle setting to
   `[datahub]` in `tools.toml`. Then re-run the lineage batches; that is the
   first real lineage measurement.
2. **Verify the lineage gold against DataHub** and capture downstream gold.
3. **Give Knowledge a lineage rule**: use `datahub_list_datasets` to resolve
   the URN, then `datahub_get_lineage` (upstream or downstream) or
   `datahub_list_data_jobs` for a DAG's tables; if DataHub errors, say so and
   stop instead of searching other sources.
4. **Tolerate schema prefixes for model answers** (gold lists with both forms,
   or a model-name normalizer in the `answer` check), so
   `core_data.fct_dau_w_bots` matches `fct_dau_w_bots`.

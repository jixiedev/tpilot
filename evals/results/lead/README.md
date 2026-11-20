# Lead evals: routing metric and lineage questions

Does the lead send metric and lineage questions to the right specialist?
Definitions, formulas and "which model" questions should go to `knowledge`,
numbers to `warehouse`, lineage questions to `knowledge`, and a failed DAG to
`diagnostic`.

- Date: 2026-11-20
- LLM: MiniMax-M3 (one run per case)
- Cases: [`evals/cases/lead/`](../../cases/lead/) — `route_metric_questions`,
  `route_lineage_questions` (13 cases)
- Run mode: `stub_specialists` — every specialist is a stub that records the
  task and returns a short `done` result, so only the lead's choice is scored
- Raw results: [`2026-11-20_metric_lineage_routing.json`](2026-11-20_metric_lineage_routing.json)
  (and its `.partial.jsonl`)
- How the specialist then answers: [`../knowledge/README.md`](../knowledge/README.md)

```bash
uv run python -m evals -a lead -g route_metric_questions route_lineage_questions \
  --out evals/results/lead/2026-11-20_metric_lineage_routing.json
```

## Results

| Batch | Cases | Average | Perfect | Checks |
|-------|-------|---------|---------|--------|
| `route_metric_questions` | 8 | **0.917** | 6 | decision, routes, delegations |
| `route_lineage_questions` | 5 | **1.000** | 5 | decision, routes, delegations |
| **All** | **13** | **0.949** | 11 | |

Wall time: about 6 minutes.

Every case got the right first move and the right specialists in the right
order: GMV/take-rate/ATV definitions, GMV vs revenue and the Chinese GMV
question went to `knowledge`; "GMV last month" and "refunds last week" went to
`warehouse`; "explain ATV, then give last month's ATV" was a plan with
`knowledge` then `warehouse`; all four lineage questions went to `knowledge`
and "DailyCorePipelines failed last night" went to `diagnostic`.

The two cases below 1.0 lost only the `delegations` check — the lead
delegated more times than needed:

| Case | Routes | Delegations (max) |
|------|--------|-------------------|
| `dau_which_model` | knowledge, knowledge, knowledge | 3 (2) |
| `define_then_query` | knowledge, knowledge, warehouse, warehouse, warehouse | 5 (3) |

The stub's canned reply ("Task complete. Result: 42 …") does not actually
answer "which model for DAU without bots" or "define ATV", so the lead asking
again is partly an artifact of stubbing. It is still worth watching: with real
specialists, repeated delegations cost a full specialist run each.

## Next steps

1. If repeated delegations show up with real specialists too, tighten the
   lead's rule on re-delegating after a `done` result.
2. Consider a stub reply that echoes the task ("Done: <task>") so stubbed runs
   re-delegate less.

# Interrupts and the checkpointer

How conversation state is stored, how a human gate pauses a run (including a
gate inside a delegated specialist), and how a resume continues it. For the
browser ↔ server side of the same flow, see
[FRONTEND_BACKEND.md](FRONTEND_BACKEND.md).

## The checkpointer

Every agent graph is compiled with one LangGraph checkpointer, an
`AsyncSqliteSaver` on `[paths].checkpoint_db` in `config/runtime.toml`
(default `<data_dir>/checkpoints.sqlite`).

| Entry point | How the saver is opened |
|---|---|
| `tahoepilot/server/app.py` | `CheckpointStore` (`CHECKPOINTS`): one long-lived `aiosqlite` connection, opened on first use and closed at shutdown. Every request's `aget_state` needs it, so it cannot be scoped to a request. Shared by `lead` and `databot`. |
| `tahoepilot/cli.py` | `AsyncSqliteSaver.from_conn_string(...)` for the whole CLI session |

The saver reaches the graphs through `AgentCatalogSettings(checkpointer=...)` →
`AgentCatalog` → `build_react_graph(..., checkpointer=...)` →
`graph.compile(checkpointer=checkpointer)`. Specialists created by the lead's
catalog (`get_or_create`) get the same saver.

### What is stored

A checkpoint is the full graph state after one **super-step** (one round of
nodes), keyed by:

| Key | Meaning |
|---|---|
| `thread_id` | The conversation: CopilotKit's `threadId` on the web, `--session` in the CLI (`tahoepilot/agent/session.py`) |
| `checkpoint_ns` | `""` for the root graph; `step_action:<task id>` for a specialist nested in the lead's `delegate`; deeper levels joined with `\|` (databot's layer subgraphs) |
| `checkpoint_id` | One per super-step; the latest is the thread's current state |

Besides the values, each checkpoint keeps the **pending tasks** (nodes due to
run next) and their **pending writes**, including interrupts. That is what lets
a paused run be resumed later, by another request or another process.

`aget_state(config)` returns a `StateSnapshot`: `values`, `next`, `tasks`
(each with `interrupts`), `config` (with the exact `checkpoint_ns`/`checkpoint_id`).
`aupdate_state(config, patch, as_node=...)` writes a new checkpoint as if a node
had returned `patch`; reducers apply (`messages` appends, other keys replace).

### Who writes checkpoints

| Writer | When |
|---|---|
| The running graph | After every super-step |
| AG-UI adapter | New turn on the web: input merged through reducers at run start; regenerate forks from an earlier checkpoint |
| `BaseAgent.commit_turn` (CLI only) | After a finished turn: `commit_turn_state` (profile refinement, domain records), written with `aupdate_state` |
| `/agui/databot/actions` | Card selection / SQL edits on a paused databot layer |
| `patch_paused_state` (`tahoepilot/agent/lead/paused.py`) | Edits to a specialist paused inside a lead run (tests only; no endpoint yet) |

Nothing prunes old checkpoints; the SQLite file grows with every super-step of
every thread.

## Where interrupts come from

| Gate | Code | Payload (`interrupt(value)`) | Resume parsed by |
|---|---|---|---|
| Warehouse SQL review | `request_sql_approval` tool, `tahoepilot/agent/specialists/warehouse/tools.py` (only when the review gate is on) | `{"id": "warehouse-sql-gate", "reason": …, "message": JSON{gate, question, sql, explanation, tables, options, default}}` | `parse_gate_resume`: `approve` (optionally with edited `sql`), `revise` + comments, `stop` |
| Databot cards gate, SQL gate | `ask_gate` in `tahoepilot/agent/specialists/databot/gates.py`, called by the `gate_cards` / `gate_sql` nodes | `{"id": "databot-<gate>-gate", "reason": …, "message": JSON gate prompt}` | `parse_resume`: one of `GATE_OPTIONS`, plain text or `{decision, comments}` |

`interrupt(value)` raises `GraphInterrupt`. The first time a node reaches it,
the run stops and the value is stored with the pending task. On resume the node
runs **again from its start**, and this time `interrupt(...)` returns the
resume value instead of raising.

Two consequences shape the gate code:

- **Code before the `interrupt` runs twice** (once before pausing, once on
  resume). It must be side-effect free. `request_sql_approval` only validates
  and normalizes SQL before the gate, and must be called alone in its step
  (`_batch_calls` check) so that resuming the `step_action` node does not
  re-run sibling tool calls.
- **Several `interrupt` calls in one node are matched by order.** `ask_gate`
  loops: an unrecognized reply re-interrupts with a note, and on the next
  resume LangGraph replays the earlier replies in order, so each `interrupt`
  call consumes one reply. An empty reply never counts as a decision (an
  accidental Enter must not run SQL).

## How a specialist's gate pauses the lead

Warehouse runs inside the lead's `delegate` tool, so its interrupt has to cross
three layers that would otherwise swallow it:

```
lead graph
 └─ step_action node (StepActionNode, a ToolNode)
     └─ retrying tool wrapper (tahoepilot/agent/graph/error_recovery.py)
         └─ delegate tool (tahoepilot/agent/lead/tools.py)
             └─ warehouse.run_as_subagent → nested graph.ainvoke
                 └─ step_action → request_sql_approval → interrupt(...)
```

1. **Inside warehouse** the interrupt bubbles out of its own `step_action` the
   same way as steps 2–4 below, so the nested `ainvoke` raises `GraphInterrupt`.
2. **`delegate`** catches `GraphBubbleUp` and re-raises it; every other
   exception becomes a `failed` `SubagentResult`.
3. **The tool wrapper.** With `wrap_tool_call` set, LangGraph's `ToolNode`
   turns any `Exception` raised through the wrapper into an error
   `ToolMessage`, interrupts included. The retrying wrapper therefore catches
   `GraphBubbleUp` and raises `BubbleUpCarrier(exc)`, a `BaseException`, which
   the guard does not catch.
4. **`StepActionNode`** catches `BubbleUpCarrier` and re-raises the original
   interrupt, so LangGraph sees an ordinary interrupt in the lead's
   `step_action` task.

Result: the lead's root checkpoint has a pending `step_action` task carrying
warehouse's interrupt payload, and warehouse's own checkpoints (stopped at its
gate) are stored in the **same thread** under `step_action:<task id>`.
`ainvoke` returns a dict with `__interrupt__`; `astream_events` ends, and the
AG-UI adapter emits `RUN_FINISHED` with an interrupt outcome.

`run_as_subagent` detects nesting with `nested_run_config()` (`get_config()`
succeeds inside a graph run). Nested, it passes only `recursion_limit`; the
nested `ainvoke` inherits the parent's config, which is what places it in the
lead's thread and namespace. Outside any graph (tests, scripts) it uses its own
thread (`standalone_config`), and an interrupt there becomes a `failed` result
because there is no parent to pause.

## How a resume continues

`Command(resume=value)` on the same `thread_id`:

1. LangGraph loads the lead's checkpoint and re-runs the pending
   `step_action` task from the start.
2. The model's tool call is the same, so `delegate` runs again and calls
   `run_as_subagent` again. `subagent_input()` builds the same input.
3. The nested `ainvoke` finds warehouse's checkpoint in
   `step_action:<task id>` and continues at its paused `step_action` instead
   of starting over; finished nodes are not re-run.
4. `request_sql_approval` runs again; `interrupt(...)` now returns the resume
   value; the tool returns its `Command` (approve → `run_sql` next; revise;
   stop).
5. Warehouse finishes; `delegate` records the result (`work_record`,
   `active_subagent`, plan step) and the lead continues its loop.

If warehouse hits its gate again (for example after `revise`), the same pause
happens with a new interrupt.

### Who sends the resume

| Path | How |
|---|---|
| CLI | `AgentTurnResult.ainvoke` (`tahoepilot/agent/turn.py`) loops while the result has `__interrupt__`: it asks `on_interrupt(question)` and calls `graph.ainvoke(Command(resume=reply), config)`. A `None` reply cancels; the thread stays paused in the checkpoint. Without `on_interrupt` an interrupt raises `RuntimeError`. |
| Web | The browser sends a run with `resume: [{interruptId, value}]` (`useInterrupt` → `resolve(payload)` on `/lead`; `buildResumeArray` + `agent.runAgent({resume})` on `/databot`). The adapter turns it into `Command(resume=…)` and does not merge the client's `state` or `messages`. A run on a paused thread **without** `resume` does not run the graph; the adapter re-emits the pending interrupt. |

Because resumes are separate requests, any server process with the same
database can serve them; nothing about the pause is kept in memory.

## Reading and editing a paused run

While a gate waits, the outer snapshot does not show what the user is
reviewing:

- **Lead + specialist.** The lead's state gets the specialist's view only when
  `delegate` returns. `tahoepilot/agent/lead/paused.py` finds the paused delegation
  (`find_paused_delegation`: pending `step_action` task with an interrupt +
  the unanswered `delegate` call → agent name → config with
  `checkpoint_ns = "step_action:<task id>"`). LangGraph resolves a namespace
  only against declared subgraphs, and a graph invoked from a tool is not one,
  so the config also carries the checkpointer explicitly
  (`CONFIG_KEY_CHECKPOINTER`, an internal LangGraph key).
  `live_subagent_view` returns `{"name", "state": specialist.ui_view(...),
  "paused": True}`; `LeadGraphView.aget_state` (tahoepilot/server/app.py) puts it in
  `active_subagent` of root snapshots, so `STATE_SNAPSHOT` carries the pending
  SQL. `patch_paused_state` can write edits into that snapshot (resolving a
  databot layer subgraph when needed); the gate reads them on resume.
- **Databot.** Gates pause inside layer subgraphs, so the outer checkpoint
  still holds pre-layer values. `DatabotGraphBuilder.aget_active_state` reads
  `aget_state(config, subgraphs=True)` and returns the innermost paused layer;
  `DatabotGraphView` uses it for snapshots and `/agui/databot/actions` patches
  it with `aupdate_state`.

Both overlays are best effort: on error the plain snapshot is returned and the
error logged.

## Operational notes

- **One writer.** SQLite on a ReadWriteOnce volume: run one backend replica
  (k8s `Recreate` strategy or a StatefulSet). Do not put it on EFS/NFS.
- **Back up the file** to keep conversations; deleting it drops every thread,
  including paused gates.
- **Schema changes.** Checkpoints store state as written by the code at the
  time. Renaming or retyping a state key can break resuming old threads.
- **Config is not checkpointed.** Run config (`thread_id`, `recursion_limit`,
  any `configurable` key) is supplied fresh on every run and resume; only
  state is stored.

# Agent framework

The `agent/` package turns per-agent TOML files into compiled LangGraph graphs and runs one user turn at a time against a checkpointed session. It contains the agent base class, the catalog that creates agents, the turn lifecycle, the ReAct loop wiring, the lead agent (the default front agent that answers, plans and delegates), the subagent contract specialists are called through, the ReAct specialists, and databot (the second front agent, a staged pipeline).

Related documentation:

| Topic | Document |
| --- | --- |
| System overview | `docs/ARCHITECTURE.md` |
| Databot (front agent: staged, human-gated data retrieval) | `agent/specialists/databot/README.md` |
| Warehouse (the lead's data specialist, reviewed SQL) | `agent/specialists/warehouse/README.md` |
| Tool registration, scopes, MCP | `tools/README.md` |
| Agent TOML files, tool groups, local paths | `config/README.md` |
| Context compression, profiles, session runtime | `memory/README.md` |
| Retrieval (RAG) | `rag/README.md` |
| Evaluation harness | `evals/README.md` |
| Web UI | `frontend/README.md` |

## Package map

| Path | Contents |
| --- | --- |
| `agent/agent.py` | `BaseAgent`: graph ownership, turn accept, `run`, `commit_turn`, and the subagent hooks (`subagent_input`, `run_as_subagent`, `result_from_state`, `ui_view`, `aget_active_snapshot`) |
| `agent/catalog.py` | `AgentCatalog`, `AgentCatalogSettings`, `DEFAULT_AGENT` |
| `agent/turn.py` | `AgentTurnResult` (invoke + interrupt resume, output extraction), `OnInterrupt` |
| `agent/turn_messages.py` | `TurnMessagePolicy`, `DefaultTurnMessagePolicy`, `SessionTurnProcessor` |
| `agent/session.py` | `session_graph_config`, `SessionUserRequest` |
| `agent/prompt.py` | `SystemPromptAssembler` (renders `[system_prompt]`) |
| `agent/run_context.py` | `TypedDict`s for `run_context` (`ReactRunContext`, `StageRunContext`, `DatabotRunContext`, ...) |
| `agent/runtime/` | Default ReAct prompts (`NEXT_STEP_PROMPT`, `TOOL_BUDGET_EXHAUSTED_PROMPT`, `REFINE_USER_PROFILE_PROMPT`), `TahoeRuntimeHelper` |
| `agent/react.py` | `BaseReactAgent`, `ReactTurnMessagePolicy` |
| `agent/router.py` | `CompletionToolRouter` (edges after `step_reason` / `step_action`) |
| `agent/refine_profile.py` | `UserProfileRefiner` (end-of-turn profile update) |
| `agent/listener.py` | `AgentListener`, `ListenerHub`, `CliListener` |
| `agent/subagent.py` | Subagent contract: `SubagentTask` (the lead's brief), `SubagentResult` (`status`, `summary`, `artifacts`, `ui_state`), plan step statuses, `compact_work_record` |
| `agent/lead/` | `LeadAgent` (`lead_agent.py`), `LeadState` and plan/work-record helpers (`state.py`), the `delegate` / `write_plan` tools (`tools.py`), `LeadSystemPrompt` and `lead_step_prompt` (`prompt.py`), reading and patching a specialist paused inside the lead (`paused.py`) |
| `agent/specialists/<name>/` | Pure ReAct specialists, one package each (`<name>_agent.py`): `KnowledgeAgent`, `DiagnosticAgent`, `DataAnalysisAgent`, `SWEAgent` |
| `agent/specialists/warehouse/` | `WarehouseAgent` and its gate tools `request_sql_approval` / `run_sql` (see its README) |
| `agent/specialists/databot/` | `DatabotAgent`, a front agent (see its README) |
| `graph/builder.py`, `graph/node.py`, `graph/state.py`, `graph/error_recovery.py`, `graph/messages.py` | The shared ReAct graph: topology, nodes, state schemas, retries (including `BubbleUpCarrier` for interrupts raised inside tools), message repair |

## Basic concepts

| Term | Meaning in the code |
| --- | --- |
| Agent | A `BaseAgent` subclass instance. It owns one compiled graph (`self.graph`), a model, a checkpointer, an `AgentConfig`, a `SessionRuntime`, and a `ListenerHub`. |
| Agent config | `config/agents/<name>.toml`, loaded into an `AgentConfig` subclass chosen by `agent_config_type(name)` in `config/agent_config.py`. Holds identity (`name`, `description`, `delegate_when`, `front`), `[system_prompt]`, `[run_context]`, `[compression]`, `[tools]`, `[accepted_mcp]`. |
| Front agent | An agent the user talks to directly, with its own AG-UI endpoint and web page: `lead` and `databot`. Marked `front = true` in its TOML; the lead never delegates to a front agent. |
| Specialist | An agent the lead delegates to, which answers the request itself with tools: `knowledge`, `diagnostic`, `data_analysis`, `swe` (pure ReAct) and `warehouse` (ReAct plus a tool-enforced SQL review). |
| Lead agent | `lead` (`LeadAgent`), the default agent. A ReAct agent whose only work tools are `delegate` and `write_plan` (plus `@memory`): it answers from the conversation, asks a clarifying question, or hands work to specialists and writes the reply from their results. |
| Subagent | A specialist run by the lead through `delegate`. It gets a written brief (`SubagentTask`), starts from a fresh state, runs nested inside the lead's tool call, and returns a `SubagentResult`. |
| Tool scope | A named bucket of tools per agent, addressed as the string `"agent,scope"` (for example `"knowledge,catalog"`). Scopes come from the `[tools]` table; `AgentCatalog.tools_for(name, scope)` returns one bucket. A ReAct agent's `tool_ids` tuple selects which scopes it binds. |
| Session | A conversation id. It is the LangGraph `thread_id` (`session_graph_config`) and the key in `SessionRuntime`. |
| Checkpoint | The graph state that the LangGraph checkpointer stores per session. All history (messages, counters, the lead's plan and work record) lives here; agents keep no per-session state on the instance. |
| Turn | One `BaseAgent.run` call: accept the user prompt, invoke the graph until it finishes (resuming interrupts), commit. |
| Turn boundary | A `SystemMessage` (`BaseAgent.turn_boundary`) inserted before the new `HumanMessage` on every turn after the first, separating prior history from the current request. Set `turn_boundary = ""` on a subclass to disable it. |
| Run context | The `[run_context]` table after defaults and overrides: ReAct budgets and step prompts for ReAct agents, plus `max_delegations` for `lead`. Read through `agent.run_context` or `AgentConfig.as_int` / `as_str`. |
| `step_reason` / `step_action` | The two ReAct nodes. `step_reason` makes one model call; `step_action` (`StepActionNode`, a `ToolNode`) executes the tool calls of the latest AI message. |
| Router | `CompletionToolRouter`: the conditional edges after each node. Decides `step_action`, another `step_reason`, or `__end__`. |
| Stage complete | An optional predicate passed to `CompletionToolRouter(stage_complete=...)`. Staged subgraphs (databot layers) end as soon as it returns true. |
| Listener | `AgentListener` hooks (`on_status`, `on_reason_start`, `on_reason_step`, `on_tool_call`, `on_tool_result`, `on_turn_output`). `ListenerHub` fans out to one primary plus secondaries (eval, UI) without rebuilding the graph. `CliListener` prints `Status>`, `LLM>`, `Tool>`, `Result>`, `Assistant>` lines. |
| `delegate_when` | One line in an agent's TOML saying when the lead should delegate to it. `LeadSystemPrompt` lists every specialist with it (falling back to `description`). |
| Plan / work record | Lead state. `plan` is this turn's optional step list (`write_plan`); `work_record` lists every delegation's result across turns. |
| Interrupt (human in the loop) | A LangGraph `interrupt(...)` inside a node or tool (databot's gates, warehouse's `request_sql_approval`). A specialist's interrupt pauses the lead's run too, because the specialist runs nested inside it. The turn runner asks the caller's `on_interrupt` callback for an answer and resumes with `Command(resume=answer)`. |

## Design

These choices are visible in the code:

- **Config-driven agents.** Prompts, budgets, tool lists, MCP servers and the lead's `delegate_when` lines live in `config/agents/<name>.toml`. A pure specialist (`agent/specialists/knowledge/knowledge_agent.py`) is about ten lines: a prompt class bound to its TOML and a `tool_ids` tuple. Shared text is inherited with `extends` (`base.toml` → `tahoe.toml` → agent file).
- **One compiled graph per agent instance.** `build_graph` compiles once and caches into `self.graph`; every session reuses it. Per-session data goes through the `thread_id`, never through instance attributes. Listeners are bound through a stable `ListenerHub`, so secondaries can change between turns without recompiling.
- **State in checkpoints.** History, ReAct counters and the lead's plan and work record are graph state written by the checkpointer. `SessionRuntime` (`memory/session_runtime.py`) only caches the last committed values in-process; the checkpoint is read once, the first time a session is seen.
- **Ephemeral step prompts.** `step_reason` appends `next_step` / budget / idle prompts to a local copy of the messages; they are never written to the checkpoint (see the `BaseAgent` docstring).
- **One lead, specialists as tools.** Specialists do the work; the lead decides who does it and writes the reply. It calls a specialist through `delegate` with a written, standalone brief and gets back a short summary plus structured artifacts, never the specialist's messages or tool calls. Specialists run nested in the lead's graph (under its thread, in the `step_action:<task id>` checkpoint namespace), start from a fresh state per delegation, and never read each other's histories. The lead obtains them through its own `AgentCatalog`.
- **A turn has explicit accept and commit phases.** `TurnMessagePolicy` decides what fields a new turn starts with (`history_state`) and what happens after the graph finishes (`commit_turn_state`, for example profile refinement), keeping these concerns out of the graph.

## How it works

### Lifecycle of one turn

```
cli.py run_repl
  └─ AgentCatalog(AgentCatalogSettings.for_agent(name, profile_store, model, checkpointer, max_tool_calls=30))
       └─ catalog.create(name)
            ensure_tools_registered()          # import tool modules, bind [tools], snapshot
            register_mcp_tools(name)           # [accepted_mcp], once per agent per process
            config = AgentCatalog.config(name).with_run_overrides(...).with_compression(...)
            agent = await factory(**kwargs)    # _create_<name> → _new_agent(AgentClass, ...)
            agent.build_graph(...)             # compile once
  └─ loop: agent.run(prompt, session=..., user_id=..., on_interrupt=_cli_on_interrupt)
       1. accept_user_request
            SessionRuntime.open(session)       # first time: graph.aget_state(thread_id)
            profile = runtime.load(user_id)
            SessionTurnProcessor.new_turn_state_with_messages(...)
              first turn : [SystemMessage(system prompt + User profile), HumanMessage]
              later turn : [SystemMessage(turn boundary), HumanMessage]
              + TurnMessagePolicy.history_state(prior)   # e.g. reset ReAct counters
       2. AgentTurnResult.ainvoke(graph, request, on_interrupt)
            state = graph.ainvoke(input, {"configurable": {"thread_id": session}})
            while state["__interrupt__"]:
                answer = await on_interrupt(question)
                answer is None → return cancelled (no commit)
                state = graph.ainvoke(Command(resume=answer), config)
       3. commit_turn
            TurnMessagePolicy.commit_turn_state(state)   # in a worker thread; ReAct: UserProfileRefiner
            graph.aupdate_state(config, committed)
            SessionRuntime.remember(session, committed)
       4. on_turn_output(committed) → listener (CLI prints "Assistant> ...")
```

Details:

- `SystemPromptAssembler.build` renders `layout` sections as `Title:\nbody` blocks and inserts a `User profile` block after the first section when the profile has content.
- `has_prior_turns` (any `HumanMessage` in the restored history) decides between the full system prompt and the turn-boundary marker.
- `AgentTurnResult.extract_output` returns the last AI message of the current turn that has no tool calls, then any AI text, then the `value` / `reply` / `answer` / `user_question` fields. It only looks after the latest `HumanMessage`, so an earlier turn's answer cannot leak.
- On cancel, the interrupted state is stored in `SessionRuntime` but `commit_turn` is skipped.

### The ReAct loop

`BaseReactAgent.build_graph` calls `build_react_graph` (`graph/builder.py`) with `ReactLoopSpec.from_run_context(run_context)` and a `CompletionToolRouter(run_context)`:

```
START ─▶ [react_turn_init] ─▶ compress_on_start ─▶ step_reason ◀──────────────┐
                                                     │                        │
                                     route_after_reason                       │
                    ┌──────────────────┼───────────────────┐                  │
             tool calls &        no tool calls       stage_complete /         │
             budget left       (idle retry if a      budget exhausted         │
                    │           stage contract)            │                  │
                    ▼                                      ▼                  │
               step_action ─▶ compress_after_action ─▶ route_after_action ────┘
                                                           │ stage_complete
                                                           ▼
                                                         __end__
```

`react_turn_init` is present only when a `ReactStateSpec(turn_init=...)` is given (databot layers, the lead). With `ReactStateSpec(turn_finish=...)` (the lead) a `react_turn_finish` node is added and every route to `__end__` passes through it first; the lead uses it to mark leftover plan steps `skipped`. `make_compressor` always returns a `ContextCompressor`, so both compression nodes are always present; whether they do anything is controlled by `[compression]` (see `memory/README.md`).

**`step_reason`** (`make_step_reason_node`, `graph/node.py`):

1. Copies the messages and appends `next_step` as a `SystemMessage`. `next_step` and `idle_nudge_prompt` may be fixed text or a callable that builds the text from the current state (`StepPrompt`; the lead's `lead_step_prompt`); empty text is skipped.
2. If `tool_call_count >= max_tool_calls`, appends `tool_budget_exhausted_prompt`; otherwise, if `idle_reason_rounds > 0`, appends `idle_nudge_prompt`.
3. Repairs the history with `sanitize_messages_for_strict_tool_providers` (`graph/messages.py`): strips prose from AI messages that carry tool calls and synthesizes an error `ToolMessage` for every tool call without a result.
4. Calls the model through `invoke_with_transient_retry` (4 attempts, linear backoff of 2 s per attempt, `transient_llm_retry_on`, which also treats 529 / overloaded as transient). Below the budget this is the tool-bound model. At the budget it is the same model without tools (`final_model`, passed by `build_react_graph`), and any tool calls in the reply are dropped (an empty reply becomes `BUDGET_EXHAUSTED_FALLBACK_REPLY`), so the step always produces a text answer.
5. Returns only the AI message. `idle_reason_rounds` resets to 0 when the reply has tool calls, otherwise it increments.

**`step_action`** (`StepActionNode`): runs the tool calls, emits `on_tool_call` / `on_tool_result` (results only for plain tool returns, not `Command` updates), increments `tool_call_count` by one per batch (also when tools return `Command` updates, as the lead's `delegate` / `write_plan` and databot stage tools do), resets `idle_reason_rounds`, and maintains `failed_tools`. Errors become structured `=== TOOL ERROR ===` content (`make_handle_tool_errors`); transient tool errors are retried by `make_retrying_tool_wrapper` / `make_async_retrying_tool_wrapper`; node failures are retried by `default_tool_retry_policy()` and finally caught by `make_step_action_error_handler`, which answers each unanswered tool call with a `status="error"` tool result whose hint carries the recovery guidance (no extra `SystemMessage` is persisted) and jumps back to `step_reason`. A LangGraph interrupt raised inside a tool (a nested specialist's gate) is not an error: ToolNode would turn it into an error `ToolMessage`, so the retry wrappers re-raise it inside `BubbleUpCarrier` (a `BaseException`) and `StepActionNode` unwraps it, which pauses the graph.

**Termination** (`CompletionToolRouter.route_after_reason` / `route_after_action`):

| Condition after `step_reason` | Next |
| --- | --- |
| `stage_complete(state)` is true | `__end__` |
| AI message has tool calls and `tool_call_count < max_tool_calls` | `step_action` |
| AI message has tool calls and the budget is exhausted | `__end__` (guard only; `step_reason` does not produce tool calls at the budget) |
| No tool calls, router has `stage_complete`, `idle_reason_rounds < max_idle_reason_rounds` | `step_reason` (with idle nudge) |
| No tool calls otherwise | `__end__`; the text is the user-visible reply |

After `step_action` the router ends if `stage_complete` is true, otherwise returns to `step_reason`. When the budget is reached, the next `step_reason` carries the budget-exhausted prompt and calls the model without tools, so the turn ends on a text answer (for a stage loop, the idle rule above then ends it once `max_idle_reason_rounds` is used up).

**Commit.** `ReactTurnMessagePolicy.history_state` resets `tool_call_count`, `idle_reason_rounds`, `autonomous_compact_requested` and `failed_tools` at every accept. Its `commit_turn_state` runs `UserProfileRefiner` when `refine_user_profile_prompt` is non-empty: one structured-output model call that merges evidence from the turn into the stored `UserProfile`. Failures are logged and ignored.

ReAct run-context keys (`ReactAgentConfig`, defaults from `agent/runtime/prompt.py`):

| Key | Default | Used by |
| --- | --- | --- |
| `max_tool_calls` | `10` | step budget (action batches) in `step_reason` and the router |
| `next_step` | `NEXT_STEP_PROMPT` | appended on every `step_reason` |
| `tool_budget_exhausted_prompt` | `TOOL_BUDGET_EXHAUSTED_PROMPT` | appended when the budget is reached (final call without tools) |
| `refine_user_profile_prompt` | `REFINE_USER_PROFILE_PROMPT` | end-of-turn profile refinement; `""` disables it |

A pure specialist's router has no `stage_complete`, so the first plain-text reply ends the turn and there is nothing to retry: `ReactAgentConfig` does not resolve `max_idle_reason_rounds` or `idle_nudge_prompt` (setting them in a specialist file has no effect and they are dropped). Staged loops resolve their contexts with `StageReactConfig`, which adds `max_idle_reason_rounds` (default `1`, plain-text replies retried while the stage predicate is unmet), `idle_nudge_prompt` (default `""`, appended on those retries) and the `fetch_instruction` / `sql_instruction` openers (databot layers).

### The lead agent

`LeadAgent` (`agent/lead/lead_agent.py`) is the default agent (`DEFAULT_AGENT = "lead"`) and the one the web UI's `/lead` page talks to. It is a `BaseReactAgent` built with `build_react_graph`, so it has the ReAct loop above, plus a `LeadState` (`agent/lead/state.py`), a callable step prompt, and turn start / finish nodes:

```
START ─▶ react_turn_init ─▶ compress_on_start ─▶ step_reason ◀────────────────────┐
         (turn_start)                              │                              │
                                     ┌─────────────┴──────────┐                   │
                              tool calls                 no tool calls            │
                                     ▼                        │                   │
                               step_action                    │                   │
                  delegate / write_plan / @memory             │                   │
                                     │                        ▼                   │
                         compress_after_action ──▶ react_turn_finish ─▶ END       │
                                     │              (pending steps → skipped)     │
                                     └────────────────────────────────────────────┘
```

**Tools.** `delegate` and `write_plan` (`agent/lead/tools.py`, bound per instance by `LeadAgent.lead_tools`) plus the `[tools]` scopes of `config/agents/lead.toml` (`@memory`). The lead has no data tools, and its rules forbid stating numbers or definitions that no specialist returned.

**System prompt.** `LeadSystemPrompt` renders `lead.toml` and appends a roster: one line per delegatable agent (every registered agent that is not a front agent, `delegatable_agents()`) with its `delegate_when` text, falling back to `description`.

**Per-step prompt.** `lead_step_prompt(state)` is the lead's `next_step`, rebuilt on every `step_reason` from the state (never checkpointed). It holds:

- the decision rules: answer only from the conversation or the work record; ask one clarifying question when ambiguity would change the result; otherwise `delegate` with a standalone `task`; write a plan only when two or more specialists are needed or one step's output feeds the next;
- the work record (last 10 rows) when there is one;
- after a `delegate` result, a reminder to read its status and rewrite the remaining plan steps if they no longer fit;
- the current plan, and while steps are pending, a note not to answer until they are done or explicitly dropped;
- with no plan after two delegations in the turn (`PLAN_NUDGE_AFTER`), a suggestion to write one.

**Turn start and finish.** `LeadAgent.turn_start` (the `react_turn_init` node) resets the per-turn fields (`plan`, `turn_delegations`, ReAct counters), sets `user_question` from the latest human message, increments `turn_index`, and compacts `work_record` (`compact_work_record`: last 20 rows, artifacts kept only on the newest 5, older summaries shortened). It also inserts the persona and specialist roster, or the turn boundary, when the input lacks them: AG-UI drives the graph with only the chat messages, while the CLI already adds both on accept. `turn_finish` (the `react_turn_finish` node) marks steps still `pending` as `skipped`.

**State.** `LeadState` adds to `ReactAgentState`:

| Field | Lifetime | Meaning |
| --- | --- | --- |
| `user_question` | turn | The user's latest message; passed to every delegation of the turn |
| `turn_index` | session | Turn counter, stored on work-record rows |
| `plan` | turn | `[{"text", "agent", "status"}]`; status is `pending`, `done`, `blocked`, `failed` or `skipped` |
| `turn_delegations` | turn | Delegations so far this turn, checked against `max_delegations` |
| `work_record` | session | One row per delegation: `agent`, `task`, `status`, `summary`, `artifacts`, `step`, `turn` |
| `active_subagent` | session | `{"name", "state"}`: the UI view of the latest specialist run (warehouse: tables, SQL review, result) |

Lead run-context keys (`LeadAgentConfig`, a `ReactAgentConfig`): the ReAct keys plus `max_delegations` (default `6`, the specialist runs per turn). `lead.toml` sets `max_tool_calls = 12` and `max_delegations = 6`; the CLI and the AG-UI server pass `max_tool_calls=30` as a run override.

### Delegation and the subagent contract

`delegate(agent, task, context="", step=None)` runs one specialist and returns its result as the tool message:

1. **Checks.** Unknown agent names, an empty `task`, a second `delegate` call in the same AI message, and a used-up `max_delegations` budget each return a message to the model instead of running anything. Only one delegation runs per step because specialists share the tool step's checkpoint namespace.
2. **Brief.** It builds a `SubagentTask` (`agent/subagent.py`) from the arguments plus `user_question`, `session_name` and `user_id` from the lead state. `SubagentTask.prompt()` is the specialist's human message: the user's own words (when they differ from the task), `Your task:` with the lead's standalone instruction, and the `context` the lead copied from earlier results. The lead's rules require the task to resolve "that", relative dates and clarification answers, and not to add metrics or filters the user did not ask for.
3. **Run.** `specialist.run_as_subagent(task)`, with the specialist taken from the lead's own `AgentCatalog` (`get_or_create`, cached; no run overrides, so specialists use their file budgets).
4. **Record.** `mark_step` sets the plan step's status (`done`, `blocked` for `halted`, `failed`): step `N` when given, else the first pending step for that agent, else a new finished step is appended so the plan lists what actually ran. A work-record row is appended, `turn_delegations` increments, and `active_subagent` is set from the result's `ui_state`.
5. **Reply.** The tool message is `SubagentResult.tool_text()`: JSON with `agent`, `status`, `summary` (capped at 4000 characters) and `artifacts`.

An exception from the specialist becomes a `failed` result; a LangGraph interrupt is re-raised so it pauses the lead (see below). `DelegateListener` shows each delegation as `Status> Running <agent>: <task>` instead of a raw tool call and result.

`BaseAgent` implements the specialist side, and subclasses override the parts they need:

| Method | Default | Warehouse override |
| --- | --- | --- |
| `subagent_input(task)` | Fresh turn state: persona + user profile, then `task.prompt()` as the human message, `session_name = "<session>:agent:<name>"` | — |
| `run_as_subagent(task)` | `graph.ainvoke(subagent_input(task))`, then `commit_subagent_state`, then `result_from_state` | — |
| `result_from_state(state)` | Last AI text with `<think>` blocks stripped as `summary`; `done`, or `failed` when there is no text | `halted` when the reviewer stopped the query, `failed` when the last query failed; artifacts `tables`, `sql`, `execution` (`columns`, `row_count`, `truncated`, `error`, `leading_rows`), `halt_reason` |
| `ui_view(state)` | `{}` | `tables`, `sql_review`, `execution` (first 200 rows) for the lead's workspace |
| `aget_active_snapshot(config)` | `graph.aget_state(config)` | — (databot overrides it with its paused layer's snapshot) |

`commit_subagent_state` is the delegated-run version of `commit_turn_state`: ReAct specialists skip profile refinement (the prompt is the lead's brief, not the user's words), while domain records an agent keeps in `commit_turn_state` are still saved.

Result statuses: `done`; `halted` (the user stopped the specialist at a review gate; the lead must not retry it and asks how to continue); `failed` (may be retried once with a corrected brief).

### Nested runs and gate interrupts

Called from inside the lead's `step_action`, `run_as_subagent` finds the enclosing graph config (`nested_run_config`) and invokes the specialist graph with it, so LangGraph runs it as a nested graph under the lead's thread, in a `step_action:<task id>` checkpoint namespace. There is no separate specialist thread. Consequences:

- **Gates pass through.** A specialist's `interrupt(...)` (warehouse's SQL review) propagates out of `delegate` (the `BubbleUpCarrier` path above) and pauses the lead's run with the specialist's payload. The CLI's `on_interrupt` and the AG-UI interrupt events see it like any interrupt of the lead.
- **Resume continues the gate.** `Command(resume=answer)` on the lead's thread re-enters `step_action`; `delegate` and `run_as_subagent` run again from the top, and the nested `ainvoke` loads the specialist's checkpoint and continues at the paused node. Nodes that already finished are not run again.
- **Fresh state per delegation.** Each delegation starts the specialist from `subagent_input`; earlier context reaches it only through `task` and `context`.
- **Standalone runs.** Outside any graph (tests, scripts) `run_as_subagent` uses its own thread (`<child session>:<random>`). There is no parent to pause, so an interrupt there returns a `failed` result.

`agent/lead/paused.py` reads and patches a specialist paused inside the lead. LangGraph resolves a `checkpoint_ns` only against declared subgraphs, and a graph invoked from a tool is not one, so `find_paused_delegation` locates the interrupted `step_action` task and the unanswered `delegate` call and builds a config that passes the checkpointer explicitly (`CONFIG_KEY_CHECKPOINTER`). `live_subagent_view` returns `{"name", "state", "paused": True}` from the specialist's `aget_active_snapshot` and `ui_view`; `patch_paused_state` writes a patch into that snapshot (resolving a declared layer subgraph when the specialist has one), which the gate reads when the run resumes. The AG-UI server's `LeadGraphView` uses `live_subagent_view` (see `frontend/README.md`).

### Plan and work record

The plan is optional and lives in the lead's checkpointed state:

- **When.** Answer directly from the conversation or work record; ask one question when ambiguity would change the result; delegate once with no plan when one specialist covers the request; write a plan when two or more specialists are needed or one step's output feeds the next. A plan may also be added mid-turn.
- **`write_plan(steps)`** replaces the whole list each time (there is no create/update split). Each step has `text`, an optional `agent` (must be a delegatable agent) and a `status` (default `pending`). Invalid input returns `Plan not saved: ...` for the model to fix.
- **Status is set by code.** `delegate(step=N)` marks the step; the model only rewrites the remaining steps, nudged after each result. Leftover `pending` steps become `skipped` at turn end.
- **Reset per turn.** `plan` is cleared at every turn start. The `/lead` page shows it in its Plan panel.

The work record carries context between specialists and across turns: the lead sees it in its step prompt and copies what a task needs (table names, SQL, definitions) into `context`. Specialists never read it or each other's histories.

The `planning` tool in `tools/plan.py` is a separate, generic in-memory plan tool that some specialists bind in their own `[tools]`; the lead does not use it.

### Warehouse

`WarehouseAgent` is the lead's data specialist: one ReAct loop with discovery tools plus `request_sql_approval` (an `interrupt` for the user's review) and `run_sql`, which runs only SQL whose fingerprint was approved. Its review pauses the lead's run as described above. See `agent/specialists/warehouse/README.md`.

### Databot

`DatabotAgent` is a front agent (`front = true`), not a lead specialist: the user talks to it on its own page (`/databot`, AG-UI endpoint `/agui/databot`) or with `-a databot`. It is a `BaseAgent` with its own staged graph (fetch ReAct layer, SQL ReAct layer, human gates, turn summary) built from `build_react_graph` subgraphs with `stage_complete` predicates and `DatabotReactState`. See `agent/specialists/databot/README.md`.

## Usage

### CLI

```bash
.venv/bin/python cli.py                     # default agent: lead
.venv/bin/python cli.py -a lead -s my-session -u alice -v
```

`main.py` (and the `tahoepilot` script in `pyproject.toml`) calls the same `cli.main`.

| Flag | Default | Effect |
| --- | --- | --- |
| `-a`, `--agent` | `lead` | Agent to run; choices are `AgentCatalog.names()` |
| `-s`, `--session` | random UUID | Session id; reuse it to continue a conversation from the checkpoint DB |
| `-u`, `--user-id` | `TAHOEPILOT_USER_ID` or the OS user | Profile to load and refine |
| `--checkpoint-db` | from `config/local.toml` | SQLite file for `AsyncSqliteSaver` |
| `--profile-dir` | from `config/local.toml` | Directory of per-user profile JSON |
| `-v`, `--verbose` | off | Print checkpoint DB and profile dir at startup, verbose logging |

The CLI applies `max_tool_calls=30` as a run override. Type `quit`, `exit`, `q` or `:q` to leave. When a graph interrupts (including a specialist's gate inside the lead), the CLI prints `Prompt> <question>` and reads the answer; answering with an exit command cancels the turn and ends the session. Turn failures are reported through `format_turn_failure`. Running a specialist directly with `-a <name>` skips the lead: no brief, no plan, no work record.

### Choosing an agent

| Agent | Kind | Typical use |
| --- | --- | --- |
| `lead` | front agent | Default entry: answer, clarify, plan, delegate to the specialists below |
| `databot` | front agent (staged) | Metric questions answered with SQL and evidence, with card and SQL gates |
| `warehouse` | ReAct specialist | Data questions answered with one reviewed SQL query |
| `knowledge` | ReAct specialist | Team docs, catalog, Jira, code |
| `diagnostic` | ReAct specialist | Production triage (K8s, S3, Airflow MCP) |
| `data_analysis` | ReAct specialist | Exploratory SQL, Python charts |
| `swe` | ReAct specialist | Local code edits, shell, Python |

Every agent is also reachable directly with `-a`. The lead can delegate to every registered agent that is not a front agent (so not to `lead` or `databot`); `delegate_when` only shapes the roster line it reads when choosing.

### Programmatic use

Inspecting the catalog needs no model:

```python
from agent.catalog import AgentCatalog

AgentCatalog.names()                    # ('data_analysis', 'databot', 'diagnostic', 'knowledge', 'lead', 'swe', 'warehouse')
AgentCatalog.config("knowledge").run_context["max_tool_calls"]   # 10
AgentCatalog.config("lead").run_context["max_delegations"]      # 6
AgentCatalog.config("warehouse").delegate_when                   # roster line for the lead
AgentCatalog.config("databot").front                             # True: never in the roster
```

Running a turn needs a chat model (here the project default from `models/llm.py`) and a checkpointer:

```python
import asyncio
from langgraph.checkpoint.memory import MemorySaver
from agent.catalog import AgentCatalog, AgentCatalogSettings
from agent.runtime import TahoeRuntimeHelper
from models.llm import get_default_model

async def main() -> None:
    catalog = AgentCatalog(AgentCatalogSettings.for_agent(
        "knowledge",
        profile_store=TahoeRuntimeHelper.default_profile_store(),
        model=get_default_model(),
        checkpointer=MemorySaver(),
        max_tool_calls=20,               # any extra keyword is a run_context override
    ))
    agent = await catalog.create("knowledge")
    result = await agent.run("Where is the GMV metric defined?", session="demo", user_id="alice")
    print(result.cancelled, result.extract_output(result.state))

asyncio.run(main())
```

Notes:

- `create(name, cache=True)` / `get_or_create(name)` reuse one instance per catalog; plain `create` builds and compiles a new one.
- `create(..., run_context={...})`, `compression_config=...`, `model=...`, `checkpointer=...`, `listener=...` override per call.
- Pass `on_interrupt=async_fn(question) -> str | None` for agents that interrupt (`databot`, `warehouse` with its review on, and `lead` when it delegates to `warehouse`); without it an interrupt raises `RuntimeError`.
- `await specialist.run_as_subagent(SubagentTask(agent=..., task=...))` runs one delegated task outside the lead (own thread, no parent); a gate interrupt there comes back as a `failed` result.
- `print_output=False` skips the listener's `on_turn_output` hook (evals use it when they consume the reply themselves).
- `agent.register_secondary(listener)` attaches an extra `AgentListener` (used by `evals/`); `clear_secondaries()` removes it.
- `langgraph_graphs.py` exposes compiled graphs (`databot_ui_agent`, `knowledge_ui_agent`, `lead_ui_agent`, `warehouse_ui_agent`) for LangGraph servers; those callers invoke `agent.graph` directly, without `BaseAgent.run`.

## Adding a specialist agent

The steps below add a ReAct specialist named `reports`.

**1. Config file** `config/agents/reports.toml`. The file stem must equal the registered name (`agent_config_path`).

```toml
name = "reports"
description = "Report specialist (scheduled dashboards and exports)"
# One line in the lead's specialist roster: when to delegate here (falls back to description).
delegate_when = "dashboards, scheduled reports, export requests"

[accepted_mcp]            # optional: scope id -> MCP server names (or "*")
# default = ["datahub"]

[run_context]             # optional: ReAct overrides; omitted keys use ReactAgentConfig defaults
max_tool_calls = 12

[system_prompt]
extends = "tahoe"         # inherit base/tahoe layout and sections

[system_prompt.sections.role]
title = "Role"
text = """
You are Reports, TahoePilot's reporting specialist.
"""

[system_prompt.sections.general_rules]
append = ["Prefer existing dashboards over ad-hoc SQL."]

[tools]                   # scope id -> tool names or @groups from config/tool_groups.toml
default = ["@memory", "@trino", "web_search"]
```

Tool names must be registered in `tools.registry`; unknown names are skipped with a warning by `AgentCatalog.bind_configured_tools`, unknown `@groups` raise `ValueError`. See `config/README.md` and `tools/README.md`.

**2. Agent package** `agent/specialists/reports/`, following `agent/specialists/swe/`: put the classes in `reports_agent.py` and re-export them from `__init__.py` (`from agent.specialists.reports.reports_agent import ReportsAgent, ReportsSystemPrompt`), so `agent/catalog.py` can import `from agent.specialists.reports import ReportsAgent`.

```python
from agent.prompt import SystemPromptAssembler
from agent.react import BaseReactAgent
from config.agent_config import AgentConfig, agent_config_path


class ReportsSystemPrompt(SystemPromptAssembler):
    def __init__(self, config: AgentConfig | None = None) -> None:
        super().__init__(config or AgentConfig(agent_config_path("reports")))


class ReportsAgent(BaseReactAgent):
    prompt_factory = ReportsSystemPrompt
    tool_ids = ("default",)      # [tools] scopes to bind, in order
```

**3. Config type.** Add `"reports": ReactAgentConfig` to `AGENT_CONFIG_TYPES` in `config/agent_config.py` (or pass `config_cls=ReactAgentConfig` to `register`). Without it the file loads as plain `AgentConfig`, whose `run_context` has no ReAct defaults: no `next_step` prompt, no budget-exhausted prompt and no profile refinement.

**4. Registration** in `agent/catalog.py`:

```python
@classmethod
async def _create_reports(cls, **kwargs: Any) -> BaseAgent:
    from agent.specialists.reports import ReportsAgent

    return cls._new_agent(ReportsAgent, **kwargs)

@classmethod
def register_builtins(cls) -> None:
    ...
    cls.register("reports", cls._create_reports)
```

Register in `register_builtins` rather than at runtime: `[tools]` binding (`ensure_tools_registered`) and the CLI `--agent` choices read `AgentCatalog.names()` once. The lead's roster and `delegate` checks (`delegatable_agents()`) read it on every call.

**5. Delegation.** Nothing else is needed: every registered agent without `front = true` appears in the lead's roster and is accepted by `delegate` and `write_plan`. Write `delegate_when` so the lead can tell it apart from the other specialists. A ReAct specialist gets the default subagent behavior (last AI text as the summary, no artifacts); override `result_from_state` to return structured artifacts, and `ui_view` / `aget_active_snapshot` if a web UI renders its state while paused. Add a routing case to `evals/cases/routing.json`.

**6. Tests.** Existing patterns: `tests/test_agent_catalog.py`, `tests/test_agent_tool_scopes.py`, `tests/test_data_analysis_and_swe_agents.py`, `tests/test_lead_agent.py` (delegation with a stub specialist).

For a non-ReAct agent, subclass `BaseAgent`, implement `build_graph` (compile once, assign `self.graph`), choose a `TurnMessagePolicy`, and accept the `_new_agent` keywords (`model`, `checkpointer`, `session_runtime`, `agent_config`, `listener`, optionally `tools` and `retrievals`). `DatabotAgent` is the reference implementation; `WarehouseAgent` shows the subagent overrides on a ReAct agent.

## Pitfalls

- **Delegation quality depends on `delegate_when`.** The lead chooses from the roster lines. `warehouse` (one concrete answer via SQL) and `data_analysis` (multi-query exploration, Python, charts) sit close together; if delegation between them drifts, sharpen `delegate_when` in `config/agents/*.toml` and rerun `python -m evals --agent lead`.
- **The lead can delegate to `swe`.** That runs the agent that edits local files and runs shell commands, with the CLI's normal confirmations.
- **Delegated specialists use their file budgets.** The lead's internal catalog has no run overrides; the lead's `max_tool_calls` bounds its own loop, and `max_delegations` caps specialist runs per turn.
- **Clarifying questions are plain replies.** The lead asks by answering with a question and ending the turn; the user's next message is a new turn, and the lead reads the answer from the conversation.
- **Specialists start fresh.** A specialist sees only the lead's `task` and `context`, never earlier turns. A brief that leaves out a needed detail (a table name, the SQL from the previous answer) gives a worse result; the work record is where the lead finds it.
- **Budget counts batches, not calls.** `tool_call_count` grows by one per `step_action`, however many parallel tool calls the AI message holds. At the budget the model is called once more without tools, so the reply is the model's best answer from what it has gathered.
- **Profile refinement costs a model call per ReAct turn.** Set `refine_user_profile_prompt = ""` in `[run_context]` to turn it off.
- **Registration is effectively static.** See step 4 of the extension guide. `AgentCatalog` registries are class-level (`ClassVar`), shared by every catalog instance; use `unregister` and `reset_mcp_tools` in tests.
- **MCP tools load once per agent per process** (`_mcp_registered`). With `mcp_replace_identifiers`, a scope's static tools are replaced only when the MCP servers return tools.
- **Specialist checkpoints live inside the lead's thread.** A delegated run has no thread of its own; it is stored under the lead's `thread_id` in a `step_action:<task id>` checkpoint namespace, and `aget_state` with that namespace fails because it is not a declared subgraph. Use `agent/lead/paused.py` to read or patch one. `<session>:agent:<name>` is only the specialist's `session_name` (offload paths, logging).
- **`SessionRuntime` caches per process.** The checkpoint is read only on the first turn of a session in a process; state written to the checkpoint by another process afterwards is not seen.
- **Missing `[system_prompt]`** produces no system message on the first turn (only the user profile block, if any). A `layout` entry naming an unknown section raises `ValueError` at load time.

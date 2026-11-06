# Agent framework

The `agent/` package turns per-agent TOML files into compiled LangGraph graphs and runs one user turn at a time against a checkpointed session. It contains the agent base class, the catalog that creates agents, the turn lifecycle, the ReAct loop wiring, the intent orchestrator, the plan orchestrator, multi-agent chains, and the pure ReAct specialists.

Related documentation:

| Topic | Document |
| --- | --- |
| System overview | `docs/ARCHITECTURE.md` |
| Databot (staged, human-gated data retrieval) | `agent/specialists/databot/README.md` |
| Tool registration, scopes, MCP | `tools/README.md` |
| Agent TOML files, tool groups, local paths | `config/README.md` |
| Context compression, profiles, session runtime | `memory/README.md` |
| Retrieval (RAG) | `rag/README.md` |
| Evaluation harness | `evals/README.md` |
| Web UI | `frontend/README.md` |

## Package map

| Path | Contents |
| --- | --- |
| `agent/agent.py` | `BaseAgent`: graph ownership, turn accept, `run`, `commit_turn` |
| `agent/catalog.py` | `AgentCatalog`, `AgentCatalogSettings`, `DEFAULT_AGENT` |
| `agent/turn.py` | `AgentTurnResult` (invoke + interrupt resume, output extraction), `OnInterrupt` |
| `agent/turn_messages.py` | `TurnMessagePolicy`, `DefaultTurnMessagePolicy`, `SessionTurnProcessor` |
| `agent/session.py` | `session_graph_config`, `SessionUserRequest`, `SpecialistSession` |
| `agent/prompt.py` | `SystemPromptAssembler` (renders `[system_prompt]`) |
| `agent/run_context.py` | `TypedDict`s for `run_context` (`ReactRunContext`, `StageRunContext`, `HandoffRunContext`, ...) |
| `agent/runtime/` | Default ReAct prompts (`NEXT_STEP_PROMPT`, `TOOL_BUDGET_EXHAUSTED_PROMPT`, `REFINE_USER_PROFILE_PROMPT`), `TahoeRuntimeHelper` |
| `agent/react.py` | `BaseReactAgent`, `ReactTurnMessagePolicy` |
| `agent/router.py` | `CompletionToolRouter` (edges after `step_reason` / `step_action`) |
| `agent/refine_profile.py` | `UserProfileRefiner` (end-of-turn profile update) |
| `agent/listener.py` | `AgentListener`, `ListenerHub`, `CliListener` |
| `agent/intent/` | `IntentOrchestrator`, `IntentionResponse`, `IntentSystemPrompt` |
| `agent/plan/` | `PlanAgent`, `PlanState`, plan graph, `create_plan` / `planning` tools, `SpecialistRunner` |
| `agent/chain.py` | `AgentChain`, `StaticAgentChain`, `StatusRoutedAgentChain` |
| `agent/specialists/<name>/` | Pure ReAct specialists, one package each (`<name>_agent.py`): `KnowledgeAgent`, `DiagnosticAgent`, `DataAnalysisAgent`, `SWEAgent` |
| `agent/specialists/databot/` | `DatabotAgent` (see its README) |
| `graph/builder.py`, `graph/node.py`, `graph/state.py`, `graph/error_recovery.py`, `graph/messages.py` | The shared ReAct graph: topology, nodes, state schemas, retries, message repair |

## Basic concepts

| Term | Meaning in the code |
| --- | --- |
| Agent | A `BaseAgent` subclass instance. It owns one compiled graph (`self.graph`), a model, a checkpointer, an `AgentConfig`, a `SessionRuntime`, and a `ListenerHub`. |
| Agent config | `config/agents/<name>.toml`, loaded into an `AgentConfig` subclass chosen by `agent_config_type(name)` in `config/agent_config.py`. Holds identity (`name`, `description`, `intention`), `[system_prompt]`, `[run_context]`, `[compression]`, `[tools]`, `[accepted_mcp]`. |
| Specialist | An agent that answers a request itself with tools: `knowledge`, `diagnostic`, `data_analysis`, `swe` (pure ReAct) and `databot` (staged pipeline). |
| Orchestrator | An agent that delegates to other agents: `intent` (routes to one agent) and `plan` (runs several specialists in sequence). |
| Tool scope | A named bucket of tools per agent, addressed as the string `"agent,scope"` (for example `"knowledge,catalog"`). Scopes come from the `[tools]` table; `AgentCatalog.tools_for(name, scope)` returns one bucket. A ReAct agent's `tool_ids` tuple selects which scopes it binds. |
| Session | A conversation id. It is the LangGraph `thread_id` (`session_graph_config`) and the key in `SessionRuntime`. |
| Checkpoint | The graph state that the LangGraph checkpointer stores per session. All history (messages, counters, plan fields) lives here; agents keep no per-session state on the instance. |
| Turn | One `BaseAgent.run` call: accept the user prompt, invoke the graph until it finishes (resuming interrupts), commit. |
| Turn boundary | A `SystemMessage` (`BaseAgent.turn_boundary`) inserted before the new `HumanMessage` on every turn after the first, separating prior history from the current request. Set `turn_boundary = ""` on a subclass to disable it. |
| Run context | The `[run_context]` table after defaults and overrides: ReAct budgets and step prompts for ReAct agents, clarification settings for `intent`. Read through `agent.run_context` or `AgentConfig.as_int` / `as_str`. |
| `step_reason` / `step_action` | The two ReAct nodes. `step_reason` makes one model call; `step_action` (`StepActionNode`, a `ToolNode`) executes the tool calls of the latest AI message. |
| Router | `CompletionToolRouter`: the conditional edges after each node. Decides `step_action`, another `step_reason`, or `__end__`. |
| Stage complete | An optional predicate passed to `CompletionToolRouter(stage_complete=...)`. Staged subgraphs (plan create, databot layers) end as soon as it returns true. |
| Listener | `AgentListener` hooks (`on_status`, `on_reason_start`, `on_reason_step`, `on_tool_call`, `on_tool_result`, `on_turn_output`). `ListenerHub` fans out to one primary plus secondaries (eval, UI) without rebuilding the graph. `CliListener` prints `Status>`, `LLM>`, `Tool>`, `Result>`, `Assistant>` lines. |
| Intention / route | An upper-case label (for example `DATA`, `KNOWLEDGE`) that an agent declares with `intention = "..."`. `IntentOrchestrator` classifies a request into labels and publishes a `route_target` agent name. |
| Interrupt (human in the loop) | A LangGraph `interrupt(...)` inside a node (intent clarification, databot gates). The turn runner asks the caller's `on_interrupt` callback for an answer and resumes with `Command(resume=answer)`. |

## Design

These choices are visible in the code:

- **Config-driven agents.** Prompts, budgets, tool lists, MCP servers and intention labels live in `config/agents/<name>.toml`. A pure specialist (`agent/specialists/knowledge/knowledge_agent.py`) is about ten lines: a prompt class bound to its TOML and a `tool_ids` tuple. Shared text is inherited with `extends` (`base.toml` → `tahoe.toml` → agent file).
- **One compiled graph per agent instance.** `build_graph` compiles once and caches into `self.graph`; every session reuses it. Per-session data goes through the `thread_id`, never through instance attributes. Listeners are bound through a stable `ListenerHub`, so secondaries can change between turns without recompiling.
- **State in checkpoints.** History, ReAct counters and orchestrator fields are graph state written by the checkpointer. `SessionRuntime` (`memory/session_runtime.py`) only caches the last committed values in-process; the checkpoint is read once, the first time a session is seen.
- **Ephemeral step prompts.** `step_reason` appends `next_step` / budget / idle prompts to a local copy of the messages; they are never written to the checkpoint (see the `BaseAgent` docstring).
- **Specialists vs orchestrators.** Specialists do the work; orchestrators only decide who does it. Orchestrators run each child agent on its own checkpoint thread (`SpecialistSession.id`) so child history never mixes into the parent's messages, and they obtain children through their own `AgentCatalog`.
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

`react_turn_init` is present only when a `ReactStateSpec(turn_init=...)` is given (databot layers). `make_compressor` always returns a `ContextCompressor`, so both compression nodes are always present; whether they do anything is controlled by `[compression]` (see `memory/README.md`).

**`step_reason`** (`make_step_reason_node`, `graph/node.py`):

1. Copies the messages and appends `next_step` as a `SystemMessage`.
2. If `tool_call_count >= max_tool_calls`, appends `tool_budget_exhausted_prompt`; otherwise, if `idle_reason_rounds > 0`, appends `idle_nudge_prompt`.
3. Repairs the history with `sanitize_messages_for_strict_tool_providers` (`graph/messages.py`): strips prose from AI messages that carry tool calls and synthesizes an error `ToolMessage` for every tool call without a result.
4. Calls the model through `invoke_with_transient_retry` (2 attempts, linear backoff, `transient_llm_retry_on`). Below the budget this is the tool-bound model. At the budget it is the same model without tools (`final_model`, passed by `build_react_graph`), and any tool calls in the reply are dropped (an empty reply becomes `BUDGET_EXHAUSTED_FALLBACK_REPLY`), so the step always produces a text answer.
5. Returns only the AI message. `idle_reason_rounds` resets to 0 when the reply has tool calls, otherwise it increments.

**`step_action`** (`StepActionNode`): runs the tool calls, emits `on_tool_call` / `on_tool_result` (results only for plain tool returns, not `Command` updates), increments `tool_call_count` by one per batch (also when tools return `Command` updates, as plan and databot stage tools do), resets `idle_reason_rounds`, and maintains `failed_tools`. Errors become structured `=== TOOL ERROR ===` content (`make_handle_tool_errors`); transient tool errors are retried by `make_retrying_tool_wrapper` / `make_async_retrying_tool_wrapper`; node failures are retried by `default_tool_retry_policy()` and finally caught by `make_step_action_error_handler`, which answers each unanswered tool call with a `status="error"` tool result whose hint carries the recovery guidance (no extra `SystemMessage` is persisted) and jumps back to `step_reason`.

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

### Intent routing

`IntentOrchestrator` (`agent/intent/orchestrator.py`) is the default agent (`DEFAULT_AGENT = "intent"`). Its graph:

```
START ─▶ begin_turn ─▶ detect ─▶ review ──route_after_review──┬─▶ publish ─▶ END
                         ▲                                    ├─▶ reject  ─▶ END
                         └────────────── clarify ◀────────────┘   (interrupt)
```

- **Catalog.** `AgentCatalog.intention_routes()` maps each registered agent's upper-cased `intention` to its name (duplicates raise `ValueError`). With the shipped configs every agent except `intent` declares one: `ANALYSIS` → `data_analysis`, `DATA` → `databot`, `DIAGNOSTIC` → `diagnostic`, `KNOWLEDGE` → `knowledge`, `PLAN` → `plan`, `SWE` → `swe`. Plan is routed like any specialist; its `intention_description` tells the classifier to pick it only when the request needs two or more different specialists. `IntentSystemPrompt.build` substitutes `{intentions}`, `{prefer}`, `{labels}`, `{choices}` and `{threshold}` in `config/agents/intent.toml` from that catalog.
- **begin_turn.** Runs once per graph invocation; an interrupt resume continues at `clarify` and skips it. It clears `user_question`, `clarification_rounds` and `need_clarification`, so each new question is detected from its own human message and gets the full `max_clarification_rounds`. Exception: if the previous run stopped at `clarify` without an answer (the caller's `on_interrupt` returned `None`; detected as `status == "pending"` with a `need_clarification` question and a `user_question`), the new message is taken as the clarifying answer: `user_question` is kept and the answer counts as one round.
- **detect.** Builds a fresh system prompt (not checkpointed), adds the session history without leading system messages, and asks for an `IntentionResponse` (`user_intentions` holding exactly one label, `confidence`, `need_clarification`) through `with_structured_output`. On parse failure it falls back to a plain call and `IntentionResponse.coerce` (JSON, embedded JSON, or a bare label in the text). Labels outside the catalog are rejected; any exception yields `UNCLEAR` with a fallback question.
- **review.** `route_from_state`: `publish` when all labels are routable and `confidence >= clarification_threshold`; `clarify` when a question exists, `clarification_rounds < max_clarification_rounds` and confidence is low; otherwise `reject`.
- **clarify.** `interrupt({"type": "intent_clarification", "question": ...})`; the answer is appended as a `HumanMessage`, `clarification_rounds` increments, and detection runs again. During clarification `detect` keeps the original `user_question` (the text later handed off) and classifies over the whole history.
- **publish.** `resolve_publish_target`: the label's agent from the catalog (`PLAN` → `plan`). If the model still returns several labels, the request needs several specialists, so it goes to the agent that declares `PLAN` (`PLAN_INTENTION`). Sets `status="published"` and `route_target`.
- **Handoff.** After its own turn is committed, `IntentOrchestrator.run` (with `handoff=True`) calls `_handoff`: it gets the target from its internal `AgentCatalog` (`get_or_create`, cached, `run_overrides={"max_tool_calls": <intent run_context max_tool_calls>}`) and runs it on session `"<session>:route:<target>"` with the same `on_interrupt`. The returned state is the target's state plus the intent fields.

Intent run-context keys (`IntentAgentConfig`): `max_tool_calls` (30, handed to specialists), `clarification_threshold` (0.85), `max_clarification_rounds` (2, per question).

### Plan and delegation

`PlanAgent` (`agent/plan/plan_agent.py`) runs a plan-and-execute graph (`build_plan_graph`, `agent/plan/graph.py`). Each stage is a `build_react_graph` subgraph over the shared `PlanState`:

```
START ─▶ prepare_turn ─▶ create_plan ──plan_id set?──▶ increment_subagent_round ─▶ sub_agent_round
                              │ no                              ▲                        │
                              ▼                                 │ adjust changed plan     ▼
                           summary ◀──────── otherwise ──── adjust_plan ◀──────── prep_adjust
                              │
                              ▼
                             END
```

| Stage | Tools (scope) | Exit |
| --- | --- | --- |
| `create_plan` | `create_plan` (`plan,create`) | `stage_complete` when `plan_id` is set by the `create_plan` tool |
| `sub_agent_round` | `planning` (`plan,subagent`) + `invoke_agent` | plain-text reply or budget |
| `adjust_plan` | `planning` (`plan,adjust`) | plain-text reply or budget; `planning update`/`mark_step` in this stage sets `adjust_had_tool_calls` and loops back to execution |
| `summary` | none | one model call with `SUMMARY_SYSTEM_PROMPT` over the plan snapshot and `step_results` |

Every stage subgraph starts with `PlanState.stage_start` (its `react_turn_init` node), which resets `tool_call_count` and `idle_reason_rounds`: create, each execution round and each adjust run get their own budget of `max_tool_calls` action batches. `PlanState.baseline()` (applied by `PlanTurnMessagePolicy` at every accept) also resets the ReAct counters, so nothing carries into the next turn. At the budget a stage answers without tools (see `step_reason`); the stage prompts use `TOOL_BUDGET_EXHAUSTED_PROMPT`.

`PlanAgent.build_graph` passes its resolved `run_context` to `build_plan_graph`:

| Key | Fallback | Meaning |
| --- | --- | --- |
| `max_tool_calls` | `DEFAULT_STAGE_MAX_TOOL_CALLS` (6) | Action batches per stage run. Entry points pass `max_tool_calls=30` as a run override, and `intent` hands its `max_tool_calls` (30) to a plan it routes to, so in practice stages run with 30. |
| `max_subagent_rounds` | `DEFAULT_MAX_SUBAGENT_ROUNDS` (8) | Execute/adjust cycles per turn (`make_route_after_adjust`). |
| `max_idle_reason_rounds` | 1 | Idle retries of the create stage, the only stage with a stage contract. |

`invoke_agent` is built by `SpecialistRunner.invoke_tool()`. It accepts any name in `DELEGATABLE_AGENTS` (every registered agent except `intent` and `plan`), obtains the specialist from the plan's own `AgentCatalog`, runs it on session `"<plan session>:<agent>"` with the plan run's `on_interrupt` (`PlanAgent.run` publishes it through `SpecialistRunner.interrupt_handler`, a context variable, because the compiled graph is shared across sessions), appends `{"agent", "task", "output"}` to `step_results`, and returns the output as the tool result. `PlanSystemPrompt.agent_cards()` lists those agents with their `description` in the system prompt. `PlanSubagentListener` turns `invoke_agent` calls into `Status> Running <agent>: <task>` lines.

### Chains

`agent/chain.py` provides a programmatic alternative to the orchestrators. `AgentChain` holds agents by integer id, runs the entry agent, then asks `determine_next_agent` for the next id (up to `max_steps`). The next prompt is built by `build_next_user_prompt` (previous output, then `user_question`, then the latest human text). Each step runs on `"<session>:chain:<id>"`. `StaticAgentChain` uses a fixed `{id: next_id}` table; `StatusRoutedAgentChain` reads a state field such as `route_target` (optionally requiring `status == "published"`). No built-in agent or entry point constructs a chain.

### Databot

`DatabotAgent` is a `BaseAgent` with its own staged graph (fetch ReAct layer, SQL ReAct layer, human gates, turn summary) built from `build_react_graph` subgraphs with `stage_complete` predicates and `DatabotReactState`. It is routed by the `DATA` intention. See `agent/specialists/databot/README.md`.

## Usage

### CLI

```bash
.venv/bin/python cli.py                     # default agent: intent
.venv/bin/python cli.py -a intent -s my-session -u alice -v
```

`main.py` (and the `tahoepilot` script in `pyproject.toml`) calls the same `cli.main`.

| Flag | Default | Effect |
| --- | --- | --- |
| `-a`, `--agent` | `intent` | Agent to run; choices are `AgentCatalog.names()` |
| `-s`, `--session` | random UUID | Session id; reuse it to continue a conversation from the checkpoint DB |
| `-u`, `--user-id` | `TAHOEPILOT_USER_ID` or the OS user | Profile to load and refine |
| `--checkpoint-db` | from `config/local.toml` | SQLite file for `AsyncSqliteSaver` |
| `--profile-dir` | from `config/local.toml` | Directory of per-user profile JSON |
| `-v`, `--verbose` | off | Print checkpoint DB and profile dir at startup, verbose logging |

The CLI applies `max_tool_calls=30` as a run override. Type `quit`, `exit`, `q` or `:q` to leave. When a graph interrupts, the CLI prints `Prompt> <question>` and reads the answer; answering with an exit command cancels the turn and ends the session. Turn failures are reported through `format_turn_failure`. See the pitfalls section before using `-a` with an agent other than `intent`.

### Choosing an agent

| Agent | Kind | Intention | Typical use |
| --- | --- | --- | --- |
| `intent` | orchestrator | none | Default entry: classify, clarify, hand off |
| `plan` | orchestrator | `PLAN` | Requests that need two or more specialists |
| `databot` | staged specialist | `DATA` | Metric questions answered with SQL and evidence |
| `knowledge` | ReAct specialist | `KNOWLEDGE` | Team docs, catalog, Jira, code |
| `diagnostic` | ReAct specialist | `DIAGNOSTIC` | Production triage (K8s, S3, Airflow MCP) |
| `data_analysis` | ReAct specialist | `ANALYSIS` | Exploratory SQL, Python charts |
| `swe` | ReAct specialist | `SWE` | Local code edits, shell, Python |

Every agent is also reachable directly with `-a`. An agent without an `intention` is never chosen by intent routing; specialists are still available as plan steps.

### Programmatic use

Inspecting the catalog needs no model:

```python
from agent.catalog import AgentCatalog

AgentCatalog.names()                    # ('data_analysis', 'databot', 'diagnostic', 'intent', 'knowledge', 'plan', 'swe')
AgentCatalog.intention_routes()         # {'ANALYSIS': 'data_analysis', 'DATA': 'databot', ..., 'PLAN': 'plan', 'SWE': 'swe'}
AgentCatalog.config("knowledge").run_context["max_tool_calls"]   # 10
[t.name for t in AgentCatalog.tools_for("plan", "create")]       # ['create_plan']
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
- Pass `on_interrupt=async_fn(question) -> str | None` for agents that interrupt (`intent`, `databot`, and `plan` when it delegates to `databot`); without it an interrupt raises `RuntimeError`. Inside a plan, a specialist that interrupts with no handler available fails that step with a `SpecialistNeedsInputError` message returned to the plan model instead.
- `print_output=False` skips the listener's `on_turn_output` hook (orchestrators, plan delegation and evals use it when they consume the reply themselves). `IntentOrchestrator.run` also accepts `handoff` (`handoff=False` stops after publishing the route).
- `agent.register_secondary(listener)` attaches an extra `AgentListener` (used by `evals/`); `clear_secondaries()` removes it.
- `langgraph_graphs.py` exposes compiled graphs (`databot_ui_agent`, `knowledge_ui_agent`, `intent_ui_agent`) for LangGraph servers; those callers invoke `agent.graph` directly, without `BaseAgent.run`.

## Adding a specialist agent

The steps below add a ReAct specialist named `reports`.

**1. Config file** `config/agents/reports.toml`. The file stem must equal the registered name (`agent_config_path`).

```toml
name = "reports"
description = "Report specialist (scheduled dashboards and exports)"   # shown in Plan's agent cards
intention = "REPORTS"                                                 # optional: enables intent routing
intention_description = "dashboards, scheduled reports, export requests"

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

Register in `register_builtins` rather than at runtime: `[tools]` binding (`ensure_tools_registered`), `DELEGATABLE_AGENTS` in `agent/plan/plan_agent.py` and the CLI `--agent` choices all read `AgentCatalog.names()` once.

**5. Routing.** With `intention` set, nothing else is needed: `intention_routes()`, the intent prompt placeholders, `IntentionResponse` validation and the clarification text all derive from the catalog. Labels are upper-cased, must be unique, and must not be `UNCLEAR`. Plan delegation is automatic for every registered agent except `intent` and `plan`.

**6. Tests.** Existing patterns: `tests/test_agent_catalog.py`, `tests/test_registry_intention_routes.py`, `tests/test_agent_tool_scopes.py`, `tests/test_data_analysis_and_swe_agents.py`.

For a non-ReAct agent, subclass `BaseAgent`, implement `build_graph` (compile once, assign `self.graph`), choose a `TurnMessagePolicy`, and accept the `_new_agent` keywords (`model`, `checkpointer`, `session_runtime`, `agent_config`, `listener`, optionally `tools` and `retrievals`). `PlanAgent` and `IntentOrchestrator` are the reference implementations.

## Pitfalls

- **Routing quality depends on `intention_description`.** The classifier sees only labels and their descriptions. `DATA` (one concrete answer via SQL) and `ANALYSIS` (multi-query exploration, Python, charts) sit close together; if routing between them, or to `PLAN`, drifts, sharpen the descriptions in `config/agents/*.toml` and rerun `python -m evals --agent intent`.
- **Intent can route to `swe`.** A request classified `SWE` runs the agent that edits local files and runs shell commands, with the CLI's normal confirmations; it is no longer reachable only through `-a swe` or plan.
- **Plan's delegated specialists use their file budgets.** The plan's internal catalog has no run overrides; the plan's `max_tool_calls` bounds its own stages only.
- **A clarification cancelled mid-turn carries over.** If `on_interrupt` returns `None` at an intent clarification, the next message in that session is treated as the answer to it, not as a new question (see `begin_turn`).
- **Budget counts batches, not calls.** `tool_call_count` grows by one per `step_action`, however many parallel tool calls the AI message holds. At the budget the model is called once more without tools, so the reply is the model's best answer from what it has gathered.
- **Profile refinement costs a model call per ReAct turn.** Set `refine_user_profile_prompt = ""` in `[run_context]` to turn it off.
- **Registration is effectively static.** See step 4 of the extension guide. `AgentCatalog` registries are class-level (`ClassVar`), shared by every catalog instance; use `unregister` and `reset_mcp_tools` in tests.
- **MCP tools load once per agent per process** (`_mcp_registered`). With `mcp_replace_identifiers`, a scope's static tools are replaced only when the MCP servers return tools.
- **Session ids nest.** Child checkpoints live on derived threads: `<s>:route:<agent>` (intent), `<s>:<agent>` (plan, where `<s>` is the plan's own session), `<s>:chain:<id>`. Inspecting a specialist's history requires the derived id.
- **`SessionRuntime` caches per process.** The checkpoint is read only on the first turn of a session in a process; state written to the checkpoint by another process afterwards is not seen.
- **Missing `[system_prompt]`** produces no system message on the first turn (only the user profile block, if any). A `layout` entry naming an unknown section raises `ValueError` at load time.

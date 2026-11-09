---
title: Architecture
description: The components that make TahoePilot work, and how a request flows through them.
---

# Architecture

TahoePilot is a multi-agent assistant for data teams. You ask a question in a terminal or a
browser. An agent answers it by reasoning with an LLM and calling tools against your team's
data platform and knowledge base.

The data platform is Trino, Hive, S3, DataHub and Kubernetes, plus Airflow through MCP. The
knowledge base is your Jira tickets and dbt models, indexed in Qdrant. Everything runs on
LangGraph and LangChain.

This page is the map. It names the pieces, follows one question from start to answer, and
lists the principles behind the structure. Each capability has its own page with the details.

## The pieces

<figure class="tp-diagram">
  <img src="assets/diagrams/system.svg" alt="The terminal and the browser converge on the agent catalog, which binds orchestration, tools, memory and knowledge.">
  <figcaption>Both clients reach the same agent catalog; tools, memory and knowledge sit behind the compiled graph.</figcaption>
</figure>

The diagram reads from top to bottom in four bands.

- **Clients.** You come in through the terminal or the browser.
- **Transport.** The terminal calls the agent directly, in the same process. The browser goes
  through the AG-UI server, which runs the agent and streams events back.
- **The agent.** Both paths reach the same agent catalog. The catalog binds each agent to the
  run loop, its tools, memory and knowledge.
- **What it reads and keeps.** Configuration holds the prompts and budgets. Local storage holds
  checkpoints and archives. The knowledge index holds tickets and models. Your data platform
  holds the warehouse and the cluster.

A panel on the right lists the seven agents the catalog can create: intent, plan, databot,
knowledge, diagnostic, data_analysis and swe.

| Piece | What it is |
|---|---|
| **Agent catalog** | A class that holds every agent the platform can create. It is assembled once at startup, so asking it for an agent is cheap. |
| **Agent** | An object with a compiled graph that handles one user turn. Created by name through the catalog. |
| **Specialist** | An agent that does the work with tools: databot, knowledge, diagnostic, data_analysis, swe. |
| **Orchestrator** | An agent that only decides who does the work: intent routes one question to one specialist, plan breaks a task into steps and delegates them. |
| **Tool registry** | The class that holds every tool an agent can call, grouped by family and granted by scope. |
| **Connection registry** | The class that holds the credentials and endpoints each tool family talks to. |
| **Session store** | Where the saved state of each conversation lives, keyed by session id. It is the source of truth for history. |
| **Knowledge base** | The index of your tickets, dbt models and documents, queried before the model answers a question about your team. |
| **Turn** | One user message and everything the agent does until it answers. It has an accept phase (work out what to send) and a commit phase (persist the result). |
| **Gate** | A pause that waits for a human. Databot uses two of them before any query runs. Intent uses the same kind of pause to ask you a clarifying question. |

Each agent gets only the tools it asks for. A tool scope is a named set of tools for one
agent. Databot, for example, has one set for finding tables, one for writing the query and one
for running it. A stage of the agent can only call the tools in its own set.

The platform keeps a small set of things on your machine, in one local folder:

| What | Written when |
|---|---|
| Conversation and graph state | After every step of every turn, by the checkpoint store. Kept in SQLite. |
| Your user profile | At the end of a turn, when the agent refines what it knows about you. |
| Offloaded tool output and archived history | When context compression moves something out of the conversation. |
| Databot retrieval history | When a Databot turn is committed. |
| Logs | While the platform runs. |

The knowledge base is the exception. It lives in Qdrant and is filled by a separate ingest
job. See [Knowledge](knowledge.md).

## How a turn flows

The terminal and the browser run the same machinery; only the entry point differs.

<figure class="tp-diagram">
  <img src="assets/diagrams/turn-cli.svg" alt="One terminal turn: create the agent, accept the question, invoke tools, commit, output.">
  <figcaption>One terminal turn, from the question to the answer.</figcaption>
</figure>

In the terminal, the agent is built once. The catalog binds its tools, memory and prompts,
then hands the agent to the terminal. After that, every question you type goes through three
steps:

1. **Accept.** The agent restores the session history and your profile. On the first turn it
   adds the system prompt. On later turns it adds a short marker that separates earlier
   history from the new question.
2. **Act.** The model reasons and calls tools until it has an answer.
3. **Commit.** The agent saves the turn to its checkpoint and refines your profile. Then it
   prints the answer.

If a tool needs your approval, the terminal prints the question and waits for your reply
before it goes on. Your reply resumes the same run.

Which graph runs depends on the agent you talk to:

- **knowledge, diagnostic, data_analysis, swe** run one reasoning loop over their own tools,
  with context compression around it.
- **databot** runs four phases in order: find tables, write the query, run it, summarize. Each
  phase has its own loop and its own tools, and two gates sit between them. See
  [Databot](databot.md).
- **intent** classifies your question, asks a clarifying question if it needs one, and hands
  the question to the one agent it picked.
- **plan** writes a plan, delegates the steps to specialists, adjusts the plan, and summarizes.

<figure class="tp-diagram">
  <img src="assets/diagrams/turn-browser.svg" alt="The browser talks to the web app, which streams events from the agent graph.">
  <figcaption>The browser path streams the same work as tool cards.</figcaption>
</figure>

In the browser, the path has one more hop. You type in the chat panel of the web app. The web
app forwards the request to the AG-UI server. The server runs the agent and streams events
back while the turn is still going. Each tool call and its result appears in the chat as a
card.

- The web UI serves Databot.
- When the turn reaches a gate, the stream ends with a "paused" outcome. A panel asks you to
  approve or reject. Your decision starts a new request that resumes the paused run.
- When you edit the selected tables or the drafted query in the side panel, the edit is not
  sent as a chat message. It is written straight into the saved state of the paused stage.
- Every stream ends with either a finished event or an error event, so the chat never hangs
  on a half-closed stream.

The browser and the terminal share the same checkpoints, profiles and session history. See
[Web UI](web-ui.md).

Inside a turn, the agent runs a reasoning loop: the model decides what to do, the tools
act, the model looks at the result and decides again. The loop ends when the model
answers in plain text, a budget runs out, or a stage is complete.

<figure class="tp-diagram">
  <img src="assets/diagrams/react-loop.svg" alt="The reasoning loop: think, act, observe, repeat until the answer is ready.">
  <figcaption>Think, act, look at the result, repeat — until there is an answer.</figcaption>
</figure>

The loop in the diagram runs like this:

1. **Compress.** Before the first step, the context is folded if it is too long.
2. **Reason.** The model reads the conversation and decides: call tools, or answer.
3. **Act.** If it wants tools, the tools run and their results come back into the
   conversation. The context is compressed again after each round of tools.
4. **Look again.** The model reads the results and decides again.
5. **End.** The turn ends when the model answers in plain text, or when a staged loop's work
   is complete.

The loop has guardrails:

- **A tool budget.** Each agent has a limit on rounds of tool calls per turn. When the budget
  is used up, the model is asked one last time without any tools. That way the turn always
  ends with a text answer.
- **A repaired history.** Before each model call, every tool call gets a matching result. A
  call without one gets an error result, so the conversation stays valid.
- **A nudge for staged loops.** In a staged loop, such as a Databot phase, the stage has a
  goal to meet. If the model replies in plain text before the goal is met, it gets one nudge
  to carry on.

<figure class="tp-diagram">
  <img src="assets/diagrams/turn-lifecycle.svg" alt="The lifecycle of one turn, from creating the agent to returning the answer.">
  <figcaption>The lifecycle of one turn. Cancelling skips the commit, and only the last text of the turn is returned.</figcaption>
</figure>

The lifecycle repeats the terminal steps and adds one branch. You can cancel at a pause. If you do, the commit is skipped, so nothing about that turn is
remembered. The answer you see is the last text the model wrote in the current turn. The
agent only looks after your latest question, so an earlier turn's answer cannot leak into the
new one.

<figure class="tp-diagram">
  <img src="assets/diagrams/state-layout.svg" alt="The state that travels through a turn, and the checkpoints it passes between.">
  <figcaption>One record travels through a turn, and is written to a checkpoint after every step.</figcaption>
</figure>

One record carries the whole turn. It holds:

- the conversation so far,
- which step the turn is on,
- the counters for tool calls and reasoning rounds,
- the plan and its steps, when there is one,
- what the platform knows about you.

Each step reads the record, does its work and changes the record. The change is written to
the checkpoint before the next step runs. The record is never only in memory, so a restart
resumes the turn. The next step reads from the record what to do next.

## Principles

These explain most of the structure.

1. **Behaviour lives in configuration, mechanics live in the platform.** Prompts, step
   prompts, budgets, which tools an agent may use, which MCP servers it accepts and how
   it is described to the router are all configuration. Shared text is inherited in layers:
   shared defaults, then team defaults, then one file per agent. Changing what an agent does
   rarely needs a deployment. See [Configuration](configuration.md).

2. **Tools do not know their agents.** A tool registers itself by name; each agent lists
   the tools it wants. A name that does not exist is caught immediately rather than silently leaving an
   agent with nothing. See [Tools](tools.md).

3. **Read-only by default, humans approve anything consequential.** Warehouse, object
   storage, cluster and catalog tools are read-only, and SQL goes through a read-only
   guard. Databot will not run a query until a person has approved both the tables and
   the query. The tools that can change things run on your own machine.
   - The shell and the file editor are in the default tool sets of swe and knowledge.
   - The Python sandbox is also given to data_analysis.
   - Databot's staged pipeline does not use them. Each phase uses only its narrower set for
     finding tables, writing the query or running it.

4. **State lives in checkpoints.** Conversation history, loop counters and pipeline state
   are all saved state, keyed by session id. A restart resumes a session, and one compiled
   graph serves every session. To continue a conversation in the terminal,
   start it again with the same session name.

5. **Specialists do the work; orchestrators decide who does it.** Routing and planning
   never touch your data themselves. Each delegated specialist runs on its own history,
   so a child's work never mixes into the parent's messages. Intent hands your question to
   one specialist. Plan runs a specialist for each step and passes each step's result on to
   the next.

6. **Context is managed in layers, and nothing is lost.** Long tool results are offloaded
   to disk first, older turns are folded next, and summarization runs last. Everything
   removed from the conversation is archived and can be read back. See [Memory](memory.md).
   - Offloading costs only a disk write. It runs on every pass and leaves a short preview
     and a pointer to the file in place of the long result.
   - Summarization costs a model call. It runs only when the context window is still too full
     after the cheaper layers.
   - The agent can read any archived file back with a tool, when it needs the detail again.

7. **Errors are information for the model.** A failed call is classified and returned as a
   structured result with a type, a retry hint and, where one exists, an alternative. The
   model can recover from it. Transient failures are retried first.
   - Only a connection or timeout failure counts as transient. It is retried once more
     before the model sees it. Shell commands and Python runs are never retried.
   - An alternative is only a suggestion, such as the Trino table listing in place of the Hive
     one. Nothing switches automatically. If the alternative already failed in this turn,
     the model is told to stop and explain instead.

8. **Optional parts degrade gracefully.** The knowledge base, the cluster tools and the
   browser UI are optional extras. If one is missing or unreachable, its tools are
   skipped with a warning and the rest keeps working. The same holds for an MCP server: if
   it cannot be reached, its tools are removed with a warning.

## Where to go next

| Page | Read it to… |
|---|---|
| [The seven agents](agents.md) | See which specialist handles which question |
| [Databot](databot.md) | Follow a data question through its stages and gates |
| [Tools](tools.md) | Browse everything the platform can read |
| [Memory](memory.md) | Understand checkpoints, compression and profiles |
| [Knowledge](knowledge.md) | Understand retrieval from your team's material |
| [Web UI](web-ui.md) | Use the browser client |

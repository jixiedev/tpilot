---
title: Capabilities
description: What the platform can do, and the mechanism behind each capability.
---

# Capabilities

The platform is a set of capabilities that fit together. Each one below says what it is
for, what the mechanism behind it looks like, and where to go deeper.

Two rules run through all of them:

- **Read-only by default.** Everything the platform reads, it reads without changing
  anything. Anything that would change something waits for you.
- **Configured, not coded.** Each capability is tuned through configuration, so changing
  how it behaves is not a deployment.

## Tools

Tools are the read-only actions the platform can take on your behalf: reading your
warehouse, your object storage, your catalog, your cluster and your team's indexed
material. There are fifty-two of them, grouped into families, and each agent is granted
a named set of them.

A failed call is not a dead end. It is classified, retried if it is worth retrying, and
returned to the agent as a structured result the agent can reason about.

<figure class="tp-diagram">
  <img src="assets/diagrams/tool-errors.svg" alt="How a failed tool call is classified and returned.">
  <figcaption>A failed call comes back as information, not as a crash.</figcaption>
</figure>

Details: [Tools](tools.md).

## Configuration

Behaviour lives in configuration, in layers. Shared defaults at the bottom, one file per
agent on top, and each part inherits on its own — the instructions can come from one
parent while the run limits come from another.

<figure class="tp-diagram">
  <img src="assets/diagrams/config-shape.svg" alt="How configuration is layered.">
  <figcaption>Shared defaults, a team layer, one file per agent — and the surrounding settings files.</figcaption>
</figure>

Details: [Configuration](configuration.md).

## Memory

Memory is what the platform keeps between turns and across sessions: the conversation
itself, what it has learned about you, and the payload it moved off to disk when a
conversation grew too large.

The context window is finite, so something has to leave it. Four steps run, cheapest
first, and every copy is written to disk before anything is removed.

<figure class="tp-diagram">
  <img src="assets/diagrams/compressor.svg" alt="The context window narrowing in four steps, cheapest first.">
  <figcaption>The window narrows in four steps. The model is only asked to summarize when nothing cheaper was enough.</figcaption>
</figure>

What sits behind it:

<figure class="tp-diagram">
  <img src="assets/diagrams/memory-layout.svg" alt="What is in play right now, and where everything else goes.">
  <figcaption>What is in play, and where everything else goes: the offload store, the archive, the profile store and the checkpoints.</figcaption>
</figure>

Details: [Memory](memory.md).

## Profiles

A profile is a small record per person: your role and team, the tables you may read, the
columns you must not see, your currency and grain. It is loaded once per session,
refined after every turn, and kept as one file per person.

<figure class="tp-diagram">
  <img src="assets/diagrams/profile-store.svg" alt="One profile record per person, refined after each turn.">
  <figcaption>One record per person. Delete the file and the profile is gone.</figcaption>
</figure>

Details: [Memory](memory.md).

## Sessions

A session is one conversation under one name. Every turn is saved as it happens, so a
later question — or a later process — continues where the last one stopped instead of
starting again. Different names never mix.

<figure class="tp-diagram">
  <img src="assets/diagrams/session-layout.svg" alt="One session over time.">
  <figcaption>Ask, work, approve, answer. Every turn is saved.</figcaption>
</figure>

Details: [Memory](memory.md).

## State

One record carries a turn: the conversation so far, which step the pipeline is on, the
counters, the plan and what is known about you. Each step reads it, advances it, and
writes it back — so a step never starts from scratch, and a restart picks up at the step
it reached.

<figure class="tp-diagram">
  <img src="assets/diagrams/state-layout.svg" alt="The state before and after a step.">
  <figcaption>The same record, read and written, before and after every step.</figcaption>
</figure>

Details: [Architecture](architecture.md).

## Knowledge

The knowledge base holds your tickets, your dbt models and your documents, indexed so
questions can be answered in your team's own words. A question goes out as a vector
search and a keyword search at the same time; the two result sets are merged, duplicates
removed, and the best matches reranked before the agent sees them.

<figure class="tp-diagram">
  <img src="assets/diagrams/rag-flow.svg" alt="How a question is answered from the knowledge base.">
  <figcaption>A question becomes a vector search and a keyword search, merged and reranked.</figcaption>
</figure>

Details: [Knowledge](knowledge.md).

## Evaluation

Evaluation is how you know a change did not make answers worse. A case is a question,
the context it runs in, and what a good answer looks like; a run scores every case,
averages them per suite, and compares the result against a bar.

<figure class="tp-diagram">
  <img src="assets/diagrams/evals-run.svg" alt="An evaluation run.">
  <figcaption>Load the cases, run each against a model, score, average, compare against the bar.</figcaption>
</figure>

Details: [Evaluation](evals.md).

## Web UI

The browser is the same platform as the terminal. Tool calls arrive as cards while the
agent works, pending actions wait for your approval, and a draft can be edited before it
runs. The same gates apply as in the terminal.

<figure class="tp-diagram">
  <img src="assets/diagrams/agui-chat.svg" alt="Streaming updates in the browser.">
  <figcaption>Streaming events turn tool calls into cards in the chat.</figcaption>
</figure>

Details: [Web UI](web-ui.md).

## Where to go next

| Page | Read it to… |
|---|---|
| [Getting started](getting-started.md) | Install, connect your data, ask a question |
| [Architecture](architecture.md) | See how the parts fit together |
| [The seven agents](agents.md) | Know which specialist handles your question |
| [Databot](databot.md) | Follow a data question through its stages and gates |

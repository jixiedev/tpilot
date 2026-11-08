---
title: Databot graph
description: The Databot pipeline as a state machine, with every stage, gate and hand-off.
---

# Databot graph

Databot is a pipeline, not a single step. This page shows the whole thing: five stages,
two gates, and the three places a turn can end.

<figure class="tp-diagram">
  <img src="assets/diagrams/databot-flow.svg" alt="The staged flow of a data question, with two human gates">
  <figcaption>Every stage hands over to the next one. Two of them stop and wait for you.</figcaption>
</figure>

## The stages

| # | Stage | What happens |
|---|---|---|
| 1 | **Find the models** | The knowledge base and your catalog are searched in parallel for models that could answer the question. The agent picks the candidates. |
| 2 | **Review the models** | You see the selected models and approve them, or send them back with comments. |
| 3 | **Draft the query** | The agent writes the query and explains why it chose that shape. |
| 4 | **Review the query** | You see the drafted query and its explanation. Approve it, or send it back to be rewritten. |
| 5 | **Run the query** | The approved query runs against your warehouse, read-only, with a row limit. The agent turns the result into an answer. |

Stage 2 and stage 4 are the gates. Nothing reaches the warehouse before both of them.

## What you can decide at a gate

A gate offers four answers, and the platform reads them the same way at both gates.

| Your answer | What happens |
|---|---|
| **Approve** | The stage is confirmed and the pipeline moves on. |
| **Send back with comments** | This stage is cleared and repeated with your comments. The work starts again from this stage, not from the beginning. |
| **Stop** | The turn ends here. The query does not run and nothing is written. |
| **Preview** | The stage is confirmed as if approved, but nothing is recorded. Useful for trying a flow without keeping the result. |

<figure class="tp-diagram">
  <img src="assets/diagrams/databot-gates.svg" alt="How a rejection returns to the same stage with your comments">
  <figcaption>A rejection returns to the same stage with your comments attached.</figcaption>
</figure>

## Where a turn can end

| Outcome | When |
|---|---|
| **Answer** | The query ran and the agent summarised the result. |
| **Stopped by you** | You chose to stop at a gate. The query never ran. |
| **Summary without a result** | The turn ended for another reason and the agent said what it had. |

## In one paragraph

Your question enters the pipeline, the agent searches for the models it needs and drafts a
query, and it stops twice so you can check both. If you send something back, it is redone
from that stage with your comments attached — you never start over from scratch. If you
stop, nothing runs and nothing is kept.

The stage-by-stage description, with what a good answer looks like, is on the
[Databot](databot.md) page.

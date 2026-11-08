---
title: Evaluation
description: How the platform checks that a change did not make its answers worse.
---

# Evaluation

The platform scores itself against a set of questions with known-good answers. Run
that set before and after a change. If the score falls, the change made things worse.

## Why the platform evaluates itself

Answers get worse quietly. A prompt edit, a new tool, a different model — each one
looks fine in a single conversation and breaks a hundred others. Evaluation turns that
into a number you can put in front of a change.

## What an evaluation case is

A case is a question, the context it runs in, what a good answer looks like, and a way
of scoring the difference between the two.

| Part | What it holds |
|---|---|
| The question | The user message to send |
| The context | Which models run it, and which tools the agent is allowed to use |
| What a good answer looks like | The tools it should call and in what order, how many reasoning rounds it may take, and the fields a correct reply must contain |
| The scoring | A number between 0 and 1 for each part, averaged into one score for the case |

Cases are grouped into suites. A suite is a named list of cases, and its average is
the number you compare against a bar.

## The two kinds of cases

**Specialist cases** check a specialist's own answer. The specialist runs the question
and you score what it did: which tools it called, in which order, how many rounds it
took, and whether the reply contains the right values.

**Routing cases** check that a question reached the right specialist. The router runs
the question and never hands off, so you score the routing decision alone: whether it
published a route or asked a clarifying question, which intentions it detected, and
which specialist it chose.

| Suite | Covers |
|---|---|
| databot | Data questions — model lookup, table cards, query drafting |
| knowledge | Team knowledge — ticket lookups and grounded answers |
| intent | Routing — each intention, a multi-specialist request, and a clarifying question |
| general | Answers that need no tool at all |

## How a run works

1. **Load the cases.** You pick a specialist and the suites to run.
2. **Run each case.** Every case runs once per model it lists, each on a fresh
   session, so one case does not influence the next.
3. **Score each run.** Tools, rounds and answer content each get a score. Partial
   credit is normal: calling the right tools in the wrong order still earns credit,
   and going over the round budget lowers the score gradually instead of failing it.
4. **Average per suite.** Every case counts equally, and every model counts equally
   within its case. A cancelled run counts as zero.
5. **Compare against a bar.** You set the minimum the suite average must reach. Below
   the bar, the run exits non-zero, which is what a pipeline or a pull request check
   needs.

The output names the cases, the models, and the three scores for each run, so a
failure points at a specific case rather than at a single number.

## What a failure looks like and what to do about it

| What you see | What it usually means | What to do |
|---|---|---|
| The tool score is low | The specialist called the wrong tools, or the right ones in the wrong order | Check whether the tool set still fits the question; adjust the case if the behaviour is intentional |
| The round score is low | The specialist needed more reasoning rounds than allowed, or fewer than expected | Raise the round budget if the extra work is justified; tighten the case if it should have answered directly |
| The answer score is low | The reply was right in substance but did not carry the expected fields | Make the expected fields flatter and the instruction in the question more explicit |
| The routing score is low | The router sent the question to the wrong specialist, or asked a question instead of answering | Check the intention labels and the routing expectations for the suite |
| The run cannot start | A backend the agent needs is unreachable, or a model name is unknown | Bring the backend up, or list the available models and suites before running |

Scores move for two different reasons: the platform got worse, or the expectation got
out of date. Read the per-case line before changing anything. If the platform is
behaving as intended, update the case. If it is not, fix the platform.

Evaluation cases are small data files that ship with the platform. A change to a case is
reviewed together with the behaviour it covers.

## What evaluation does not tell you

A passing suite means the platform still handles the questions you wrote down. It does
not mean every question is covered. Keep adding cases as new question types appear,
and keep them for the behaviour you would be annoyed to lose.

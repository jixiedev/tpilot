---
title: Memory
description: What the platform remembers between turns and across sessions, and how a long conversation is compressed.
---

# Memory

The platform remembers three things for you: the conversation you are in, what it has
learned about you, and anything it moved to disk because the conversation got long.

## What is remembered between turns and across sessions

| Kept | What it is | Where it lives |
|---|---|---|
| The conversation | Every message of the current session, plus the working state around it | A local checkpoint store on your machine |
| What it learned about you | Your role, team, permissions, language and analysis preferences | One profile file per user |
| What it moved to disk | Large tool results and older parts of the conversation | An archive folder on your machine |

A session survives a restart, and a profile follows you into the next session.
All three live in the platform's local data folder: the checkpoint store is one SQLite
file, profiles are one file per user, and archives are plain text files. Start with
`tahoepilot -v` to see the exact locations.

<figure class="tp-diagram">
  <img src="assets/diagrams/memory-layout.svg" alt="What is in play right now, and where everything else goes.">
  <figcaption>The window holds what is in play. Everything that leaves it is written to disk first.</figcaption>
</figure>

On the left of the diagram is the window: what the model sees on this turn. It holds
the instructions, your profile, the recent turns and the newest tool results. Older
messages leave it first. On the right are the four places everything else goes: the
offload store for large results, the archive, the profile store and the session
checkpoints. The rule underneath: nothing leaves the window without a copy on disk.

## How a session survives a restart

Each session is written to a checkpoint store as the conversation goes, not only at the
end. Start the platform with the same session name and the conversation resumes where
it left off: the earlier questions, the earlier answers, and the work in between.

Name a session when you want to come back to it — `tahoepilot -s alice` — and ask for
the storage locations with `tahoepilot -v`. Without a name, the platform picks a random
one, so every run starts fresh. Two names never share history.

Nothing is sent to a shared service. The checkpoint store is local.

<figure class="tp-diagram">
  <img src="assets/diagrams/session-layout.svg" alt="One session over time: ask, work, approve, answer, and come back later.">
  <figcaption>A session is one conversation. Every turn is saved, so the next question continues rather than starts again.</figcaption>
</figure>

The diagram follows one turn. You ask. The agent works one step at a time. At an
approval gate it waits for you. The answer comes back as text, and the turn is saved to
the session's checkpoint. A later question, or a later process, resumes from there.

What to know when you resume:

- **Later turns do not repeat the instructions.** They are written into the session on
  its first turn. Each later question is preceded by a marker that separates earlier
  history from the new request.
- **A specialist keeps its own history.** When intent hands your question to a
  specialist, the specialist runs on its own session derived from yours, so its tool
  traffic does not mix into yours.
- **Cancelling skips the save.** Answer an approval prompt with an exit command and the
  turn is cancelled and the session ends. The turn is not committed, and no profile
  refinement runs for it.
- **Use one process per session.** A process reads a session's checkpoint once and does
  not see what another process writes later.

## What a turn carries

One record carries a turn: the conversation so far, the step a pipeline is on, the
counters, the plan and what is known about you. Each step reads it, advances it and
writes it back. That record is what the checkpoint stores.

At the start of every turn the counters are reset, so each question gets a fresh tool
budget. Reminders the agent sees while it works, such as "your budget is spent", are
never saved.

The budget counts rounds, not calls: several tool calls made in parallel count once.
The terminal allows 30 rounds per turn. When they run out, the model is asked once more
without tools, so the turn always ends on a text answer.

## How a long conversation is compressed

A model can only hold so much. When the conversation fills up, older content is
compressed rather than dropped. Four steps run, cheapest first.

<figure class="tp-diagram">
  <img src="assets/diagrams/compressor.svg" alt="The window narrows in four steps, cheapest first, and everything that leaves is archived first.">
  <figcaption>The window narrows in four steps, cheapest first. Everything that leaves it is written to disk before it goes.</figcaption>
</figure>

The diagram shows a full window narrowing in four stages, top to bottom, until only a
summary and the recent turns remain. Each stage writes its copy to the archive on the
right before it removes anything. The model is used only at the last stage.

The compressor is an object attached to knowledge, diagnostic, data_analysis and swe. It
runs when a turn starts and after every round of tool calls. The staged pipelines inside
databot and plan do not compress; their tool budgets keep them short.

Fill is an estimate: the tokens of every message divided by the model's window. The
default window is 128,000 tokens, and the heavier steps start at 85% fill.

1. **Offload.** A large tool result — a query output, a file listing — is written to
   disk and replaced by a short preview plus the path to the full content. This runs on
   every pass, because it costs almost nothing.
   - Large means over 2,000 tokens by default.
   - The preview is the first 10 lines, capped at 2,000 characters. The cut can split a
     value; the file on disk is complete.
2. **Fold earlier turns.** From previous turns, only your questions and the answers you
   saw are kept. The tool traffic behind them is archived.
   - This also runs on every pass and never touches the current turn.
   - The archived calls go into one file. A short note naming the file takes their
     place, and the note survives later folds.
3. **Evict write inputs.** If the conversation is still large, the arguments of write
   actions are replaced by a path to a file. The write has already happened, so the
   payload is no longer needed in the conversation.
   - This runs only at 85% fill or above.
   - It covers writing or editing a file, saving content and ingesting a document, when
     the arguments exceed 500 tokens by default.
4. **Summarize.** Only if the conversation is still too large, the model folds the
   oldest part into a short summary of the intent, the progress so far, the key facts,
   the artifacts created, the next steps and the open questions.
   - Fill is measured again after the cheaper steps. This one runs only if they did not
     bring it below 85%.
   - The role instructions stay at the top. The newest messages stay word for word, up
     to a tenth of the window (12,800 tokens by default). Everything between is
     summarised.
   - If the model call fails, the step is skipped. The archive is still written.

Nothing is thrown away silently. Every step writes the original content to the archive
folder first and leaves the path in the conversation, so the agent can read it back when
an answer needs it. The agent can also compact on its own when it decides the
conversation has grown too long, and it can read an archived file back on request.

The agent is told to compact after a major phase of work, when you switch topics, or
when the history holds stale tool output. That forces steps 3 and 4 on the next pass,
however full the window is. To get content back, ask the agent; it reads the file the
pointer names. The files are plain text, so you can open them yourself too.

Archived files are pruned after a set number of days. A session resumed after a long
gap may point at a file that has already been removed.

The default is 30 days. If you resume sessions after long gaps, raise the number or
turn pruning off.

## What the platform remembers about you

Your profile is a small record kept per user. It holds your role, department and
region, the tables you may read and the columns you may not, your language and
timezone, your default time granularity and currency, and the metrics and dimensions
you prefer.

The profile is inserted into the platform's instructions at the start of a session, so
you do not have to repeat yourself. It is refined after each turn: the model proposes
an updated profile from your request and the reply, and the platform merges it in.
Empty values never overwrite what is already there.

Only fields with a value are inserted, and the agents are told to honour them.
Refinement is one extra model call at the end of a turn. It sees your current profile,
your latest request and the final reply. The merge works like this:

| In the update | What happens |
|---|---|
| An empty value or empty list | The current value is kept |
| A list with entries | It replaces the current list |
| Any other value | It replaces the current value |

A failed refinement is logged and ignored. Refinement can be switched off per agent.

The profile is applied when a session starts. A refinement made during a session shows
up in your next session, not in the one already running.

<figure class="tp-diagram">
  <img src="assets/diagrams/profile-store.svg" alt="A profile is one record per person, refined after each turn and written to disk.">
  <figcaption>One record per person, refined after every turn and written through to disk.</figcaption>
</figure>

The diagram shows your record next to other people's. It holds your role and team, the
tables you may read, the columns you may not see, and your language and currency. The
record moves in a loop: loaded once at the start of a session, refined after every turn,
written through to the profile store each time.

The user for a session is chosen in this order: the name you pass with
`tahoepilot -u alice`; the user stored in the session you resume; the user this process
already chose; the user identity set in your environment; your login name. The profile
file is named after that user. If none exists yet, you start empty and it fills in as
you work.

## How to forget a profile

Profiles are plain files in your local data directory. Delete the file for your user
and the next session starts with an empty profile. Ask for a different user and you get
a different profile. There is one profile per user, not per session.

Databot keeps one more file per user next to the profile: a history of its retrieval
turns. Delete it too if you want Databot to start fresh. To leave a conversation behind,
start a new session name.

## Limits to know

- **Match the window to the model.** A smaller model overflows before compression
  starts unless its window is set to match.
- **Counts are estimates.** Tool descriptions sent to the model are not counted.
- **Compression can be switched off.** Then nothing is offloaded, folded or summarised,
  but archived files can still be read.

## Where the memory behaviour is set

The switches that decide how much context is kept, when compression starts, which
tool results are archived and how long archives are kept live in the configuration.
See [Configuration](configuration.md). On a cluster, point the storage folders at storage that outlives the
pod, or the conversation is lost when the pod ends.

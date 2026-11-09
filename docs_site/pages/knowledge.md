---
title: Knowledge
description: What the knowledge base holds, how content is indexed, and how a question is answered from it.
---

# Knowledge

Your team's own material is indexed so that answers come in your team's words, not in a
model's memory. The knowledge base holds your tickets, your dbt models, and your
documents.

You do not query the knowledge base yourself. You ask a question, and the agent that
answers decides whether a search helps. The knowledge agent searches your Jira tickets.
Databot searches your dbt models when it looks for the tables behind a data question.

## What the knowledge base holds

| Source | What is indexed |
|---|---|
| Tickets | Each ticket as its own item, with its summary, description, comments, status, priority and links |
| dbt models | Each model with its description, columns, entities, owners, table and metrics |
| Documents | Files from a shared drive: text, markdown, spreadsheets and PDFs |

**Tickets** come from a Jira CSV export. Every row is one ticket. A row with neither a
summary nor a description is skipped. Each ticket is stored as two
parts: the ticket itself (summary and description) and its comments (summary and
comments). The issue key, status, priority, assignee and dates travel with every part.

Tickets live in one collection per Jira project. Five projects are known to the search:

| Project | What it covers |
|---|---|
| CORE | Shared infrastructure and current platform work. The default. |
| TAHOE | The older Tahoe board, for historical tickets. |
| DSE | Data science and engineering delivery. |
| CXDS | Consumer data science. |
| SQD | Support and queue tickets. |

**dbt models** come from the schema files of your semantic layer. Every model in a
schema file becomes one item. A model whose semantic layer is switched off is skipped. Each model is stored in
packed groups: one group carries the model header and as many columns as fit, another
carries the header and the model's metrics. One hit carries the whole model, so the
agent can describe the table without a second lookup.

**Documents** come from a shared-drive folder that you download and unzip first. Text,
markdown, web pages, Word documents, PDFs and spreadsheets are read; a spreadsheet keeps
the first 200 rows of each sheet. Images, video and archives are skipped.

Everything is stored in a Qdrant collection. The models that encode and rank your text
run on your machine; no hosted embedding service is used.

## How content gets in

Indexing is a scheduled job, not a side effect of asking a question. It works in two
steps: a plan step that lists the files to index and writes one task per file, then a
run step that processes those tasks and records its progress.

The run is resumable. If it is interrupted, it continues where it stopped. A file that
failed is not marked done, so the next run retries it and only it.

Before the first job, download the two models once: the embedding model and the
reranking model. Every machine that indexes content or answers questions needs them.

The ingest command has three steps:

| Step | What it does |
|---|---|
| Download | Fetches the embedding model and the reranking model into a local cache. |
| Plan | Scans a source — a Jira CSV file or folder, an unzipped drive folder, or a folder of dbt schema files — and writes a task list plus an empty progress record. |
| Run | Indexes the pending tasks and updates the progress record after each batch of files. |

When a run finishes with failures, it prints one line per failed file and exits with an
error. The files that succeeded are already in the index. Fix the cause and run the same
command again.

Each source has its own reader. The reader decides how an item becomes a document, how
the document splits into paragraphs, and what each paragraph carries. Everything after
that is shared:

1. **Chunking.** A document becomes paragraphs, and paragraphs become chunks small
   enough to embed. Chunks in a paragraph overlap slightly, so a sentence split across
   two chunks can still be found.
2. **Embedding.** Each chunk is encoded by a local embedding model into two
   representations: a dense vector that captures meaning, and a sparse vector that
   captures the actual words with their weights.
3. **Indexing.** Each chunk becomes one point in the Qdrant collection, carrying both
   representations plus the metadata that lets an answer name its source.

A chunk is at most 2,000 characters by default. The cut prefers a paragraph break, a
line break or the end of a sentence, as long as that point is at least half way into
the chunk. Neighbouring chunks share up to 200 characters. Tickets and documents are cut
this way. dbt models are not cut further: each packed group is one chunk.

Re-indexing a document replaces it rather than adding a second copy. When the number of
chunks changes, the old points are removed first, so a collection never holds two
versions of the same document.

Indexed text is not truncated. A description that does not fit in one chunk is packed
across several, with the header repeated, instead of being cut short.

## How a question uses the knowledge base

<figure class="tp-diagram">
  <img src="assets/diagrams/rag-flow.svg" alt="How a question is answered from the knowledge base">
  <figcaption>A question becomes a vector search and a keyword search, merged and reranked.</figcaption>
</figure>

The top band of the diagram shows how the index is filled: your material passes
through chunking and embedding into Qdrant. The lower bands follow a question from two
searches to one ranked list, then to the passages the model reads.

The same embedding model encodes your question, so it can be compared with the indexed
chunks. The question then goes out two ways at once:

- **A vector search** finds chunks that mean the same thing as the question, even when
  they use different words.
- **A keyword search** finds chunks that contain the exact terms, including ticket
  keys, table names and identifiers.

The two result sets are merged, the best matches are reranked against the question
itself, and duplicates are removed before they reach the model. Filtering by
metadata, such as a ticket project or a data layer, is applied to both searches, so a
narrow search is not starved of candidates.

Step by step, one search runs like this:

1. The agent picks a collection — a Jira project, or the dbt model layer — and writes a
   search phrase in plain language. A wildcard or an empty phrase is rejected: this is a
   search by meaning, not a Jira query.
2. Each of the two searches gathers up to 50 candidates by default.
3. The two lists are fused into one ranking. A chunk that ranks well in both rises to
   the top.
4. A second local model, the reranker, reads your phrase next to each candidate's text
   and scores how well it answers. The final order and score come from the reranker.
5. The search asks for more hits than it returns, because one ticket or one model can
   match in several chunks. It then keeps one hit per ticket, or one per model, and
   stops at the number the agent asked for.

A ticket search returns five tickets by default and at most twenty. Each hit carries the
issue key, summary, status, assignee, dates, a short preview of the description, and the
score.

## How the knowledge agent uses the results

The knowledge agent answers questions about your systems, runbooks, architecture,
catalog definitions and, when it matters, past Jira work. Ticket search is one of
several sources it can use, and not the first one it reaches for:

- For definitions, metrics, architecture and how-to questions, it prefers the DataHub
  catalog and glossary.
- It searches tickets when you ask about past work, incidents, ownership, migrations,
  or a named ticket or project, or when the other sources leave no usable clue.
- It picks the Jira project from the list above and keeps the number of results small.

The knowledge agent has a budget of ten tool calls per question. The full list of what
it can use is in [Agents](agents.md).

## What a good answer looks like

A grounded answer quotes or points at the passages it used, and names where they came
from — the ticket, the model, the document. When the knowledge base does not cover the
question, the answer says so rather than inventing one.

For an answer backed by tickets, the agent cites the issue keys, and the scores when
they help. It does not invent ticket numbers, owners or resolutions that the search did
not return. If the search found nothing relevant, it tells you.

## How to keep the index fresh

The index changes only when an ingest job runs. Plan the job to match how often your
sources change.

- **Changed items.** Run the job again over the same source. Each ticket, model or file
  that is read again replaces its old points.
- **Deleted items.** A ticket, file or model removed from the source keeps its points.
  Recreate the collection to drop them.
- **A moved drive folder.** A document is keyed on its full file path. After you move
  the unzipped folder, recreate the collection, or the old copies stay.
- **Re-planning.** A new plan resets progress, not data. Points already in Qdrant stay,
  and each document is replaced when it is indexed again.

## Limits

- Document collections are indexed, but no search tool reads them yet. Today, agents
  search tickets and dbt models only.
- The ticket and model collections that the agents search have fixed names. Index into
  those names, or the agents will not find your content.
- A failed file has no points until it is retried, because its old points are removed
  before the new ones are written.
- Characters are not words. Text in languages such as Chinese, or text heavy with code,
  can exceed what the embedding model reads in one chunk, and the end of the chunk is
  dropped. Lower the chunk size for such material.

The tools that perform these lookups are listed in [Tools](tools.md).

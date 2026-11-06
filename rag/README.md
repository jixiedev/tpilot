# RAG ingest and retrieval

`rag/` turns source material (Jira CSV exports, extracted Google Drive folders, dbt schema yml files) into points in a local Qdrant collection, and provides the hybrid search plus rerank that the retrieval tools call at query time.

Ingest builds a **document → paragraph → chunk** graph for each source file, embeds every chunk with local BGE-M3 (dense + sparse), and upserts one Qdrant point per chunk. Retrieval embeds the query the same way, fuses dense and sparse candidates with Qdrant RRF, and reranks them with a local cross-encoder.

Related docs:

- [`tools/README.md`](../tools/README.md) — the retrieval tools `fetch_related_models` and `fetch_related_jira_tickets` (`tools/rag/`) that call `rag.qdrant.search`.
- [`agent/specialists/databot/README.md`](../agent/specialists/databot/README.md) — how Databot uses `fetch_related_models` results (`TableCard`).
- [`agent/README.md`](../agent/README.md) — the Knowledge agent that calls `fetch_related_jira_tickets`.
- [`config/README.md`](../config/README.md) — the rest of `config/`.
- [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) — where RAG sits in the whole platform.

## Concepts

| Term | Meaning | Code |
|------|---------|------|
| Document | One logical source item: a Jira ticket (one CSV row), one Drive file, one dbt model. Carries `doc_id`, `url`, `title`, `content`. | `rag.document.Document` and subclasses `JiraDocument`, `DriveDocument`, `ModelDocument`, `MarkdownDocument` |
| Paragraph | A semantic section of a document: ticket body vs. comments, a markdown heading block, a packed dbt columns or metrics group. | `Paragraph`, `TextParagraph`, `MarkdownParagraph` |
| Chunk | The embedding unit. One chunk becomes one Qdrant point. Chunks of a paragraph are linked (`prev` / `next`) so the payload carries `prev_chunk_seq` / `next_chunk_seq`. | `rag.document.Chunk` |
| Split strategy | Turns paragraphs into chunks. `LengthSplitStrategy` splits by characters with overlap; `IdentitySplitStrategy` keeps one chunk per paragraph. | `rag.chunking` |
| Reader | Iterator that yields documents from a source. | `rag.document.Reader`, `rag.jira.JiraCsvReader` |
| Collection | A Qdrant collection with two named vectors: `dense` (1024-d cosine) and `sparse` (lexical weights). Every collection used for search must have both. | `rag.qdrant.ensure_collection` |
| Dense / sparse vector | BGE-M3 returns a dense embedding and lexical (token-id → weight) weights from one encode call. Both must be non-empty for ingest and query. | `rag.embeddings.get_embeddings` |
| Rerank | A cross-encoder (`BAAI/bge-reranker-v2-m3`) rescores the fused candidates against the query text. | `rag.qdrant.rerank_points` |
| Task list | JSON written by `plan`: job type, source root, collection, and one task per source file. | `rag.job.write_task_list` |
| Checkpoint | JSON bound to one task list (by SHA-256) that records which task ids are complete and how many points were uploaded. | `rag.job.write_checkpoint` |

## Design

- **Resumable, file-level jobs.** `plan` enumerates source files once; `run` ingests them file by file and rewrites the checkpoint after each batch. An interrupted or partially failed run resumes where it stopped. A failed file is not marked complete, so the next `run` retries it.
- **Models are downloaded once, never at query time.** `python -m rag download` puts both BAAI models in a local cache. Ingest and search resolve models only from local directories (`resolve_model_dir`, `local_files_only=True` for the reranker) and raise `FileNotFoundError` with the download command if they are missing.
- **Source-specific readers, one shared pipeline.** Each source only decides how to build documents, how to split them into paragraphs, and what payload / point id each chunk gets (`chunk_payload`, `chunk_embed_text`, `chunk_point_id`). Splitting, embedding, batching, and upsert are shared (`rag.ingest.upsert_documents`).
- **Re-ingest replaces a document.** Every chunk payload carries `doc_key`, a stable per-document key that does not depend on chunk layout or on the `plan -p` root (`Document.doc_key`: `jira:<issue key>`, `drive:<absolute file path>`, `dbt:<yml path>::<model>`). Before upserting a document's new chunks, ingest deletes every point with that `doc_key` (`rag.qdrant.delete_points_by_doc_keys`), so a changed chunk layout never leaves stale points. Point ids are still deterministic (`stable_point_id`, a UUID-shaped SHA1).
- **No silent truncation of indexed text.** Chunks are sized to `[embedding].max_chars` before embedding, and dbt descriptions are packed across extra chunks rather than cut.
- **Local embeddings only.** `EMBEDDING_PROVIDER` set to anything other than `local` is rejected by `rag.config.get_rag_config`.

## Layout

| Path | Role |
|------|------|
| `rag/document.py` | Document / paragraph / chunk graph, `Reader`, `stable_point_id`, `link_sequence` |
| `rag/chunking.py` | `split_text`, `normalize_whitespace`, `LengthSplitStrategy`, `IdentitySplitStrategy` |
| `rag/markdown.py` | Heading-aware `MarkdownDocument`, `PdfDocument` (Tika), `markdown_section_texts` |
| `rag/embeddings.py` | BGE-M3 dense + sparse encode, device selection, sparse fallbacks, `to_sparse_vector` |
| `rag/local_models.py` | Model cache location, `download_configured_models`, offline `resolve_model_dir` |
| `rag/qdrant.py` | Client, `ensure_collection`, `upsert_points`, hybrid `search`, `rerank_points` |
| `rag/ingest.py` | Shared pipeline: `iter_document_chunks`, `upsert_chunks`, `upsert_documents` |
| `rag/job.py` | `plan_ingest` / `run_ingest`, task list and checkpoint files |
| `rag/__main__.py` | CLI: `plan`, `run`, `download` |
| `rag/config.py` | `RagConfig` loaded from `config/rag.toml` plus env overrides |
| `rag/jira/` | Jira CSV reader and `upload_jira_csv` |
| `rag/drive/` | Extracted Google Drive folder reader and `upload_google_drive` |
| `rag/dbt/` | dbt semantic-model reader and `upload_semantic_models` |
| `rag/tika/` | Bundled Tika server jar (only needed for `PdfDocument.open`) |
| `rag/samples/` | Sample markdown / PDF used by tests |
| `rag-jobs/` | Task-list and checkpoint JSON files (e.g. `aug_dbt_models.json`) |
| `docker/qdrant/` | Docker Compose file for a local Qdrant |

## Data flow

```
  python -m rag plan                          python -m rag run
  ------------------                          -----------------
  source path                                 tasks.json + tasks.checkpoint.json
      |                                           |  (sha256 of tasks.json must match)
      v                                           v
  list_source_paths(job_type)                 pending = tasks - checkpoint.completed
      |  jira: *.csv   drive: files               |
      |  dbt: *.yml / *.yaml                      |  for each batch of --batch-size files:
      v                                           v
  tasks.json  (one task per file)             ingest_task(job_type, path)
  tasks.checkpoint.json (completed=[])            |
                                                  v
                     +----------------------------+----------------------------+
                     | JiraCsvReader            | documents_from_path       | documents_from_yml
                     | row -> JiraDocument      | file -> DriveDocument     | model -> ModelDocument
                     +----------------------------+----------------------------+
                                                  |
                                                  v
                                 Document.split_paragraphs()
                                                  |
                                 SplitStrategy.split_paragraph()
                                   Length (jira, drive)  /  Identity (dbt)
                                                  |
                                                  v
                                 Chunk -> embed_text / payload / point_id
                                                  |
                                 get_embeddings (BGE-M3, batches of [embedding].batch_size)
                                                  |   dense[1024] + sparse{token: weight}
                                                  v
                                 ensure_collection -> upsert_points (Qdrant)
                                                  |
                                 task id appended to checkpoint.completed
                                 checkpoint rewritten after each batch

  Query time (tools/rag/*)
  ------------------------
  query --> get_embedding --> query_points(prefetch dense + prefetch sparse,
                                           same filter on both, RRF fusion,
                                           limit = max(top_k, [rerank].prefetch_limit))
        --> rerank_points (bge-reranker-v2-m3 on query vs passage_text(payload))
        --> top_k hits [{id, score, payload}] --> tool dedupes by issue_key / model_name
```

### Ingest details

1. **Plan** (`plan_ingest`). Normalizes the job type (aliases: `google_drive` → `drive`, `model` → `dbt`), lists source files, and writes the task list. Each task is `{"id", "path"}`; the id is the path relative to the source root, or the file name when the source is a single file. A fresh checkpoint with `completed: []` is written next to it. Both files are written atomically (temp file + rename).
2. **Run** (`run_ingest`). Loads the task list and computes its SHA-256. If the checkpoint file exists, its `task_list_sha256` must match or the run fails. With `--recreate-collection`, the collection is dropped and a fresh checkpoint for this task list is written; the old checkpoint is not read or validated, so a checkpoint from another task list does not block recovery. Pending tasks are processed in batches of `--batch-size` files.
3. **Per file** (`ingest_task`). The source module builds documents; `upsert_documents` splits them with the strategy for that source and calls `upsert_chunks` with the documents' `doc_key`s, which first deletes the existing points of those documents.
4. **Embed and upsert** (`upsert_chunks`). Chunks with empty embed text are dropped. Chunks are embedded in batches of `[embedding].batch_size`. A failed embed or upsert batch is logged, the remaining batches still run, and then a `RuntimeError` is raised so the file is not checkpointed.
5. **Checkpoint**. After each batch of files, the checkpoint is rewritten with the ids that succeeded and the running point count. A failed task is logged (`Task <id> failed: ...`) and the remaining tasks still run; at the end `run_ingest` raises `IngestFailedError` (listing the failed ids) after the final checkpoint write, so a rerun retries only the failures.

### Chunking

`split_text` normalizes whitespace, then cuts windows of `chunk_chars` characters. Inside a window it prefers to break at the last `\n\n`, `\n`, or `. ` if that point is at least half way through the window. Consecutive chunks overlap by `overlap` characters (capped at half the chunk size).

`length_strategy_for_embeddings()` uses `chunk_chars = [embedding].max_chars` and `overlap = min(200, max_chars // 2)`, so every chunk fits the embedding window. `get_embeddings` also truncates each text to `max_chars` as a final guard.

### Embeddings

`rag.embeddings` loads `BGEM3FlagModel` from the local cache with `return_dense=True`, `return_sparse=True`, normalized embeddings, and `max_length = [embedding].max_seq_length`. fp16 is used except on `cpu` and `mps`.

Device selection (`resolve_bge_devices`): empty `device` means `mps` on macOS and FlagEmbedding's auto choice elsewhere; any `mps:N` value is rewritten to `mps`, because `mps:0` tends to return empty lexical weights for batched encodes.

Empty sparse rows are recovered in this order: re-encode the batch on CPU, re-encode the single text on CPU, then fall back to token-id counts from the tokenizer. An empty dense or sparse vector after that raises `ValueError`.

### Retrieval

`rag.qdrant.search(collection_name, query, *, limit=5, score_threshold=None, query_filter=None)`:

- Refuses collections that are not named-vector hybrid (`dense` + `sparse`).
- Issues one `query_points` call with a dense prefetch and a sparse prefetch, each with `limit = max(limit, [rerank].prefetch_limit)` and the same `query_filter`. Applying the filter on each prefetch keeps filtered searches (for example `chunk_type = "model+columns"`) from being starved by fusion.
- Fuses with RRF, then reranks with `bge-reranker-v2-m3`. The reranker scores the query against `passage_text(payload)`: `chunk_data`, else `text`, else a synthesized `Model / Type / description / Columns / Metrics` text for dbt payloads.
- Returns at most `limit` hits as `{"id", "score", "payload"}`. `score` is the rerank score; `score_threshold` filters on it. With an empty `[rerank].model`, the fused RRF order and scores are returned instead.

The tools over-fetch and dedupe: `fetch_related_jira_tickets` requests `max(limit * 4, 10)` hits and dedupes by `issue_key`; `fetch_related_models` requests `max(limit * 6, 20)` and dedupes by `model_name`. See [`tools/README.md`](../tools/README.md).

## Setup

### Python dependencies

```bash
uv sync --extra rag
# or, from a package install
pip install 'tahoepilot[rag]'
```

The `rag` extra brings in `qdrant-client`, `FlagEmbedding`, `torch`, `pypdf`, `python-docx`, `openpyxl`, `markdown-it-py`, and `tika`.

### Local Qdrant

Qdrant is not bundled in the package. For development, use the Compose file in `docker/qdrant/` (image `qdrant/qdrant:v1.15.5`, container `tahoepilot-qdrant`):

```bash
cd docker/qdrant
docker compose up -d
```

| Item | Value |
|------|-------|
| REST | `http://localhost:6333` |
| gRPC | `localhost:6334` |
| Dashboard | http://localhost:6333/dashboard |
| Data volume | `docker/qdrant/qdrant_storage/` (gitignored) |

`docker/qdrant/bin/` may hold a locally downloaded Qdrant binary (`dist-qdrant.zip`, `qdrant`, `static/`) with its own `storage/` and `snapshots/`. These are dev-only and gitignored by `docker/qdrant/.gitignore`. Use Compose or your own Qdrant deployment elsewhere.

Check that Qdrant is up:

```bash
curl -s http://localhost:6333/readyz
curl -s http://localhost:6333/collections | python -m json.tool
```

### Models

Download both models once, before any ingest or search:

```bash
python -m rag download
# when huggingface.co resets connections:
export HF_ENDPOINT=https://hf-mirror.com
export HF_HUB_DISABLE_XET=1
python -m rag download
```

| Model | Config key | Role |
|-------|------------|------|
| `BAAI/bge-m3` | `[embedding].model` | Dense + sparse embeddings |
| `BAAI/bge-reranker-v2-m3` | `[rerank].model` | Cross-encoder rerank |

Models land in `~/.cache/tahoepilot/models/<repo id>/` (override with `TAHOEPILOT_MODELS_DIR`). The snapshot skips `imgs/*`, `.DS_Store`, ONNX, Flax, TF, and Rust weights; hf-mirror rejects `imgs/.DS_Store` with 403. Without `HF_ENDPOINT`, a connection failure to the Hub is retried once through `https://hf-mirror.com`, and Xet downloads are disabled for the mirror. A model value that is an existing directory is used as-is and must already contain the weight, tokenizer, and (for the embedder) `colbert_linear.pt` / `sparse_linear.pt` files.

### Tika (optional)

Only `rag.markdown.PdfDocument.open` uses Tika, and no CLI job type calls it; Drive ingest reads PDFs with pypdf. To use `PdfDocument` directly, start the bundled server and point `TIKA_SERVER_ENDPOINT` at it (default `http://localhost:9998`):

```bash
java -jar rag/tika/tika-server-standard-3.3.2.jar
```

## Configuration

Settings come from `config/rag.toml` (`rag.config.get_rag_config`, cached per process). If the file is missing, defaults plus the env vars below are used.

| Key | Default | Meaning |
|-----|---------|---------|
| `[qdrant].url` | `http://localhost:6333` | Qdrant REST URL |
| `[qdrant].api_key` | `""` | API key literal (prefer the env var) |
| `[qdrant].api_key_env` | `QDRANT_API_KEY` | Env var whose value overrides `api_key` |
| `[qdrant].timeout_seconds` | `30.0` | Client timeout |
| `[embedding].model` | `BAAI/bge-m3` | Hub id under the model cache, or a local directory |
| `[embedding].vector_size` | `1024` | Dense size; must match the model and existing collections |
| `[embedding].device` | `""` | `""`, `cpu`, `cuda`, `mps` (do not use `mps:0`) |
| `[embedding].max_seq_length` | `512` | Token cap for encode (also the reranker `max_length`) |
| `[embedding].max_chars` | `2000` | Chunk size in characters and final truncation guard |
| `[embedding].batch_size` | `8` | Texts per encode / upsert batch (also reranker batch size) |
| `[rerank].model` | `BAAI/bge-reranker-v2-m3` | Reranker; empty string disables rerank |
| `[rerank].prefetch_limit` | `50` | Candidates per prefetch before fusion and rerank |

Env overrides (applied on top of the file):

| Variable | Overrides |
|----------|-----------|
| `QDRANT_URL` | `[qdrant].url` |
| `QDRANT_API_KEY` (or whatever `api_key_env` names) | `[qdrant].api_key` |
| `EMBEDDING_MODEL` | `[embedding].model` |
| `EMBEDDING_VECTOR_SIZE` | `[embedding].vector_size` |
| `EMBEDDING_DEVICE` | `[embedding].device` |
| `EMBEDDING_PROVIDER` | Must be unset or `local`; anything else raises |
| `TAHOEPILOT_MODELS_DIR` | Model cache root |
| `HF_ENDPOINT`, `HF_HUB_DISABLE_XET` | Hub endpoint for `download` |
| `TIKA_SERVER_ENDPOINT` | Tika server for `PdfDocument.open` |

The defaults keep CPU / MPS memory bounded on long Jira descriptions. Raise `max_seq_length`, `max_chars`, or `batch_size` only with spare GPU memory.

## CLI

```
python -m rag {plan,run,download} ...
```

`plan` scans a source and writes a task list plus a fresh checkpoint. `run` ingests the pending tasks. `download` fetches the configured models.

```bash
python -m rag plan -t <TYPE> -p <PATH> -c <COLLECTION> --tasks <tasks.json> [--checkpoint <checkpoint.json>] [--start-line N]
python -m rag run --tasks <tasks.json> [--checkpoint <checkpoint.json>] [--batch-size N] [--recreate-collection]
python -m rag download
```

| Flag | Command | Meaning |
|------|---------|---------|
| `-t` / `--job-type` | plan | `jira` \| `drive` \| `dbt` (aliases `google_drive`, `model`). `wiki` is reserved and raises "not implemented". |
| `-p` / `--path` | plan | Jira: a CSV file or a directory searched recursively for `*.csv`. Drive: a directory of extracted files. dbt: a directory searched recursively for `*.yml` / `*.yaml`. |
| `-c` / `--collection-name` | plan | Target Qdrant collection, stored on the task list |
| `--tasks` | plan, run | Task-list JSON to write (plan) or read (run) |
| `--checkpoint` | plan, run | Checkpoint JSON. Default `<tasks stem>.checkpoint.json` next to the task list. |
| `--start-line` | plan | Jira only: skip the first N data rows of each CSV; stored on the task list |
| `--batch-size` | run | Source files ingested between checkpoint writes (default 1, must be ≥ 1) |
| `--recreate-collection` | run | Delete the target collection and start from a fresh checkpoint (an existing checkpoint is ignored, even one for another task list) |

Exit codes:

| Code | When |
|------|------|
| `0` | Every task completed (or nothing was pending). |
| `1` | `run` finished but at least one task failed. A summary (`Ingest incomplete: N/M task(s) failed ...` plus one `<task id>: <error>` line per failure) is printed to stderr. Successful tasks are checkpointed; rerun the same command to retry only the failed ones. |
| `2` | `FileNotFoundError`, `NotImplementedError`, or `ValueError`, for example a missing source path or a checkpoint that belongs to another task list (without `--recreate-collection`). |

Resume rules for `run`: if the checkpoint file exists it must match the task list and ingest resumes from it; if it does not exist ingest starts from the beginning. Re-running `plan` overwrites both files and resets progress (points already in Qdrant stay).

### File formats

Task list (`version` 1):

```json
{
  "version": 1,
  "job_type": "dbt",
  "source_path": "/abs/path/to/models/hive",
  "collection": "aug_dbt_models",
  "start_line": 0,
  "created_at": "2026-10-08T03:32:05+00:00",
  "tasks": [{"id": "abtesting/assignment.yml", "path": "/abs/path/to/models/hive/abtesting/assignment.yml"}]
}
```

Checkpoint (`version` 1): `task_list` (absolute path), `task_list_sha256`, `completed` (task ids), `uploaded_points`, `updated_at`.

## Sources

### Jira CSV (`-t jira`)

```bash
python -m rag plan -t jira -p ~/Jira-tahoe.csv -c aug_jira_tahoe --tasks ./rag-jobs/aug_jira_tahoe.json
python -m rag run --tasks ./rag-jobs/aug_jira_tahoe.json

# skip the first 500 data rows
python -m rag plan -t jira -p ~/Jira-tahoe.csv -c aug_jira_tahoe --tasks ./rag-jobs/aug_jira_tahoe.json --start-line 500
```

- One `JiraDocument` per row; rows with neither summary nor description are skipped. Columns that are empty in every row are dropped.
- Recognized headers include `Summary`, `Description`, `Issue key`, `Issue id`, `Project key`, `Status`, `Priority`, `Assignee`, `Reporter`, `Created`, `Updated`, `Issue Type`, and every `Comment` / `Comment.N` column (deduplicated, joined with `---`).
- Paragraphs: `ticket` (`Summary:` + `Description:`) and `comments` (`Summary:` + `Comments:`). Each is length-split to `max_chars`.
- Point id: a ticket that fits in one chunk keeps its integer `Issue id`; multi-chunk tickets use `stable_point_id("<issue key>#<para_seq>#<chunk_seq>")`. `doc_key` is `jira:<issue key>` (else the issue id), so re-ingesting a ticket whose chunk count changed replaces all of its points.
- Payload: `issue_key`, `issue_id`, `summary`, `description` and `comments` (each truncated to 4000 characters in the payload only), `status`, `priority`, `assignee`, `reporter`, `created`, `updated`, `issue_type`, `project`, plus the common chunk fields. `doc_url` is a browse link on the Jira site configured in `rag/jira/document.py`.

### Google Drive folders (`-t drive`)

Download the Drive folder, unzip it, then point ingest at the extracted tree. Zip files are skipped with a warning.

```bash
mkdir -p ~/gdrive_exports   # unzip the downloaded Drive folder(s) here
python -m rag plan -t drive -p ~/gdrive_exports -c gdrive_tahoe --tasks ./rag-jobs/gdrive.json
python -m rag run --tasks ./rag-jobs/gdrive.json
```

| Files | Extraction |
|-------|------------|
| `.txt`, `.md`, `.markdown`, `.rst`, `.csv`, `.tsv`, `.json`, `.yaml`, `.yml`, `.log` | Decoded text (utf-8, utf-8-sig, latin-1) |
| `.html`, `.htm` | Text with `script` / `style` / `noscript` removed |
| `.docx` | Paragraphs and table rows (python-docx) |
| `.pdf` | Page text (pypdf, no Tika) |
| `.xlsx`, `.xlsm` | Each sheet, first 200 rows, cells joined with `\|` |
| Images, video, archives, executables, Google shortcut stubs (`.gdoc`, `.gsheet`, …), `.DS_Store`, `__MACOSX/`, `.git/`, `node_modules/` | Skipped |

Markdown files are split on headings into paragraphs; other files are a single paragraph. Paragraphs are length-split to `max_chars`. The embed text is prefixed with `Title:` and `Path:`; the payload carries `source="google_drive"`, `path` (relative to the plan source root), `title`, `suffix`, `chunk_index`, and `text`. Point ids are keyed on the relative path; `doc_key` is `drive:<absolute file path>`, so ingesting the same file from a different plan root replaces its points instead of duplicating them. No retrieval tool reads Drive collections yet.

### dbt semantic models (`-t dbt`)

```bash
python -m rag plan -t dbt -p ~/wbox/data-governance/semantic_layer/models/hive -c aug_dbt_models --tasks ./rag-jobs/aug_dbt_models.json
python -m rag run --tasks ./rag-jobs/aug_dbt_models.json --recreate-collection
```

Each `models[]` entry in a schema yml becomes one `ModelDocument` (the sibling `<model name>.sql`, if present, is read into the payload). Paragraphs are packed groups, one chunk each (`IdentitySplitStrategy`):

- `model+columns` — model header (name, description, owner, hive table, usage, agg time dimension) plus as many column blocks (name, description, entity / dimension / granularity / data tests) as fit in `max_chars`.
- `model+metrics` — the same header plus packed MetricFlow metric blocks (name, description, type / agg / expr / label).

`pack_embed_sections` repeats the header on every chunk and splits a single oversized block rather than truncating it. The payload carries the whole structured model (`model_name`, `description`, `columns`, `metrics`, `column_names`, `metric_names`, `sql`, `owner`, `hive_table`, `usage`, …) plus `chunk_type`, so one hit is enough for `fetch_related_models` to build a `TableCard`.

Packed groups are a compromise: one chunk per model overflows the 512-token encoder window, and one chunk per column biases top-K toward large models. The tool dedupes hits by `model_name`.

Models with `semantic_model.enabled: false` are skipped. Point ids are `stable_point_id("<yml path>::<model>::<columns|metrics>::<para_seq>")`; `doc_key` is `dbt:<yml path>::<model>`, so when the number of column chunks changes (shifting metrics `para_seq`) the model's old points are deleted first. Top-level MetricFlow `semantic_models: [...]` blocks are not parsed; keep metrics inline on the model.

### Collections used by the tools

The collection names are hard-coded in `tools/rag/jira.py` (`JIRA_PROFILES`) and `tools/rag/dbt_models.py` (`SEMANTIC_PROFILES`). Ingest into these names:

| Source | Collection | Read by |
|--------|------------|---------|
| Jira TAHOE | `aug_jira_tahoe` | `fetch_related_jira_tickets(project="tahoe")` |
| Jira CORE | `aug_jira_core` | `fetch_related_jira_tickets(project="core")` |
| Jira DSE | `aug_jira_de` | `fetch_related_jira_tickets(project="de")` |
| Jira CXDS | `aug_jira_ds` | `fetch_related_jira_tickets(project="ds")` |
| Jira SQD | `aug_jira_sqd` | `fetch_related_jira_tickets(project="sqd")` |
| dbt semantic models | `aug_dbt_models` | `fetch_related_models(layer="hive_analytics")` |
| Google Drive | any (e.g. `gdrive_tahoe`) | not read by a tool yet |

## Python API

```python
from rag.jira import upload_jira_csv
from rag.drive import upload_google_drive
from rag.dbt import upload_semantic_models
from rag.job import plan_ingest, run_ingest
from rag.qdrant import search

# one-shot, in-process, no checkpoint
upload_jira_csv("~/Jira-tahoe.csv", "aug_jira_tahoe")
upload_google_drive("~/gdrive_exports", "gdrive_tahoe")
upload_semantic_models("~/wbox/data-governance/semantic_layer/models/hive", "aug_dbt_models")

# resumable, same as the CLI
plan_ingest(job_type="dbt", source="~/wbox/data-governance/semantic_layer/models/hive",
            collection="aug_dbt_models", tasks_path="./rag-jobs/aug_dbt_models.json")
run_ingest(tasks_path="./rag-jobs/aug_dbt_models.json")  # raises rag.job.IngestFailedError if any task failed

hits = search("aug_jira_core", "Hudi compaction failures", limit=5)
```

## Adding a source type

1. Create `rag/<source>/` with a `Document` subclass. Override `split_paragraphs()` if the source has natural sections, and `chunk_payload()`, `chunk_embed_text()`, `chunk_point_id()` for the payload, embed text, and a stable id key. Keep point ids deterministic, and override `doc_key` with a key that identifies the document independently of chunk layout and of the plan root (re-ingest deletes points by it).
2. Add a `list_<source>_paths(path)` function that returns the files to ingest, and a function that builds the documents for one file.
3. Wire both into `rag/job.py`: add the name to `JOB_TYPES` (and `JOB_ALIASES` if needed), a branch in `list_source_paths`, and a branch in `ingest_task` that calls `upsert_documents` with `length_strategy_for_embeddings()` or `IdentitySplitStrategy()`.
4. Update the `--job-type` help text in `rag/__main__.py`.
5. Add tests next to `tests/test_rag_jira.py`, `tests/test_rag_drive.py`, `tests/test_rag_job.py`, and a re-ingest case in `tests/test_rag_reingest.py` (in-process `QdrantClient(":memory:")`, fake embeddings).
6. If an agent should search it, add a retrieval tool under `tools/rag/` (see [`tools/README.md`](../tools/README.md)).

## Pitfalls

- **Vector layout is fixed per collection.** `ensure_collection` refuses a collection whose dense size differs from `[embedding].vector_size` or that is not `dense` + `sparse`. Fix with `run --recreate-collection`.
- **A non-zero exit can still have written data.** `run` exits `1` when any task failed, but the tasks that succeeded are already in Qdrant and in the checkpoint. Fix the cause and rerun the same command; only the failed tasks run again.
- **Re-planning resets progress, not data.** `plan` writes an empty checkpoint; existing points remain, and each document's points are replaced (deleted by `doc_key`, then upserted) when it is ingested again.
- **Collections ingested before `doc_key` existed.** Their points have no `doc_key` payload, so re-ingest cannot find and delete them; the old layout's stale points (for example a Jira ticket's integer-id point, shifted dbt metric ids, Drive files planned from another root) stay. Run once with `--recreate-collection` to migrate. New collections get a keyword payload index on `doc_key`; older ones filter without it.
- **Delete happens before upsert.** If embedding or upsert of a document then fails, that document has no points until the failed task is rerun (the task is not checkpointed and the command exits `1`).
- **Drive `doc_key` is the absolute file path.** Planning from a different `-p` root replaces the points (no duplicates), but moving the extracted folder changes the key; re-ingest from a new location leaves the old points. Use `--recreate-collection` after moving the export. The payload `path` is still relative to `-p`.
- **Files removed from the source are not deleted.** Only documents that are ingested again are replaced; a deleted Jira row, Drive file, or dbt model keeps its points until `--recreate-collection`.
- **`--start-line` applies to every CSV** in a directory task list, not only the first.
- **Characters are not tokens.** `max_chars = 2000` can exceed 512 tokens for CJK or code-heavy text; BGE-M3 then truncates at `max_seq_length`. Lower `max_chars` for such corpora.
- **Apple Silicon.** Use `device = "mps"` or leave it empty, never `mps:0`. If sparse vectors are still empty, the CPU retry slows ingest; set `device = "cpu"` to avoid the double encode.
- **Missing models fail at query time,** not silently: run `python -m rag download` on every machine that runs ingest or the retrieval tools.
- **`config/rag.toml` is read once per process** (`lru_cache`); restart after editing it.

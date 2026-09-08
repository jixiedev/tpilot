# RAG ingest (Qdrant)

Index Jira CSV exports and Google Drive folder downloads into local Qdrant for Knowledge agent retrieval.

Ingest builds a **document → paragraph → chunk** graph, then a shared pipeline embeds chunks and upserts them to Qdrant.

### Layout

| Module | Role |
|--------|------|
| `rag.document` | Document / paragraph / chunk graph |
| `rag.chunking` | Paragraph and length-based chunk strategies |
| `rag.ingest` | Embed chunks and upsert to Qdrant |
| `rag.markdown` | Heading-aware markdown and PDF documents |
| `rag.qdrant` / `rag.embeddings` / `rag.config` | Store, vectors, settings |
| `rag.jira` | Jira CSV ingest |
| `rag.drive` | Google Drive extracted-folder ingest |
| `rag.dbt` | dbt semantic-model ingest |

### Sources

| Source | Paragraphs | Chunks |
|--------|------------|--------|
| Jira CSV | summary+description and comments as separate paragraphs | length-split to the embedding window; one point per chunk |
| Google Drive | markdown headings for `.md`; otherwise the whole file | overlapping chunks sized to `[embedding].max_chars` |
| dbt models | packed `columns` / `metrics` groups | one point per packed group (no truncation) |
| PDF / markdown | heading sections (`PdfDocument` / `MarkdownDocument`) | then the same length splitter |

PDF ingest via `PdfDocument.open` expects a Tika server (`TIKA_SERVER_ENDPOINT`, default `http://localhost:9998`). Drive ingest extracts PDFs with pypdf so it does not require Tika.

## Prerequisites

1. Start Qdrant (dev only — not bundled in the PyPI wheel):

**Recommended:** Docker Compose (official image):

```bash
cd docker/qdrant
docker compose up -d
```

- REST: `http://localhost:6333`
- Dashboard: http://localhost:6333/dashboard
- Data volume: `docker/qdrant/qdrant_storage/` (gitignored)

`docker/qdrant/bin/` may contain a local Qdrant binary download (`dist-qdrant.zip`, runtime `storage/`) for offline dev. That directory is **dev-only** — it is gitignored / not shipped in the published package. Use Docker Compose or your own Qdrant deployment for production.

Install RAG Python deps:

```bash
pip install 'tahoepilot[rag]'
# or from the repo: uv sync --extra rag
```

2. Configure embeddings in `config/rag.toml` (local **BAAI/bge-m3** dense + sparse, then **BAAI/bge-reranker-v2-m3**).

```bash
# optional overrides
export QDRANT_URL="http://localhost:6333"
export EMBEDDING_MODEL="BAAI/bge-m3"
export EMBEDDING_VECTOR_SIZE="1024"
# export EMBEDDING_DEVICE="cpu"   # or cuda / mps
```

Ingest uses FlagEmbedding `BGEM3FlagModel` so each point stores a dense vector and a lexical sparse vector. Both must be non-empty. Search fuses the two with Qdrant RRF, then reranks the fused candidates. Caps (`max_seq_length=512`, `max_chars=2000`, `batch_size=8`) keep long Jira descriptions from blowing memory. Raise those in `config/rag.toml` only if you have spare GPU/MPS RAM. dbt ingest packs columns/metrics into multiple chunks instead of truncating.

First run downloads the embedder and reranker from Hugging Face into the local cache (several GB).
If `huggingface.co` resets connections (common on some networks), use a mirror before ingest:

```bash
export HF_ENDPOINT=https://hf-mirror.com
python -m rag plan -t jira -p rag/raw/Jira-tahoe.csv -c jira_tahoe --tasks ./rag-jobs/jira_tahoe.json
python -m rag run --tasks ./rag-jobs/jira_tahoe.json
```

Or download the model once with the same env, then later runs use `~/.cache/huggingface/`.

`[embedding].vector_size` must match the model (**1024** for `BAAI/bge-m3`). Collections are named-vector hybrid (`dense` + `sparse`). Changing dimension or moving from a dense-only collection requires recreating that collection, then re-ingesting.

3. From the repo root (with the project venv / `uv`):

```bash
uv sync --extra rag
```

## CLI

Ingest is two commands. `plan` scans a source path and writes a **task list** (one entry per source file) plus a **checkpoint** (progress for that task list). `run` reads those files and upserts into Qdrant.

```bash
python -m rag plan -t <job_type> -p <path> -c <collection_name> --tasks <tasks.json> [--checkpoint <checkpoint.json>]
python -m rag run --tasks <tasks.json> [--checkpoint <checkpoint.json>] [--batch-size N] [--recreate-collection]
```

If `--checkpoint` is omitted, both commands use `<tasks>.checkpoint.json`. When `run` is given a checkpoint path and that file exists, ingest **must resume** from it. If the checkpoint file is missing, ingest starts from the beginning. The checkpoint is rewritten after every batch of source files (`--batch-size`, default 1). Re-running `plan` overwrites both files.

| Flag | Command | Meaning |
|------|---------|---------|
| `-t` / `--job-type` | plan | `jira` \| `drive` \| `dbt` (`wiki` not implemented yet) |
| `-p` / `--path` | plan | Jira: CSV file or directory of CSVs. Drive: directory of already-extracted files (zip archives are skipped). dbt: directory of schema yml files (walked recursively). |
| `-c` / `--collection-name` | plan | Target Qdrant collection (stored on the task list) |
| `--tasks` | plan / run | Task-list JSON |
| `--checkpoint` | plan / run | Checkpoint JSON bound to that task list |
| `--start-line` | plan | Jira only: skip the first N data rows (stored on the task list) |
| `--batch-size` | run | Source files per checkpoint write |
| `--recreate-collection` | run | Delete the target collection and clear completed files in the checkpoint |

### Jira CSV

Export issues from Jira (CSV), then:

```bash
python -m rag plan -t jira -p ~/Jira-tahoe.csv -c jira_tahoe --tasks ./rag-jobs/jira_tahoe.json
python -m rag run --tasks ./rag-jobs/jira_tahoe.json
python -m rag plan -t jira -p ~/Jira-core.csv  -c jira_core --tasks ./rag-jobs/jira_core.json
python -m rag run --tasks ./rag-jobs/jira_core.json
python -m rag plan -t jira -p ~/Jira-de.csv    -c jira_data_engineer --tasks ./rag-jobs/jira_de.json
python -m rag run --tasks ./rag-jobs/jira_de.json
python -m rag plan -t jira -p ~/Jira-ds.csv    -c jira_data_science --tasks ./rag-jobs/jira_ds.json
python -m rag run --tasks ./rag-jobs/jira_ds.json
```

Skip the first N data rows when planning a CSV (row-level offset, stored on the task list):

```bash
python -m rag plan -t jira -p ~/Jira-tahoe.csv -c jira_tahoe --tasks ./rag-jobs/jira_tahoe.json --start-line 500
python -m rag run --tasks ./rag-jobs/jira_tahoe.json
```

Expected columns include `Summary`, `Description`, `Issue key`, `Issue id` (standard Jira export headers). Empty columns are dropped; comments are a separate paragraph from summary/description. Long tickets are length-split to the embedding window so embed does not drop the tail. A ticket that still fits in one chunk keeps its legacy integer Issue id.

### Google Drive folders

Extract Drive folder downloads first, then point ingest at that directory. Zip archives in the tree are skipped.

```bash
mkdir -p ~/gdrive_exports
# unzip the downloaded Drive folder(s) into ~/gdrive_exports

python -m rag plan -t drive -p ~/gdrive_exports -c gdrive_tahoe --tasks ./rag-jobs/gdrive.json
python -m rag run --tasks ./rag-jobs/gdrive.json
```

Supported file types: `.txt`, `.md`, `.html`, `.docx`, `.pdf`, `.xlsx`, plus common text configs (`.json`, `.yaml`, `.csv`, …). Images, zip archives, and Google shortcut stubs (`.gdoc`, `.gsheet`, …) are skipped. Markdown files are split on headings first; long sections (and non-markdown files) are then split into overlapping chunks sized to `[embedding].max_chars` (default 2000).

### dbt semantic models

Index dbt schema yml files (and their sibling `.sql` files) so the Knowledge agent can pick the right column / dimension / MetricFlow metric for a question:

```bash
python -m rag plan -t dbt -p /Users/jixie/wbox/data-governance/semantic_layer/models/hive/analytics -c dbt_models --tasks ./rag-jobs/dbt_models.json
python -m rag run --tasks ./rag-jobs/dbt_models.json --recreate-collection
```

The directory is walked recursively; each `*.yml` / `*.yaml` is parsed as a dbt schema. For every `models[]` entry the ingest emits **one or more Qdrant points**:

- `model+columns` — model header (name, description, owner, hive_table, usage, agg time dimension) plus a packed group of columns (name, full description, entity / dimension / granularity / data tests).
- `model+metrics` — same model header plus a packed group of MetricFlow metrics (name, full description, type / agg / expr / label).

A model with no `columns[]` produces no columns chunks; a model with no `metrics[]` produces no metrics chunks. Columns and metrics that do not fit the embedding window (`[embedding].max_chars`) are split across additional chunks. Descriptions, usage, and SQL are never truncated. The point payload keeps the entire structured model — columns, metrics, SQL, owner, usage — so a retrieved point is enough for the calling agent to render a `TableCard` without a second hop.

Why packed groups (not one chunk per model, not one per column): one chunk per column / metric reintroduces the popularity-bias problem (`fetch_related_models` returns model-level `TableCard` instances). One chunk per model overflows the local BGE encoder's 512-token window. Packed groups keep each vector inside the window without dropping text; the search tool deduplicates by `model_name`.

Models with `semantic_model.enabled: false` are skipped. Point IDs are SHA1-derived UUIDs of `yml_path::model_name::{columns,metrics}::{para_seq}`, so re-ingest is idempotent. Recreate the collection if it still has the older two-point keys without a seq. Top-level MetricFlow files (`semantic_models: [...]` outside `models[]`) are not parsed yet — keep metrics inline on the model for now.

If the collection still has a dense-only layout, recreate it before re-ingesting. Every collection used for search must be named-vector hybrid (`dense` + `sparse`). `fetch_related_models` reads `dbt_models`.

## Suggested collections

Keep collection names aligned with Knowledge tools:

| Source | Collection | Used by |
|--------|------------|---------|
| Jira TAHOE | `jira_tahoe` | `fetch_related_jira_tickets` · `project=tahoe` |
| Jira CORE | `jira_core` | `project=core` |
| Jira DSE | `jira_data_engineer` | `project=de` |
| Jira CXDS | `jira_data_science` | `project=ds` |
| Jira SQD | `jira_sqd` | `project=sqd` |
| Google Drive docs | e.g. `gdrive_tahoe` | (wire a Drive search tool when ready) |
| dbt semantic models | `dbt_models` | `fetch_related_models` · `layer=hive_analytics` |

## Python API

One-shot helpers still ingest a whole tree in-process. The CLI path is `plan_ingest` then `run_ingest`:

```python
from rag.jira import upload_jira_csv
from rag.drive import upload_google_drive
from rag.dbt import upload_semantic_models
from rag.job import plan_ingest, run_ingest

upload_jira_csv("~/Jira-tahoe.csv", "jira_tahoe")
upload_google_drive("~/gdrive_exports", "gdrive_tahoe")
upload_semantic_models("~/data-governance/semantic_layer/models/hive/analytics", "dbt_models")

plan_ingest(
    job_type="dbt",
    source="~/data-governance/semantic_layer/models/hive/analytics",
    collection="dbt_models",
    tasks_path="./rag-jobs/dbt_models.json",
)
run_ingest(tasks_path="./rag-jobs/dbt_models.json")
```

## Verify

```bash
# Qdrant ready
curl -s http://localhost:6333/readyz

# List collections
curl -s http://localhost:6333/collections | python -m json.tool
```

Then run the Knowledge agent (`--agent knowledge`) so it can call `fetch_related_jira_tickets` against the Jira collections above.

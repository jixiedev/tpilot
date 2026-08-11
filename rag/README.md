# RAG ingest (Qdrant)

Index Jira CSV exports and Google Drive folder downloads into local Qdrant for Knowledge agent retrieval.

## Prerequisites

1. Start Qdrant:

```bash
cd docker/qdrant
docker compose up -d
```

- REST: `http://localhost:6333`
- Dashboard: http://localhost:6333/dashboard
- Data volume: `docker/qdrant/qdrant_storage/` (gitignored)

2. Configure embeddings in `config/rag.toml` (defaults to local **BAAI/bge-m3**).

Local mode (default — no OpenAI key):

```bash
# optional overrides
export QDRANT_URL="http://localhost:6333"
export EMBEDDING_PROVIDER="local"
export EMBEDDING_MODEL="BAAI/bge-m3"
export EMBEDDING_VECTOR_SIZE="1024"
# export EMBEDDING_DEVICE="cpu"   # or cuda / mps
```

Local defaults cap encode length (`max_seq_length=512`, `max_chars=2000`, `batch_size=8`) so long Jira
descriptions do not blow memory (`Invalid buffer size: … GiB`). Raise those in `config/rag.toml` only if
you have spare GPU/MPS RAM.

First run downloads the model from Hugging Face into the local cache (several GB).
If `huggingface.co` resets connections (common on some networks), use a mirror before ingest:

```bash
export HF_ENDPOINT=https://hf-mirror.com
python -m rag -t jira -p rag/raw/Jira-tahoe.csv -c jira_tahoe
```

Or download the model once with the same env, then later runs use `~/.cache/huggingface/`.

OpenAI-compatible API mode:

```bash
export EMBEDDING_PROVIDER="openai"
export OPENAI_API_KEY="your-key"
export EMBEDDING_BASE_URL="https://api.openai.com/v1"
export EMBEDDING_MODEL="text-embedding-3-small"
export EMBEDDING_VECTOR_SIZE="1536"
```

`[embedding].vector_size` must match the model (**1024** for `BAAI/bge-m3`). Changing it after a collection exists requires recreating that collection.

3. From the repo root (with the project venv / `uv`):

```bash
uv sync
```

## CLI

```bash
python -m rag -t <job_type> -p <path> -c <collection_name>
```

| Flag | Meaning |
|------|---------|
| `-t` / `--job-type` | `jira` \| `google_drive` (`wiki` not implemented yet) |
| `-p` / `--path` | Jira: CSV file. Google Drive: directory containing zip(s) |
| `-c` / `--collection-name` | Target Qdrant collection |
| `--start-line` | Jira only: skip the first N data rows |

### Jira CSV

Export issues from Jira (CSV), then:

```bash
python -m rag -t jira -p ~/Jira-tahoe.csv -c jira_tahoe
python -m rag -t jira -p ~/Jira-core.csv  -c jira_core
python -m rag -t jira -p ~/Jira-de.csv    -c jira_data_engineer
python -m rag -t jira -p ~/Jira-ds.csv    -c jira_data_science
```

Resume after a partial run:

```bash
python -m rag -t jira -p ~/Jira-tahoe.csv -c jira_tahoe --start-line 500
```

Expected columns include `Summary`, `Description`, `Issue key`, `Issue id` (standard Jira export headers). Empty columns are dropped; comments are folded into the embed text when present.

### Google Drive zips

Download Drive folders as zip (one or more). Put the zip files in a directory (already-extracted files in the same directory are also indexed):

```bash
mkdir -p ~/gdrive_exports
# copy the downloaded *.zip files into ~/gdrive_exports

python -m rag -t google_drive -p ~/gdrive_exports -c gdrive_tahoe
```

Supported file types inside the zips / directory: `.txt`, `.md`, `.html`, `.docx`, `.pdf`, `.xlsx`, plus common text configs (`.json`, `.yaml`, `.csv`, …). Images and Google shortcut stubs (`.gdoc`, `.gsheet`, …) are skipped. Long documents are split into overlapping chunks (~4k characters).

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

## Python API

```python
from rag.jira_ingest import upload_jira_csv
from rag.google_drive_ingest import upload_google_drive

upload_jira_csv("~/Jira-tahoe.csv", "jira_tahoe")
upload_google_drive("~/gdrive_exports", "gdrive_tahoe")
```

## Verify

```bash
# Qdrant ready
curl -s http://localhost:6333/readyz

# List collections
curl -s http://localhost:6333/collections | python -m json.tool
```

Then run the Knowledge agent (`--agent knowledge`) so it can call `fetch_related_jira_tickets` against the Jira collections above.

"""Plan a file-level ingest task list and run it with checkpoint resume."""

from __future__ import annotations

import hashlib
import json
import os
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from rag.chunking import IdentitySplitStrategy
from rag.ingest import length_strategy_for_embeddings, upsert_documents

TASK_LIST_VERSION = 1
CHECKPOINT_VERSION = 1
JOB_ALIASES = {
    "google_drive": "drive",
    "model": "dbt",
}
JOB_TYPES = ("jira", "drive", "dbt", "wiki")


def normalize_job_type(job_type: str) -> str:
    return JOB_ALIASES.get(job_type, job_type)


def default_checkpoint_path(tasks_path: str | Path) -> Path:
    path = Path(tasks_path).expanduser()
    return path.with_suffix(".checkpoint.json")


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    digest.update(path.read_bytes())
    return digest.hexdigest()


def _utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _atomic_write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    tmp = Path(tmp_name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(payload, handle, indent=2, ensure_ascii=False, sort_keys=True)
            handle.write("\n")
        tmp.replace(path)
    except Exception:
        tmp.unlink(missing_ok=True)
        raise


def _load_json(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path} is not a JSON object")
    return data


def _task_id(path: Path, source: Path) -> str:
    resolved = path.resolve()
    root = source.resolve()
    if root.is_file():
        return resolved.name
    try:
        return resolved.relative_to(root).as_posix()
    except ValueError:
        return str(resolved)


def list_source_paths(job_type: str, source: str | Path) -> list[Path]:
    kind = normalize_job_type(job_type)
    if kind == "jira":
        from rag.jira import list_jira_paths

        return list_jira_paths(source)
    if kind == "drive":
        from rag.drive import list_drive_paths

        return list_drive_paths(source)
    if kind == "dbt":
        from rag.dbt import list_yml_paths

        return list_yml_paths(source)
    if kind == "wiki":
        raise NotImplementedError("Job type 'wiki' is not implemented yet.")
    raise ValueError(f"Job type {job_type!r} is not supported. Use one of: {', '.join(JOB_TYPES)}.")


def ingest_task(
    job_type: str,
    path: Path,
    collection: str,
    *,
    source_path: Path,
    start_line: int = 0,
) -> int:
    kind = normalize_job_type(job_type)
    if kind == "jira":
        from rag.jira import upload_jira_csv

        return upload_jira_csv(str(path), collection, start_line=start_line)
    if kind == "drive":
        from rag.drive import documents_from_path

        docs = documents_from_path(path, ingest_root=source_path)
        print(f"Collected {len(docs)} files from {path} → collection {collection!r}")
        return upsert_documents(
            collection,
            docs,
            strategy=length_strategy_for_embeddings(),
        )
    if kind == "dbt":
        from rag.dbt import documents_from_yml

        docs, stats = documents_from_yml(path)
        print(
            f"Collected {stats['chunks']} chunks from {stats['models']} models in {path}"
            f" → collection {collection!r} (yml_files={stats['yml_files']},"
            f" columns={stats['columns']} → {stats['column_chunks']} chunk(s),"
            f" metrics={stats['metrics']} → {stats['metric_chunks']} chunk(s),"
            f" skipped_disabled={stats['models_skipped_disabled']})"
        )
        return upsert_documents(
            collection,
            docs,
            strategy=IdentitySplitStrategy(),
        )
    if kind == "wiki":
        raise NotImplementedError("Job type 'wiki' is not implemented yet.")
    raise ValueError(f"Job type {job_type!r} is not supported.")


def write_task_list(
    path: Path,
    *,
    job_type: str,
    source_path: Path,
    collection: str,
    tasks: list[dict[str, str]],
    start_line: int = 0,
) -> dict[str, Any]:
    payload = {
        "version": TASK_LIST_VERSION,
        "job_type": normalize_job_type(job_type),
        "source_path": str(source_path.resolve()),
        "collection": collection,
        "start_line": start_line,
        "created_at": _utc_now(),
        "tasks": tasks,
    }
    _atomic_write_json(path, payload)
    return payload


def write_checkpoint(
    path: Path,
    *,
    task_list: Path,
    task_list_sha256: str,
    completed: list[str],
    uploaded_points: int,
) -> dict[str, Any]:
    payload = {
        "version": CHECKPOINT_VERSION,
        "task_list": str(task_list.resolve()),
        "task_list_sha256": task_list_sha256,
        "completed": completed,
        "uploaded_points": uploaded_points,
        "updated_at": _utc_now(),
    }
    _atomic_write_json(path, payload)
    return payload


def load_task_list(path: Path) -> dict[str, Any]:
    data = _load_json(path)
    if data.get("version") != TASK_LIST_VERSION:
        raise ValueError(f"{path} has unsupported task-list version {data.get('version')!r}")
    for key in ("job_type", "source_path", "collection", "tasks"):
        if key not in data:
            raise ValueError(f"{path} is missing {key!r}")
    if not isinstance(data["tasks"], list):
        raise ValueError(f"{path} field 'tasks' must be a list")
    return data


def load_checkpoint(path: Path) -> dict[str, Any]:
    data = _load_json(path)
    if data.get("version") != CHECKPOINT_VERSION:
        raise ValueError(f"{path} has unsupported checkpoint version {data.get('version')!r}")
    completed = data.get("completed", [])
    if not isinstance(completed, list):
        raise ValueError(f"{path} field 'completed' must be a list")
    data["completed"] = [str(item) for item in completed]
    data["uploaded_points"] = int(data.get("uploaded_points") or 0)
    return data


def empty_checkpoint(task_list: Path, task_list_sha256: str) -> dict[str, Any]:
    return {
        "version": CHECKPOINT_VERSION,
        "task_list": str(task_list.resolve()),
        "task_list_sha256": task_list_sha256,
        "completed": [],
        "uploaded_points": 0,
        "updated_at": _utc_now(),
    }


def plan_ingest(
    *,
    job_type: str,
    source: str | Path,
    collection: str,
    tasks_path: str | Path,
    checkpoint_path: str | Path | None = None,
    start_line: int = 0,
) -> tuple[Path, Path]:
    """Scan ``source`` and write a task list plus a fresh checkpoint."""
    kind = normalize_job_type(job_type)
    if kind not in JOB_TYPES:
        raise ValueError(
            f"Job type {job_type!r} is not supported. Use one of: {', '.join(JOB_TYPES)}."
        )
    source_path = Path(source).expanduser().resolve()
    tasks_file = Path(tasks_path).expanduser().resolve()
    checkpoint_file = (
        Path(checkpoint_path).expanduser().resolve()
        if checkpoint_path is not None
        else default_checkpoint_path(tasks_file)
    )
    paths = list_source_paths(kind, source_path)
    tasks = [{"id": _task_id(path, source_path), "path": str(path.resolve())} for path in paths]
    write_task_list(
        tasks_file,
        job_type=kind,
        source_path=source_path,
        collection=collection,
        tasks=tasks,
        start_line=start_line,
    )
    write_checkpoint(
        checkpoint_file,
        task_list=tasks_file,
        task_list_sha256=file_sha256(tasks_file),
        completed=[],
        uploaded_points=0,
    )
    print(
        f"Wrote {len(tasks)} task(s) to {tasks_file} "
        f"and checkpoint {checkpoint_file} for collection {collection!r}"
    )
    return tasks_file, checkpoint_file


def run_ingest(
    *,
    tasks_path: str | Path,
    checkpoint_path: str | Path | None = None,
    batch_size: int = 1,
    recreate_collection: bool = False,
) -> int:
    """Ingest pending tasks. Resume from ``checkpoint_path`` when that file exists."""
    if batch_size < 1:
        raise ValueError("batch_size must be >= 1")
    tasks_file = Path(tasks_path).expanduser().resolve()
    checkpoint_file = (
        Path(checkpoint_path).expanduser().resolve()
        if checkpoint_path is not None
        else default_checkpoint_path(tasks_file)
    )
    task_list = load_task_list(tasks_file)
    digest = file_sha256(tasks_file)
    if checkpoint_file.exists():
        checkpoint = load_checkpoint(checkpoint_file)
        stored = str(checkpoint.get("task_list_sha256") or "")
        if stored != digest:
            raise ValueError(
                f"Checkpoint {checkpoint_file} belongs to a different task list "
                f"(sha256 {stored} != {digest}). Re-run plan or pass the matching files."
            )
        print(f"Resuming from checkpoint {checkpoint_file}")
    else:
        checkpoint = empty_checkpoint(tasks_file, digest)
        print(f"Checkpoint {checkpoint_file} not found; starting from the beginning")

    if recreate_collection:
        from rag.qdrant import get_client

        collection = task_list["collection"]
        qdrant = get_client()
        if qdrant.collection_exists(collection):
            qdrant.delete_collection(collection)
            print(f"Deleted collection {collection!r}")
        checkpoint["completed"] = []
        checkpoint["uploaded_points"] = 0
        write_checkpoint(
            checkpoint_file,
            task_list=tasks_file,
            task_list_sha256=digest,
            completed=[],
            uploaded_points=0,
        )

    completed_ids = list(checkpoint["completed"])
    completed_set = set(completed_ids)
    pending = [task for task in task_list["tasks"] if str(task.get("id")) not in completed_set]
    total = len(task_list["tasks"])
    uploaded = int(checkpoint["uploaded_points"])
    source_path = Path(task_list["source_path"])
    start_line = int(task_list.get("start_line") or 0)
    if not pending:
        print(f"All {total} task(s) already complete ({uploaded} points).")
        return uploaded

    print(f"{len(pending)}/{total} task(s) remaining; checkpoint every {batch_size} file(s)")
    for offset in range(0, len(pending), batch_size):
        batch = pending[offset : offset + batch_size]
        for task in batch:
            task_id = str(task["id"])
            path = Path(task["path"])
            try:
                uploaded += ingest_task(
                    task_list["job_type"],
                    path,
                    task_list["collection"],
                    source_path=source_path,
                    start_line=start_line,
                )
            except Exception as exc:  # noqa: BLE001 — remaining files can still run
                print(f"Task {task_id} failed: {exc}")
                continue
            completed_ids.append(task_id)
        write_checkpoint(
            checkpoint_file,
            task_list=tasks_file,
            task_list_sha256=digest,
            completed=completed_ids,
            uploaded_points=uploaded,
        )
        print(
            f"Checkpoint updated: {len(completed_ids)}/{total} file(s) complete, "
            f"{uploaded} points"
        )
    return uploaded

from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
import yaml

from rag import job
from rag.__main__ import main


@pytest.fixture(autouse=True)
def _no_qdrant_delete():
    """Ingest deletes a document's old points before upsert; keep tests offline."""
    with patch("rag.ingest.delete_points_by_doc_keys") as mock_delete:
        yield mock_delete


def _write_model_yml(path: Path, name: str) -> None:
    path.write_text(
        yaml.dump(
            {
                "models": [
                    {
                        "name": name,
                        "description": f"{name} facts",
                        "columns": [
                            {"name": "id", "description": "primary key"},
                        ],
                    }
                ]
            }
        ),
        encoding="utf-8",
    )


def test_plan_writes_task_list_and_empty_checkpoint(tmp_path: Path) -> None:
    _write_model_yml(tmp_path / "a.yml", "model_a")
    nested = tmp_path / "nested"
    nested.mkdir()
    _write_model_yml(nested / "b.yml", "model_b")
    tasks = tmp_path / "tasks.json"
    checkpoint = tmp_path / "progress.json"

    job.plan_ingest(
        job_type="dbt",
        source=tmp_path,
        collection="dbt_models",
        tasks_path=tasks,
        checkpoint_path=checkpoint,
    )

    listing = json.loads(tasks.read_text(encoding="utf-8"))
    ids = [task["id"] for task in listing["tasks"]]
    assert listing["job_type"] == "dbt"
    assert listing["collection"] == "dbt_models"
    assert ids == ["a.yml", "nested/b.yml"]
    progress = json.loads(checkpoint.read_text(encoding="utf-8"))
    assert progress["completed"] == []
    assert progress["uploaded_points"] == 0
    assert progress["task_list_sha256"] == job.file_sha256(tasks)


@patch("rag.ingest.upsert_points")
@patch("rag.ingest.ensure_collection")
@patch("rag.ingest.get_embeddings")
def test_run_resumes_from_checkpoint(
    mock_embeddings: MagicMock,
    mock_ensure: MagicMock,
    mock_upsert: MagicMock,
    tmp_path: Path,
) -> None:
    _write_model_yml(tmp_path / "a.yml", "model_a")
    _write_model_yml(tmp_path / "b.yml", "model_b")
    tasks = tmp_path / "tasks.json"
    checkpoint = tmp_path / "progress.json"
    job.plan_ingest(
        job_type="model",
        source=tmp_path,
        collection="dbt_models",
        tasks_path=tasks,
        checkpoint_path=checkpoint,
    )
    job.write_checkpoint(
        checkpoint,
        task_list=tasks,
        task_list_sha256=job.file_sha256(tasks),
        completed=["a.yml"],
        uploaded_points=1,
    )
    mock_embeddings.return_value = [([0.1, 0.2], {1: 0.5})]

    uploaded = job.run_ingest(tasks_path=tasks, checkpoint_path=checkpoint, batch_size=1)

    assert uploaded == 2
    mock_ensure.assert_called_once_with("dbt_models")
    mock_upsert.assert_called_once()
    progress = json.loads(checkpoint.read_text(encoding="utf-8"))
    assert progress["completed"] == ["a.yml", "b.yml"]
    assert progress["uploaded_points"] == 2


@patch("rag.ingest.upsert_points")
@patch("rag.ingest.ensure_collection")
@patch("rag.ingest.get_embeddings")
def test_run_starts_from_beginning_when_checkpoint_missing(
    mock_embeddings: MagicMock,
    mock_ensure: MagicMock,
    mock_upsert: MagicMock,
    tmp_path: Path,
) -> None:
    _write_model_yml(tmp_path / "a.yml", "model_a")
    _write_model_yml(tmp_path / "b.yml", "model_b")
    tasks = tmp_path / "tasks.json"
    checkpoint = tmp_path / "progress.json"
    job.plan_ingest(
        job_type="dbt",
        source=tmp_path,
        collection="dbt_models",
        tasks_path=tasks,
        checkpoint_path=checkpoint,
    )
    checkpoint.unlink()
    mock_embeddings.return_value = [([0.1, 0.2], {1: 0.5})]

    uploaded = job.run_ingest(tasks_path=tasks, checkpoint_path=checkpoint, batch_size=2)

    assert uploaded == 2
    assert mock_upsert.call_count == 2
    progress = json.loads(checkpoint.read_text(encoding="utf-8"))
    assert progress["completed"] == ["a.yml", "b.yml"]


@patch("rag.job.ingest_task", side_effect=[1, 1, 1])
def test_run_writes_checkpoint_after_each_file_batch(
    mock_ingest: MagicMock,
    tmp_path: Path,
) -> None:
    _write_model_yml(tmp_path / "a.yml", "model_a")
    _write_model_yml(tmp_path / "b.yml", "model_b")
    _write_model_yml(tmp_path / "c.yml", "model_c")
    tasks = tmp_path / "tasks.json"
    checkpoint = tmp_path / "progress.json"
    job.plan_ingest(
        job_type="dbt",
        source=tmp_path,
        collection="dbt_models",
        tasks_path=tasks,
        checkpoint_path=checkpoint,
    )
    writes: list[list[str]] = []
    original = job.write_checkpoint

    def _track(*args, **kwargs):
        payload = original(*args, **kwargs)
        writes.append(list(payload["completed"]))
        return payload

    with patch.object(job, "write_checkpoint", side_effect=_track):
        job.run_ingest(tasks_path=tasks, checkpoint_path=checkpoint, batch_size=2)

    assert mock_ingest.call_count == 3
    assert writes == [["a.yml", "b.yml"], ["a.yml", "b.yml", "c.yml"]]


@patch("rag.job.ingest_task", side_effect=[1, RuntimeError("embed failed"), 1])
def test_run_does_not_checkpoint_failed_file(
    mock_ingest: MagicMock,
    tmp_path: Path,
) -> None:
    _write_model_yml(tmp_path / "a.yml", "model_a")
    _write_model_yml(tmp_path / "b.yml", "model_b")
    _write_model_yml(tmp_path / "c.yml", "model_c")
    tasks = tmp_path / "tasks.json"
    checkpoint = tmp_path / "progress.json"
    job.plan_ingest(
        job_type="dbt",
        source=tmp_path,
        collection="dbt_models",
        tasks_path=tasks,
        checkpoint_path=checkpoint,
    )
    with pytest.raises(job.IngestFailedError) as excinfo:
        job.run_ingest(tasks_path=tasks, checkpoint_path=checkpoint, batch_size=1)
    assert excinfo.value.uploaded == 2
    assert excinfo.value.failed == {"b.yml": "embed failed"}
    assert mock_ingest.call_count == 3
    progress = json.loads(checkpoint.read_text(encoding="utf-8"))
    assert progress["completed"] == ["a.yml", "c.yml"]
    assert progress["uploaded_points"] == 2


def _plan_dbt(tmp_path: Path, *names: str) -> tuple[Path, Path]:
    for name in names:
        _write_model_yml(tmp_path / f"{name}.yml", name)
    tasks = tmp_path / "tasks.json"
    checkpoint = tmp_path / "progress.json"
    job.plan_ingest(
        job_type="dbt",
        source=tmp_path,
        collection="dbt_models",
        tasks_path=tasks,
        checkpoint_path=checkpoint,
    )
    return tasks, checkpoint


def test_run_cli_exits_nonzero_with_failure_summary_and_rerun_retries_failures(
    tmp_path: Path,
    capsys: pytest.CaptureFixture[str],
) -> None:
    tasks, checkpoint = _plan_dbt(tmp_path, "a", "b", "c")
    argv = ["run", "--tasks", str(tasks), "--checkpoint", str(checkpoint)]

    with patch(
        "rag.job.ingest_task", side_effect=[1, RuntimeError("embed failed"), 1]
    ) as first:
        code = main(argv)

    assert code == 1
    assert first.call_count == 3
    err = capsys.readouterr().err
    assert "1/3 task(s) failed" in err
    assert "b.yml: embed failed" in err
    progress = json.loads(checkpoint.read_text(encoding="utf-8"))
    assert progress["completed"] == ["a.yml", "c.yml"]

    with patch("rag.job.ingest_task", return_value=1) as second:
        assert main(argv) == 0

    assert second.call_count == 1
    assert Path(second.call_args.args[1]).name == "b.yml"
    progress = json.loads(checkpoint.read_text(encoding="utf-8"))
    assert sorted(progress["completed"]) == ["a.yml", "b.yml", "c.yml"]
    assert progress["uploaded_points"] == 3


def test_recreate_collection_ignores_checkpoint_for_other_task_list(tmp_path: Path) -> None:
    tasks, checkpoint = _plan_dbt(tmp_path, "a", "b")
    # A checkpoint left by an older task list (other digest, completed
    # entries): a plain run refuses it; --recreate-collection must not.
    job.write_checkpoint(
        checkpoint,
        task_list=tasks,
        task_list_sha256="0" * 64,
        completed=["a.yml"],
        uploaded_points=7,
    )

    with (
        patch("rag.job._recreate_collection") as mock_recreate,
        patch("rag.job.ingest_task", return_value=1) as mock_ingest,
    ):
        uploaded = job.run_ingest(
            tasks_path=tasks,
            checkpoint_path=checkpoint,
            recreate_collection=True,
        )

    mock_recreate.assert_called_once_with("dbt_models")
    assert mock_ingest.call_count == 2
    assert uploaded == 2
    progress = json.loads(checkpoint.read_text(encoding="utf-8"))
    assert progress["task_list_sha256"] == job.file_sha256(tasks)
    assert progress["completed"] == ["a.yml", "b.yml"]
    assert progress["uploaded_points"] == 2


def test_run_rejects_checkpoint_for_other_task_list(tmp_path: Path) -> None:
    _write_model_yml(tmp_path / "a.yml", "model_a")
    tasks = tmp_path / "tasks.json"
    checkpoint = tmp_path / "progress.json"
    job.plan_ingest(
        job_type="dbt",
        source=tmp_path,
        collection="dbt_models",
        tasks_path=tasks,
        checkpoint_path=checkpoint,
    )
    listing = json.loads(tasks.read_text(encoding="utf-8"))
    listing["collection"] = "other"
    tasks.write_text(json.dumps(listing, indent=2) + "\n", encoding="utf-8")

    try:
        job.run_ingest(tasks_path=tasks, checkpoint_path=checkpoint)
        raise AssertionError("expected ValueError")
    except ValueError as exc:
        assert "different task list" in str(exc)


def test_plan_cli_and_run_cli_missing_checkpoint(tmp_path: Path) -> None:
    _write_model_yml(tmp_path / "a.yml", "model_a")
    tasks = tmp_path / "jobs.json"
    checkpoint = tmp_path / "jobs.checkpoint.json"
    assert (
        main(
            [
                "plan",
                "-t",
                "dbt",
                "-p",
                str(tmp_path),
                "-c",
                "dbt_models",
                "--tasks",
                str(tasks),
            ]
        )
        == 0
    )
    assert checkpoint.exists()
    checkpoint.unlink()
    with (
        patch("rag.ingest.get_embeddings", return_value=[([0.1, 0.2], {1: 0.5})]),
        patch("rag.ingest.ensure_collection"),
        patch("rag.ingest.upsert_points"),
    ):
        assert main(["run", "--tasks", str(tasks), "--checkpoint", str(checkpoint)]) == 0
    progress = json.loads(checkpoint.read_text(encoding="utf-8"))
    assert progress["completed"] == ["a.yml"]

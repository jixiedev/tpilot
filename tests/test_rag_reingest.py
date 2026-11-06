"""Re-ingest replaces a document's points instead of leaving stale ones.

Uses qdrant-client's in-process ``:memory:`` mode (no server) and fake
embeddings, so the real ensure/delete/upsert path runs offline.
"""

from __future__ import annotations

from collections.abc import Iterator
from pathlib import Path
from unittest.mock import MagicMock, patch

import pandas as pd
import pytest
import yaml
from qdrant_client import QdrantClient

from rag import qdrant as rag_qdrant
from rag.config import get_rag_config
from rag.job import ingest_task

COLLECTION = "reingest_test"

pytestmark = pytest.mark.filterwarnings("ignore:Payload indexes have no effect")


def _fake_embeddings(texts: list[str], config=None):  # noqa: ANN001
    size = get_rag_config().embedding.vector_size
    return [([0.1 + (i % 7) * 0.01] * size, {1 + i: 0.5}) for i, _ in enumerate(texts)]


@pytest.fixture
def client() -> Iterator[QdrantClient]:
    memory = QdrantClient(":memory:")
    with (
        patch("rag.qdrant.get_client", return_value=memory),
        patch("rag.ingest.get_embeddings", side_effect=_fake_embeddings),
    ):
        yield memory
    memory.close()


def _points(client: QdrantClient) -> list:
    points, _ = client.scroll(COLLECTION, limit=1000, with_payload=True)
    return points


def _write_jira_csv(path: Path, description: str) -> None:
    pd.DataFrame(
        [
            {
                "Issue key": "TAHOE-1",
                "Issue id": "1001",
                "Summary": "Kafka lag",
                "Description": description,
            }
        ]
    ).to_csv(path, index=False)


def test_jira_ticket_growing_to_several_chunks_drops_old_integer_point(
    client: QdrantClient, tmp_path: Path
) -> None:
    csv = tmp_path / "jira.csv"
    _write_jira_csv(csv, "short body")
    assert ingest_task("jira", csv, COLLECTION, source_path=csv) == 1
    assert [p.id for p in _points(client)] == [1001]

    long_body = "\n\n".join(f"Paragraph {i} " + "lag detail " * 40 for i in range(20))
    _write_jira_csv(csv, long_body)
    uploaded = ingest_task("jira", csv, COLLECTION, source_path=csv)

    points = _points(client)
    assert uploaded > 1
    assert len(points) == uploaded
    assert 1001 not in {p.id for p in points}
    assert {p.payload["doc_key"] for p in points} == {"jira:TAHOE-1"}


def _write_dbt_yml(path: Path, n_columns: int) -> None:
    columns = [
        {"name": f"col_{i}", "description": f"column {i} " + "detail " * 40}
        for i in range(n_columns)
    ]
    path.write_text(
        yaml.dump(
            {
                "models": [
                    {
                        "name": "orders",
                        "description": "order facts",
                        "columns": columns,
                        "metrics": [{"name": "order_count", "description": "orders"}],
                    }
                ]
            }
        ),
        encoding="utf-8",
    )


def test_dbt_metric_chunk_shift_does_not_leave_stale_points(
    client: QdrantClient, tmp_path: Path
) -> None:
    yml = tmp_path / "schema.yml"
    _write_dbt_yml(yml, n_columns=1)
    first = ingest_task("dbt", yml, COLLECTION, source_path=tmp_path)
    assert first == 2  # one columns chunk + one metrics chunk

    _write_dbt_yml(yml, n_columns=40)  # columns now pack into several chunks
    second = ingest_task("dbt", yml, COLLECTION, source_path=tmp_path)

    points = _points(client)
    assert second > first
    assert len(points) == second
    metric_points = [p for p in points if p.payload["chunk_type"] == "model+metrics"]
    assert len(metric_points) == 1
    assert {p.payload["doc_key"] for p in points} == {f"dbt:{yml.resolve()}::orders"}


def test_drive_file_ingested_from_two_plan_roots_is_not_duplicated(
    client: QdrantClient, tmp_path: Path
) -> None:
    nested = tmp_path / "team" / "docs"
    nested.mkdir(parents=True)
    note = nested / "runbook.txt"
    note.write_text("Kafka MSK sizing notes for Tahoe.", encoding="utf-8")

    first = ingest_task("drive", note, COLLECTION, source_path=nested)
    second = ingest_task("drive", note, COLLECTION, source_path=tmp_path)

    points = _points(client)
    assert first == second == 1
    assert len(points) == 1
    assert points[0].payload["path"] == str(Path("team") / "docs" / "runbook.txt")
    assert points[0].payload["doc_key"] == f"drive:{note.resolve()}"


def test_reingest_keeps_other_documents(client: QdrantClient, tmp_path: Path) -> None:
    a = tmp_path / "a.txt"
    b = tmp_path / "b.txt"
    a.write_text("alpha notes", encoding="utf-8")
    b.write_text("beta notes", encoding="utf-8")
    ingest_task("drive", a, COLLECTION, source_path=tmp_path)
    ingest_task("drive", b, COLLECTION, source_path=tmp_path)
    ingest_task("drive", a, COLLECTION, source_path=tmp_path)

    assert sorted(p.payload["path"] for p in _points(client)) == ["a.txt", "b.txt"]


def test_delete_points_by_doc_keys_skips_missing_collection_and_batches() -> None:
    fake = MagicMock()
    fake.collection_exists.return_value = False
    assert rag_qdrant.delete_points_by_doc_keys("c", ["k"], client=fake) == 0
    fake.delete.assert_not_called()

    fake.collection_exists.return_value = True
    keys = [f"k{i}" for i in range(300)] + ["", "k0"]
    assert rag_qdrant.delete_points_by_doc_keys("c", keys, client=fake) == 2
    sent = [
        call.kwargs["points_selector"].filter.must[0].match.any
        for call in fake.delete.call_args_list
    ]
    assert sum(len(batch) for batch in sent) == 300
    assert all(call.kwargs["points_selector"].filter.must[0].key == "doc_key"
               for call in fake.delete.call_args_list)

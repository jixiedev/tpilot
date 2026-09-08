from __future__ import annotations

import zipfile
from pathlib import Path
from unittest.mock import patch

from rag.drive import (
    chunk_text,
    collect_google_drive_documents,
    extract_text_from_bytes,
    list_drive_paths,
    upload_google_drive,
)


def test_chunk_text_splits_long_documents() -> None:
    text = ("paragraph one.\n\n" * 50) + ("paragraph two.\n\n" * 50)
    chunks = chunk_text(text, chunk_chars=200, overlap=40)
    assert len(chunks) > 1
    assert all(chunk for chunk in chunks)


def test_extract_text_from_plain_and_html() -> None:
    assert extract_text_from_bytes(b"hello tahoe", Path("note.txt")) == "hello tahoe"
    html = b"<html><body><h1>Title</h1><p>Body text</p><script>x()</script></body></html>"
    text = extract_text_from_bytes(html, Path("doc.html"))
    assert text is not None
    assert "Title" in text
    assert "Body text" in text
    assert "x()" not in text


def test_collect_google_drive_documents_from_extracted_tree(tmp_path: Path) -> None:
    (tmp_path / "design").mkdir()
    (tmp_path / "design" / "overview.md").write_text(
        "# Tahoe\n\nAirflow and Presto design.", encoding="utf-8"
    )
    (tmp_path / "design" / "ignore.png").write_bytes(b"\x89PNG\r\n")
    (tmp_path / "ops").mkdir()
    (tmp_path / "ops" / "oncall.txt").write_text(
        "PagerDuty escalation for Hive metastore.", encoding="utf-8"
    )
    (tmp_path / "loose-notes.md").write_text(
        "Already extracted FAQ about Superset.", encoding="utf-8"
    )
    zip_path = tmp_path / "architecture.zip"
    with zipfile.ZipFile(zip_path, "w") as archive:
        archive.writestr("ignored.md", "# should not be ingested from zip")

    docs = collect_google_drive_documents(tmp_path)
    paths = {doc.rel_path for doc in docs}
    assert "design/overview.md" in paths
    assert "ops/oncall.txt" in paths
    assert "loose-notes.md" in paths
    assert zip_path.name not in paths
    assert all(doc.suffix in {".md", ".txt"} for doc in docs)
    assert not any(doc.rel_path.endswith(".png") for doc in docs)
    assert not any(doc.rel_path.endswith(".zip") for doc in docs)
    assert zip_path not in list_drive_paths(tmp_path)


@patch("rag.ingest.upsert_points")
@patch("rag.ingest.ensure_collection")
@patch("rag.ingest.get_embeddings")
def test_upload_google_drive_embeds_chunks(
    mock_embeddings,
    mock_ensure,
    mock_upsert,
    tmp_path: Path,
) -> None:
    (tmp_path / "a.txt").write_text("Kafka MSK sizing notes for Tahoe.", encoding="utf-8")
    mock_embeddings.return_value = [([0.1, 0.2, 0.3], {7: 0.5})]

    uploaded = upload_google_drive(tmp_path, "gdrive_tahoe")

    assert uploaded == 1
    mock_ensure.assert_called_once_with("gdrive_tahoe")
    mock_upsert.assert_called_once()
    points = mock_upsert.call_args.args[1]
    assert points[0].payload["title"] == "a"
    assert "Kafka MSK" in points[0].payload["text"]

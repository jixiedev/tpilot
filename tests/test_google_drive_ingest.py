from __future__ import annotations

import zipfile
from pathlib import Path
from unittest.mock import patch

from rag.google_drive_ingest import (
    chunk_text,
    collect_google_drive_documents,
    extract_text_from_bytes,
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


def test_collect_google_drive_documents_from_zips(tmp_path: Path) -> None:
    zip_a = tmp_path / "architecture.zip"
    zip_b = tmp_path / "runbooks.zip"
    with zipfile.ZipFile(zip_a, "w") as archive:
        archive.writestr("design/overview.md", "# Tahoe\n\nAirflow and Presto design.")
        archive.writestr("design/ignore.png", b"\x89PNG\r\n")
    with zipfile.ZipFile(zip_b, "w") as archive:
        archive.writestr("ops/oncall.txt", "PagerDuty escalation for Hive metastore.")

    (tmp_path / "loose-notes.md").write_text("Already extracted FAQ about Superset.", encoding="utf-8")

    docs = collect_google_drive_documents(tmp_path)
    paths = {doc["payload"]["path"] for doc in docs}
    assert "design/overview.md" in paths
    assert "ops/oncall.txt" in paths
    assert "loose-notes.md" in paths
    assert all(doc["payload"]["source"] == "google_drive" for doc in docs)
    assert not any(doc["payload"]["path"].endswith(".png") for doc in docs)


@patch("rag.google_drive_ingest.upsert_points")
@patch("rag.google_drive_ingest.ensure_collection")
@patch("rag.google_drive_ingest.get_embeddings")
def test_upload_google_drive_embeds_chunks(
    mock_embeddings,
    mock_ensure,
    mock_upsert,
    tmp_path: Path,
) -> None:
    zip_path = tmp_path / "docs.zip"
    with zipfile.ZipFile(zip_path, "w") as archive:
        archive.writestr("a.txt", "Kafka MSK sizing notes for Tahoe.")
    mock_embeddings.return_value = [[0.1, 0.2, 0.3]]

    uploaded = upload_google_drive(tmp_path, "gdrive_tahoe")

    assert uploaded == 1
    mock_ensure.assert_called_once_with("gdrive_tahoe")
    mock_upsert.assert_called_once()
    points = mock_upsert.call_args.args[1]
    assert points[0].payload["title"] == "a"
    assert "Kafka MSK" in points[0].payload["text"]

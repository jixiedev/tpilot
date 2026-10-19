"""Document / paragraph / chunk split and source adapters."""

from __future__ import annotations

from collections import Counter
from pathlib import Path
from unittest.mock import MagicMock, patch

import pandas as pd
import pytest
import yaml

from rag.drive import DriveDocument
from rag.jira import JiraDocument, row_to_document
from rag.dbt import collect_semantic_model_documents_with_stats, documents_from_yml, pack_embed_sections
from rag.document import Document, stable_point_id
from rag.markdown import MarkdownDocument, PdfDocument, markdown_section_texts
from rag.ingest import upsert_documents
from rag.chunking import IdentitySplitStrategy, LengthSplitStrategy, split_text


def test_split_text_keeps_a_remainder_chunk() -> None:
    text = "a" * 50 + "\n\n" + "b" * 50
    chunks = split_text(text, chunk_chars=40, overlap=8)
    assert len(chunks) > 1
    assert "".join(chunks).replace(" ", "")  # non-empty pieces
    assert any("b" in chunk for chunk in chunks)


def test_markdown_section_texts_splits_on_headings() -> None:
    text = (
        "# How DQC works\n\n"
        "Intro paragraph about operators.\n\n"
        "## Import module\n\n"
        "Use DQFreeFormSQLCheckOperator.\n\n"
        "## Choose the operator\n\n"
        "Pick a wrapped operator or free-form SQL."
    )
    sections = markdown_section_texts(text, fallback_title="guide")
    titles = [title for title, _body in sections]
    assert "How DQC works" in titles
    assert "Import module" in titles
    assert "Choose the operator" in titles
    import_body = next(body for title, body in sections if title == "Import module")
    assert "DQFreeFormSQLCheckOperator" in import_body


def test_markdown_document_heading_paragraphs() -> None:
    doc = MarkdownDocument.from_text(
        "# Alpha\n\nfirst section\n\n# Beta\n\nsecond section",
        path="guide.md",
        title="guide",
        doc_id="guide",
    )
    paras = doc.split_paragraphs()
    assert [p.para_title for p in paras] == ["Alpha", "Beta"]
    assert "first section" in paras[0].text
    assert "second section" in paras[1].text


def test_pdf_document_open_reads_markdown_without_tika(tmp_path: Path) -> None:
    path = tmp_path / "guide.md"
    path.write_text("# Setup\n\nCall the operator.\n", encoding="utf-8")
    doc = PdfDocument.open(path)
    paras = doc.split_paragraphs()
    assert paras[0].para_title == "Setup"
    assert "operator" in paras[0].text


def test_jira_short_ticket_keeps_legacy_point_id() -> None:
    row = pd.Series(
        {
            "Summary": "Hive metastore timeout",
            "Description": "Jobs fail after upgrade",
            "Issue key": "TAHOE-123",
            "Issue id": "10001",
            "Status": "Done",
        }
    )
    doc = row_to_document(row, fallback_id=7)
    assert isinstance(doc, JiraDocument)
    chunks = list(LengthSplitStrategy(chunk_chars=2000).iter_chunks(doc))
    assert len(chunks) == 1
    chunk = chunks[0]
    assert chunk.point_id() == 10001
    payload = chunk.payload()
    assert payload["issue_key"] == "TAHOE-123"
    assert payload["status"] == "Done"
    assert "Summary: Hive metastore timeout" in chunk.embed_text()
    assert "Comments:" not in chunk.embed_text()
    assert payload["prev_chunk_seq"] == -1
    assert payload["next_chunk_seq"] == -2


def test_jira_splits_comments_and_long_description() -> None:
    long_desc = "timeout details " + ("omega " * 50)
    row = pd.Series(
        {
            "Summary": "Hive metastore timeout",
            "Description": long_desc,
            "Issue key": "TAHOE-123",
            "Issue id": "10001",
            "Comment": "Root cause was connection pool",
        }
    )
    doc = row_to_document(row)
    assert isinstance(doc, JiraDocument)
    chunks = list(LengthSplitStrategy(chunk_chars=180).iter_chunks(doc))
    titles = [c.ref_para.para_title for c in chunks]
    assert "ticket" in titles
    assert "comments" in titles
    assert len(chunks) > 2
    ticket_text = "\n".join(
        c.embed_text() for c in chunks if c.ref_para.para_title == "ticket"
    )
    comment_text = "\n".join(
        c.embed_text() for c in chunks if c.ref_para.para_title == "comments"
    )
    assert "Root cause was connection pool" in comment_text
    ticket_letters = Counter(ch for ch in ticket_text.lower() if ch.isalpha())
    needed = Counter(ch for ch in long_desc.lower() if ch.isalpha())
    for ch, n in needed.items():
        assert ticket_letters[ch] >= n
    ids = [c.point_id() for c in chunks]
    assert len(ids) == len(set(ids))
    assert 10001 not in ids


def test_jira_point_id_stable_without_issue_id() -> None:
    row = pd.Series(
        {
            "Summary": "No numeric id",
            "Description": "body",
            "Issue key": "TAHOE-99",
        }
    )
    doc_a = row_to_document(row)
    doc_b = row_to_document(row)
    assert doc_a is not None and doc_b is not None
    chunk_a = list(LengthSplitStrategy(chunk_chars=2000).iter_chunks(doc_a))[0]
    chunk_b = list(LengthSplitStrategy(chunk_chars=2000).iter_chunks(doc_b))[0]
    assert chunk_a.point_id() == chunk_b.point_id() == stable_point_id("TAHOE-99")


def test_drive_markdown_uses_heading_paragraphs() -> None:
    doc = DriveDocument(
        doc_id="loose",
        url="runbook.md",
        title="runbook",
        content="# PagerDuty\n\nescalation\n\n# Hive\n\nmetastore",
        rel_path="runbook.md",
        suffix=".md",
    )
    paras = doc.split_paragraphs()
    assert len(paras) == 2
    assert paras[0].para_title == "PagerDuty"
    chunks = list(LengthSplitStrategy(chunk_chars=4000).iter_chunks(doc))
    assert len(chunks) == 2
    assert chunks[0].payload()["path"] == "runbook.md"
    assert chunks[0].payload()["chunk_index"] == 0
    assert chunks[1].payload()["chunk_index"] == 1


def test_model_document_emits_columns_and_metrics_chunks(tmp_path: Path) -> None:
    yml = tmp_path / "schema.yml"
    yml.write_text(
        yaml.dump(
            {
                "models": [
                    {
                        "name": "fct_orders",
                        "description": "Order facts",
                        "config": {"meta": {"owner": "de", "hive_table": "core.fct_orders"}},
                        "columns": [
                            {
                                "name": "order_id",
                                "description": "primary order key",
                                "entity": {"type": "primary", "name": "order"},
                            }
                        ],
                        "metrics": [
                            {
                                "name": "order_count",
                                "description": "count of orders",
                                "type": "simple",
                                "agg": "count",
                            }
                        ],
                    }
                ]
            }
        ),
        encoding="utf-8",
    )
    docs, stats = collect_semantic_model_documents_with_stats(tmp_path)
    assert stats["models"] == 1
    assert stats["column_chunks"] == 1
    assert stats["metric_chunks"] == 1
    assert len(docs) == 1
    chunks = list(IdentitySplitStrategy().iter_chunks(docs[0]))
    types = {c.payload()["chunk_type"] for c in chunks}
    assert types == {"model+columns", "model+metrics"}
    columns = next(c for c in chunks if c.payload()["chunk_type"] == "model+columns")
    assert columns.payload()["model_name"] == "fct_orders"
    assert "order_id" in columns.embed_text()
    assert columns.payload()["columns"][0]["description"] == "primary order key"
    metrics = next(c for c in chunks if c.payload()["chunk_type"] == "model+metrics")
    assert "order_count" in metrics.embed_text()
    ids = [c.point_id() for c in chunks]
    assert len(ids) == len(set(ids))


def _alnum(text: str) -> str:
    return "".join(ch for ch in text if ch.isalnum())


def _packed_bodies(header_lines: list[str], pieces: list[str]) -> str:
    header = "\n".join(header_lines).strip()
    bodies: list[str] = []
    for piece in pieces:
        body = piece
        if header and piece.startswith(header):
            body = piece[len(header) :].lstrip("\n")
        bodies.append(body)
    return "".join(bodies)


def test_pack_embed_sections_splits_without_dropping_text() -> None:
    marker = "UNIQUE_COL_BODY_" + ("z" * 80)
    header = ["Model: fct_wide", "Type: model+columns"]
    blocks = [f"- col_{i}: {marker}" for i in range(12)]
    pieces = pack_embed_sections(header, blocks, max_chars=180)
    assert len(pieces) > 1
    assert all(len(piece) <= 180 for piece in pieces)
    combined = "\n".join(pieces)
    for i in range(12):
        assert f"col_{i}" in combined
    assert _alnum("".join(blocks)) == _alnum(_packed_bodies(header, pieces))


def test_model_document_packs_columns_without_dropping_descriptions(
    tmp_path: Path,
) -> None:
    long_desc = "column semantics " + ("alpha " * 40).strip()
    yml = tmp_path / "wide.yml"
    yml.write_text(
        yaml.dump(
            {
                "models": [
                    {
                        "name": "fct_wide",
                        "description": "Wide fact table",
                        "columns": [
                            {"name": f"col_{i}", "description": long_desc}
                            for i in range(8)
                        ],
                        "metrics": [
                            {
                                "name": f"metric_{i}",
                                "description": "metric semantics " + ("beta " * 40),
                            }
                            for i in range(6)
                        ],
                    }
                ]
            }
        ),
        encoding="utf-8",
    )
    docs, stats = documents_from_yml(yml, max_chars=220)
    assert len(docs) == 1
    assert stats["column_chunks"] > 1
    assert stats["metric_chunks"] > 1
    chunks = list(IdentitySplitStrategy().iter_chunks(docs[0]))
    column_chunks = [
        c for c in chunks if c.payload()["chunk_type"] == "model+columns"
    ]
    metric_chunks = [
        c for c in chunks if c.payload()["chunk_type"] == "model+metrics"
    ]
    column_text = "\n".join(c.embed_text() for c in column_chunks)
    metric_text = "\n".join(c.embed_text() for c in metric_chunks)
    for i in range(8):
        assert f"col_{i}" in column_text
    for i in range(6):
        assert f"metric_{i}" in metric_text
    column_letters = Counter(ch for ch in column_text.lower() if ch.isalpha())
    metric_letters = Counter(ch for ch in metric_text.lower() if ch.isalpha())
    needed_column = Counter(ch for ch in (long_desc * 8).lower() if ch.isalpha())
    metric_desc = ("metric semantics " + ("beta " * 40)).strip()
    needed_metric = Counter(ch for ch in (metric_desc * 6).lower() if ch.isalpha())
    for ch, n in needed_column.items():
        assert column_letters[ch] >= n
    for ch, n in needed_metric.items():
        assert metric_letters[ch] >= n
    payload_cols = chunks[0].payload()["columns"]
    assert payload_cols[0]["description"] == long_desc
    ids = [c.point_id() for c in chunks]
    assert len(ids) == len(set(ids))


@patch("rag.ingest.upsert_points")
@patch("rag.ingest.ensure_collection")
@patch("rag.ingest.get_embeddings")
def test_upsert_documents_batches_chunks(
    mock_embeddings: MagicMock,
    mock_ensure: MagicMock,
    mock_upsert: MagicMock,
) -> None:
        mock_embeddings.return_value = [([0.1, 0.2], {2: 0.4, 1: 0.9})]
        doc = Document(doc_id="d1", url="u", title="t", content="short")
        uploaded = upsert_documents("col", [doc], strategy=IdentitySplitStrategy())
        assert uploaded == 1
        mock_ensure.assert_called_once_with("col")
        mock_upsert.assert_called_once()
        point = mock_upsert.call_args.args[1][0]
        assert point.payload["chunk_data"] == "short"
        assert point.payload["doc_title"] == "t"
        assert point.vector["dense"] == [0.1, 0.2]
        assert point.vector["sparse"].indices == [1, 2]
        assert point.vector["sparse"].values == [0.9, 0.4]


@patch("rag.ingest.upsert_points")
@patch("rag.ingest.ensure_collection")
@patch("rag.ingest.get_embeddings")
def test_upsert_documents_writes_each_chunk_own_vectors(
    mock_embeddings: MagicMock,
    mock_ensure: MagicMock,
    mock_upsert: MagicMock,
) -> None:
    mock_embeddings.return_value = [
        ([0.1, 0.0], {1: 1.0}),
        ([0.0, 0.2], {9: 0.5}),
    ]
    docs = [
        Document(doc_id="d1", url="u1", title="t1", content="one"),
        Document(doc_id="d2", url="u2", title="t2", content="two"),
    ]
    uploaded = upsert_documents("col", docs, strategy=IdentitySplitStrategy())
    assert uploaded == 2
    points = mock_upsert.call_args.args[1]
    assert points[0].vector["dense"] == [0.1, 0.0]
    assert points[0].vector["sparse"].indices == [1]
    assert points[1].vector["dense"] == [0.0, 0.2]
    assert points[1].vector["sparse"].indices == [9]


@patch("rag.ingest.upsert_points")
@patch("rag.ingest.ensure_collection")
@patch("rag.ingest.get_embeddings")
def test_upsert_chunks_raises_when_a_batch_fails(
    mock_embeddings: MagicMock,
    mock_ensure: MagicMock,
    mock_upsert: MagicMock,
) -> None:
    mock_embeddings.side_effect = [
        [([0.1, 0.2], {1: 0.9})],
        RuntimeError("oom"),
    ]
    docs = [
        Document(doc_id="d1", url="u1", title="t1", content="one"),
        Document(doc_id="d2", url="u2", title="t2", content="two"),
    ]
    with pytest.raises(RuntimeError, match="Ingest incomplete"):
        upsert_documents(
            "col",
            docs,
            strategy=IdentitySplitStrategy(),
            batch_size=1,
        )
    mock_upsert.assert_called_once()

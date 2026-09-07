"""Document / paragraph / chunk split and source adapters."""

from __future__ import annotations

from pathlib import Path
from unittest.mock import MagicMock, patch

import pandas as pd
import yaml

from rag.google_drive_ingest import DriveDocument
from rag.model_ingest import collect_semantic_model_documents_with_stats
from rag.nrag.data import Document
from rag.nrag.jira import JiraDocument, row_to_document
from rag.nrag.pdf import MarkdownDocument, PdfDocument, markdown_section_texts
from rag.nrag.pipeline import upsert_documents
from rag.nrag.split import IdentitySplitStrategy, LengthSplitStrategy, split_text


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


def test_jira_identity_split_keeps_legacy_point_id_and_payload() -> None:
    row = pd.Series(
        {
            "Summary": "Hive metastore timeout",
            "Description": "Jobs fail after upgrade",
            "Issue key": "TAHOE-123",
            "Issue id": "10001",
            "Status": "Done",
            "Comment": "Root cause was connection pool",
        }
    )
    doc = row_to_document(row, fallback_id=7)
    assert isinstance(doc, JiraDocument)
    chunks = list(IdentitySplitStrategy().iter_chunks(doc))
    assert len(chunks) == 1
    chunk = chunks[0]
    assert chunk.point_id() == 10001
    payload = chunk.payload()
    assert payload["issue_key"] == "TAHOE-123"
    assert payload["status"] == "Done"
    assert "Summary: Hive metastore timeout" in chunk.embed_text()
    assert payload["prev_chunk_seq"] == -1
    assert payload["next_chunk_seq"] == -2


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
    metrics = next(c for c in chunks if c.payload()["chunk_type"] == "model+metrics")
    assert "order_count" in metrics.embed_text()


@patch("rag.nrag.pipeline.upsert_points")
@patch("rag.nrag.pipeline.ensure_collection")
@patch("rag.nrag.pipeline.get_embeddings")
def test_upsert_documents_batches_chunks(
    mock_embeddings: MagicMock,
    mock_ensure: MagicMock,
    mock_upsert: MagicMock,
) -> None:
    mock_embeddings.return_value = [[0.1, 0.2]]
    doc = Document(doc_id="d1", url="u", title="t", content="short")
    uploaded = upsert_documents("col", [doc], strategy=IdentitySplitStrategy())
    assert uploaded == 1
    mock_ensure.assert_called_once_with("col")
    mock_upsert.assert_called_once()
    point = mock_upsert.call_args.args[1][0]
    assert point.payload["chunk_data"] == "short"
    assert point.payload["doc_title"] == "t"

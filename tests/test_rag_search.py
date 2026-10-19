"""Hybrid retrieve, sparse vector conversion, and rerank."""

from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest

from qdrant_client.http import models as qmodels

from rag.embeddings import to_sparse_vector
from rag.models import download_repo
from rag.qdrant import passage_text, rerank_points, search


def _collection_info(*, hybrid: bool = False) -> SimpleNamespace:
    if hybrid:
        vectors: object = {"dense": SimpleNamespace(size=1024)}
        sparse: object = {"sparse": SimpleNamespace()}
    else:
        vectors = SimpleNamespace(size=1024)
        sparse = None
    return SimpleNamespace(
        config=SimpleNamespace(
            params=SimpleNamespace(vectors=vectors, sparse_vectors=sparse)
        )
    )


def test_to_sparse_vector_sorts_and_coerces_keys() -> None:
    vector = to_sparse_vector({"3": 0.2, "1": 0.9, 3: 0.4})
    assert vector.indices == [1, 3]
    assert vector.values == [0.9, 0.4]


def test_passage_text_prefers_chunk_data() -> None:
    assert passage_text({"chunk_data": "body", "text": "other"}) == "body"
    assert passage_text({"text": "fallback"}) == "fallback"
    assert passage_text({}) == ""


def test_passage_text_joins_dbt_structured_payload() -> None:
    text = passage_text(
        {
            "model_name": "fct_orders",
            "chunk_type": "model+columns",
            "description": "Order facts",
            "column_names": ["order_id", "gmv"],
            "metric_names": ["order_count"],
        }
    )
    assert "fct_orders" in text
    assert "model+columns" in text
    assert "order_id" in text
    assert "order_count" in text
    assert "Order facts" in text


def test_rerank_points_orders_by_cross_encoder_score() -> None:
    points = [
        SimpleNamespace(id=1, payload={"chunk_data": "hive"}, score=0.9),
        SimpleNamespace(id=2, payload={"chunk_data": "kafka"}, score=0.1),
    ]
    reranker = MagicMock()
    reranker.compute_score.return_value = [0.2, 0.8]
    with (
        patch("rag.qdrant.get_rag_config") as mock_cfg,
        patch("rag.qdrant._reranker", return_value=reranker),
    ):
        mock_cfg.return_value.rerank.model = "BAAI/bge-reranker-v2-m3"
        ranked = rerank_points("lag", points, limit=2)
    assert [point.id for point, _score in ranked] == [2, 1]
    assert ranked[0][1] == 0.8


def test_rerank_points_raises_when_reranker_fails() -> None:
    points = [
        SimpleNamespace(id=1, payload={"chunk_data": "a"}, score=0.4),
        SimpleNamespace(id=2, payload={"chunk_data": "b"}, score=0.1),
    ]
    with (
        patch("rag.qdrant.get_rag_config") as mock_cfg,
        patch("rag.qdrant._reranker", side_effect=OSError("connection reset")),
        pytest.raises(OSError, match="connection reset"),
    ):
        mock_cfg.return_value.rerank.model = "BAAI/bge-reranker-v2-m3"
        rerank_points("q", points, limit=2)


def test_download_repo_retries_mirror_and_skips_ds_store(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path,
) -> None:
    monkeypatch.delenv("HF_ENDPOINT", raising=False)
    calls: list[tuple[str | None, list[str] | None]] = []

    def fake_snapshot(repo_id: str, **kwargs: object) -> str:
        endpoint = kwargs.get("endpoint")
        patterns = kwargs.get("ignore_patterns")
        calls.append((endpoint if isinstance(endpoint, str) else None, patterns if isinstance(patterns, list) else None))
        if endpoint is None:
            raise ConnectionResetError(54, "Connection reset by peer")
        return str(kwargs.get("local_dir"))

    with patch("huggingface_hub.snapshot_download", fake_snapshot):
        download_repo("BAAI/bge-m3", tmp_path / "bge-m3")
    assert [endpoint for endpoint, _ in calls] == [None, "https://hf-mirror.com"]
    assert calls[0][1] is not None
    assert "imgs/*" in calls[0][1]
    assert "*.DS_Store" in calls[0][1]


def test_rerank_points_skips_when_model_blank() -> None:
    points = [
        SimpleNamespace(id=1, payload={"chunk_data": "a"}, score=0.4),
        SimpleNamespace(id=2, payload={"chunk_data": "b"}, score=0.1),
    ]
    with patch("rag.qdrant.get_rag_config") as mock_cfg:
        mock_cfg.return_value.rerank.model = ""
        ranked = rerank_points("q", points, limit=1)
    assert len(ranked) == 1
    assert ranked[0][0].id == 1
    assert ranked[0][1] == 0.4


@patch("rag.qdrant.rerank_points")
@patch("rag.qdrant.get_embedding")
@patch("rag.qdrant.get_client")
def test_search_hybrid_prefetch_uses_sparse_vector(
    mock_client: MagicMock,
    mock_embed: MagicMock,
    mock_rerank: MagicMock,
) -> None:
    mock_embed.return_value = ([0.1, 0.2], {4: 0.7, 1: 0.2})
    qdrant = MagicMock()
    mock_client.return_value = qdrant
    qdrant.get_collection.return_value = _collection_info(hybrid=True)
    point = SimpleNamespace(id=9, payload={"chunk_data": "ticket"}, score=0.03)
    qdrant.query_points.return_value = SimpleNamespace(points=[point])
    mock_rerank.return_value = [(point, 0.91)]

    hits = search("jira_tahoe", "metastore timeout", limit=3)

    kwargs = qdrant.query_points.call_args.kwargs
    prefetch = kwargs["prefetch"]
    assert len(prefetch) == 2
    assert prefetch[0].using == "dense"
    assert prefetch[0].query == [0.1, 0.2]
    assert prefetch[1].using == "sparse"
    assert prefetch[1].query.indices == [1, 4]
    assert prefetch[1].query.values == [0.2, 0.7]
    assert kwargs["query"].fusion == qmodels.Fusion.RRF
    assert hits == [{"id": 9, "score": 0.91, "payload": {"chunk_data": "ticket"}}]
    mock_rerank.assert_called_once()
    assert mock_rerank.call_args.kwargs["limit"] == 3


@patch("rag.qdrant.rerank_points")
@patch("rag.qdrant.get_embedding")
@patch("rag.qdrant.get_client")
def test_search_rejects_empty_sparse_query(
    mock_client: MagicMock,
    mock_embed: MagicMock,
    mock_rerank: MagicMock,
) -> None:
    mock_embed.return_value = ([0.3, 0.4], {})
    qdrant = MagicMock()
    mock_client.return_value = qdrant
    qdrant.get_collection.return_value = _collection_info(hybrid=True)

    with pytest.raises(ValueError, match="dense and sparse"):
        search("col", "query", limit=1)

    qdrant.query_points.assert_not_called()
    mock_rerank.assert_not_called()


@patch("rag.qdrant.get_embedding")
@patch("rag.qdrant.get_client")
def test_search_rejects_non_hybrid_collection(
    mock_client: MagicMock,
    mock_embed: MagicMock,
) -> None:
    mock_embed.return_value = ([0.3, 0.4], {1: 0.9})
    qdrant = MagicMock()
    mock_client.return_value = qdrant
    qdrant.get_collection.return_value = _collection_info(hybrid=False)

    with pytest.raises(ValueError, match="hybrid"):
        search("dbt_models", "order count", limit=1)

    qdrant.query_points.assert_not_called()

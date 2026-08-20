from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest

from tools import k8s as k8s_mod


def _pod(
    *,
    name: str = "trino-0",
    namespace: str = "presto",
    phase: str = "Running",
    ready: bool = True,
) -> SimpleNamespace:
    return SimpleNamespace(
        metadata=SimpleNamespace(name=name, namespace=namespace, labels={"app": "trino"}),
        spec=SimpleNamespace(node_name="node-a"),
        status=SimpleNamespace(
            phase=phase,
            pod_ip="10.0.0.1",
            start_time="2026-01-01T00:00:00Z",
            container_statuses=[
                SimpleNamespace(
                    name="trino",
                    ready=ready,
                    restart_count=0,
                    state=SimpleNamespace(
                        running=SimpleNamespace(started_at="2026-01-01T00:00:00Z"),
                        waiting=None,
                        terminated=None,
                    ),
                )
            ],
        ),
    )


@pytest.fixture(autouse=True)
def _clear_k8s_cache():
    k8s_mod._api_bundle.cache_clear()
    yield
    k8s_mod._api_bundle.cache_clear()


def test_k8s_list_pods_returns_compact_summary(monkeypatch: pytest.MonkeyPatch) -> None:
    core = MagicMock()
    core.list_namespaced_pod.return_value = SimpleNamespace(items=[_pod()])
    monkeypatch.setattr(k8s_mod, "_api_bundle", lambda: (core, MagicMock(), MagicMock()))

    result = k8s_mod.k8s_list_pods.invoke(
        {"namespace": "presto", "label_selector": "app=trino", "limit": 10}
    )

    assert result["namespace"] == "presto"
    assert result["count"] == 1
    assert result["pods"][0]["name"] == "trino-0"
    assert result["pods"][0]["phase"] == "Running"
    assert result["pods"][0]["containers"][0]["state"] == "running"
    core.list_namespaced_pod.assert_called_once()
    kwargs = core.list_namespaced_pod.call_args.kwargs
    assert kwargs["namespace"] == "presto"
    assert kwargs["label_selector"] == "app=trino"


def test_k8s_get_pod_logs_truncates(monkeypatch: pytest.MonkeyPatch) -> None:
    core = MagicMock()
    core.read_namespaced_pod_log.return_value = "x" * (k8s_mod.MAX_LOG_CHARS + 50)
    monkeypatch.setattr(k8s_mod, "_api_bundle", lambda: (core, MagicMock(), MagicMock()))

    result = k8s_mod.k8s_get_pod_logs.invoke(
        {"name": "trino-0", "namespace": "presto", "tail_lines": 100}
    )

    assert result["truncated"] is True
    assert result["logs"].startswith("...[truncated")
    assert len(result["logs"]) <= k8s_mod.MAX_LOG_CHARS + 80


def test_k8s_list_events_prefers_warnings(monkeypatch: pytest.MonkeyPatch) -> None:
    core = MagicMock()
    core.list_namespaced_event.return_value = SimpleNamespace(
        items=[
            SimpleNamespace(
                type="Normal",
                reason="Started",
                message="ok",
                count=1,
                last_timestamp="t1",
                event_time=None,
                metadata=SimpleNamespace(namespace="spark"),
                involved_object=SimpleNamespace(kind="Pod", name="a"),
            ),
            SimpleNamespace(
                type="Warning",
                reason="BackOff",
                message="crash",
                count=3,
                last_timestamp="t2",
                event_time=None,
                metadata=SimpleNamespace(namespace="spark"),
                involved_object=SimpleNamespace(kind="Pod", name="b"),
            ),
        ]
    )
    monkeypatch.setattr(k8s_mod, "_api_bundle", lambda: (core, MagicMock(), MagicMock()))

    result = k8s_mod.k8s_list_events.invoke({"namespace": "spark", "limit": 10})
    assert result["events"][0]["type"] == "Warning"
    assert result["events"][0]["reason"] == "BackOff"


def test_k8s_list_custom_objects_compacts_items(monkeypatch: pytest.MonkeyPatch) -> None:
    custom = MagicMock()
    custom.list_namespaced_custom_object.return_value = {
        "items": [
            {
                "metadata": {
                    "name": "job-1",
                    "namespace": "spark",
                    "creationTimestamp": "2026-01-01T00:00:00Z",
                    "labels": {"app": "x"},
                },
                "spec": {"mainClass": "com.example.Main", "driver": {}},
                "status": {"applicationState": {"state": "COMPLETED"}},
            }
        ]
    }
    monkeypatch.setattr(k8s_mod, "_api_bundle", lambda: (MagicMock(), MagicMock(), custom))

    result = k8s_mod.k8s_list_custom_objects.invoke(
        {
            "group": "sparkoperator.k8s.io",
            "version": "v1beta2",
            "plural": "sparkapplications",
            "namespace": "spark",
        }
    )
    assert result["count"] == 1
    assert result["items"][0]["name"] == "job-1"
    assert result["items"][0]["status"]["applicationState"]["state"] == "COMPLETED"
    assert "mainClass" not in result["items"][0]


def test_k8s_api_errors_become_tool_error(monkeypatch: pytest.MonkeyPatch) -> None:
    core = MagicMock()
    core.list_namespaced_pod.side_effect = RuntimeError("connection refused")
    monkeypatch.setattr(k8s_mod, "_api_bundle", lambda: (core, MagicMock(), MagicMock()))

    with pytest.raises(k8s_mod.K8sToolError, match="list pods"):
        k8s_mod.k8s_list_pods.invoke({"namespace": "presto"})


def test_k8s_describe_pod_includes_events(monkeypatch: pytest.MonkeyPatch) -> None:
    core = MagicMock()
    core.read_namespaced_pod.return_value = _pod()
    core.list_namespaced_event.return_value = SimpleNamespace(
        items=[
            SimpleNamespace(
                type="Warning",
                reason="BackOff",
                message="crash",
                count=2,
                last_timestamp="t2",
                event_time=None,
                metadata=SimpleNamespace(namespace="presto"),
                involved_object=SimpleNamespace(kind="Pod", name="trino-0"),
            )
        ]
    )
    monkeypatch.setattr(k8s_mod, "_api_bundle", lambda: (core, MagicMock(), MagicMock()))

    result = k8s_mod.k8s_describe_pod.invoke({"name": "trino-0", "namespace": "presto"})
    assert result["name"] == "trino-0"
    assert result["events"][0]["reason"] == "BackOff"
    kwargs = core.list_namespaced_event.call_args.kwargs
    assert kwargs["field_selector"] == "involvedObject.name=trino-0"


def test_tools_export_names() -> None:
    names = {tool.name for tool in k8s_mod.TOOLS}
    assert "k8s_list_pods" in names
    assert "k8s_describe_pod" in names
    assert "k8s_get_pod_logs" in names
    assert "k8s_list_spark_applications" in names

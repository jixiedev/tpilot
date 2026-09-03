"""Read-only Kubernetes tools for Tahoe cluster namespaces.

Tools are lazy: importing this module does not load kubeconfig. Responses are
compact dicts suitable for agent context (not raw client models).
"""

from __future__ import annotations

import logging
from functools import lru_cache
from typing import Any

from langchain.tools import tool

from config.tool_config import K8sToolConfig, k8s_config_file, tool_config
from tools.common import register_tool_binding
from tools.errors import ToolErrorType, register_exception

log = logging.getLogger(__name__)

# Common Tahoe platform namespaces (informational; tools accept any namespace).
TAHOE_NAMESPACES = (
    "presto",
    "spark",
    "flink",
    "hive",
    "airflow",
    "superset",
    "tableau",
    "datahub",
    "default",
)

DEFAULT_LOG_TAIL_LINES = 200
MAX_LOG_CHARS = 12_000
DEFAULT_LIST_LIMIT = 30
MAX_LIST_LIMIT = 50


class K8sToolError(RuntimeError):
    """Raised when a Kubernetes API call fails."""


def _classify_k8s_tool_error(exc: BaseException) -> tuple[ToolErrorType, bool, str] | None:
    message = str(exc)
    lower = message.lower()
    if any(token in lower for token in ("not found", "404", "notfound")):
        return ToolErrorType.NOT_FOUND, False, message
    if any(token in lower for token in ("forbidden", "unauthorized", "403", "401")):
        return ToolErrorType.PERMISSION, False, message
    if any(token in lower for token in ("timeout", "timed out")):
        return ToolErrorType.TIMEOUT, True, message
    if any(token in lower for token in ("connection", "connect", "refused", "unreachable")):
        return ToolErrorType.CONNECTION, True, message
    return ToolErrorType.UNKNOWN, False, message


register_exception(K8sToolError, classifier=_classify_k8s_tool_error)

def _clamp_limit(limit: int) -> int:
    try:
        value = int(limit)
    except (TypeError, ValueError) as exc:
        raise ValueError("limit must be an integer") from exc
    if value < 1:
        raise ValueError("limit must be >= 1")
    return min(value, MAX_LIST_LIMIT)


def _require_name(name: str, *, label: str = "name") -> str:
    text = (name or "").strip()
    if not text:
        raise ValueError(f"{label} must be a non-empty string")
    return text


def _namespace(namespace: str | None, cfg: K8sToolConfig | None = None) -> str:
    text = (namespace or "").strip()
    if text:
        return text
    return (cfg or tool_config.k8s).default_namespace


@lru_cache(maxsize=1)
def _api_bundle() -> tuple[Any, Any, Any]:
    """Load kubeconfig once and return (CoreV1Api, AppsV1Api, CustomObjectsApi)."""
    from kubernetes import client, config as k8s_config

    cfg = tool_config.k8s
    config_file = k8s_config_file(cfg) or None
    try:
        if config_file:
            k8s_config.load_kube_config(config_file=config_file)
        else:
            k8s_config.load_kube_config()
    except Exception as exc:
        raise K8sToolError(
            f"Failed to load kubeconfig"
            + (f" from {config_file!r}" if config_file else "")
            + f": {exc}"
        ) from exc

    api_client = client.ApiClient()
    return (
        client.CoreV1Api(api_client),
        client.AppsV1Api(api_client),
        client.CustomObjectsApi(api_client),
    )


def _core() -> Any:
    return _api_bundle()[0]


def _apps() -> Any:
    return _api_bundle()[1]


def _custom() -> Any:
    return _api_bundle()[2]


def _api_error_message(exc: Exception) -> str:
    status = getattr(exc, "status", None)
    reason = getattr(exc, "reason", None)
    body = getattr(exc, "body", None)
    parts = [str(exc)]
    if status is not None:
        parts.insert(0, f"HTTP {status}")
    if reason:
        parts.append(str(reason))
    if body and body not in parts[-1]:
        parts.append(str(body)[:500])
    return ": ".join(dict.fromkeys(parts))  # stable unique join


def _wrap_api(call: Any, *, action: str) -> Any:
    try:
        return call()
    except Exception as exc:
        raise K8sToolError(f"{action} failed: {_api_error_message(exc)}") from exc


def _container_status_summary(cs: Any) -> dict[str, Any]:
    state = getattr(cs, "state", None)
    state_name = "unknown"
    detail = None
    if state is not None:
        if getattr(state, "running", None) is not None:
            state_name = "running"
        elif getattr(state, "waiting", None) is not None:
            state_name = "waiting"
            waiting = state.waiting
            detail = getattr(waiting, "reason", None) or getattr(waiting, "message", None)
        elif getattr(state, "terminated", None) is not None:
            state_name = "terminated"
            terminated = state.terminated
            detail = getattr(terminated, "reason", None)
    return {
        "name": getattr(cs, "name", None),
        "ready": getattr(cs, "ready", None),
        "restart_count": getattr(cs, "restart_count", None),
        "state": state_name,
        "detail": detail,
    }


def _pod_summary(pod: Any) -> dict[str, Any]:
    meta = getattr(pod, "metadata", None)
    status = getattr(pod, "status", None)
    spec = getattr(pod, "spec", None)
    container_statuses = list(getattr(status, "container_statuses", None) or [])
    return {
        "name": getattr(meta, "name", None),
        "namespace": getattr(meta, "namespace", None),
        "phase": getattr(status, "phase", None),
        "node": getattr(spec, "node_name", None),
        "pod_ip": getattr(status, "pod_ip", None),
        "start_time": str(getattr(status, "start_time", None) or "") or None,
        "labels": dict(getattr(meta, "labels", None) or {}),
        "containers": [_container_status_summary(cs) for cs in container_statuses],
    }


def _pod_conditions(pod: Any) -> list[dict[str, Any]]:
    status = getattr(pod, "status", None)
    conditions = []
    for cond in list(getattr(status, "conditions", None) or []):
        conditions.append(
            {
                "type": getattr(cond, "type", None),
                "status": getattr(cond, "status", None),
                "reason": getattr(cond, "reason", None),
                "message": getattr(cond, "message", None),
            }
        )
    return conditions


def _container_specs(pod: Any) -> list[dict[str, Any]]:
    spec = getattr(pod, "spec", None)
    return [
        {
            "name": getattr(container, "name", None),
            "image": getattr(container, "image", None),
        }
        for container in list(getattr(spec, "containers", None) or [])
    ]


def _deployment_summary(dep: Any) -> dict[str, Any]:
    meta = getattr(dep, "metadata", None)
    status = getattr(dep, "status", None)
    spec = getattr(dep, "spec", None)
    return {
        "name": getattr(meta, "name", None),
        "namespace": getattr(meta, "namespace", None),
        "replicas": getattr(spec, "replicas", None),
        "ready_replicas": getattr(status, "ready_replicas", None),
        "available_replicas": getattr(status, "available_replicas", None),
        "updated_replicas": getattr(status, "updated_replicas", None),
        "labels": dict(getattr(meta, "labels", None) or {}),
    }


def _event_summary(event: Any) -> dict[str, Any]:
    meta = getattr(event, "metadata", None)
    involved = getattr(event, "involved_object", None)
    return {
        "type": getattr(event, "type", None),
        "reason": getattr(event, "reason", None),
        "message": getattr(event, "message", None),
        "count": getattr(event, "count", None),
        "last_timestamp": str(
            getattr(event, "last_timestamp", None)
            or getattr(event, "event_time", None)
            or ""
        )
        or None,
        "involved": {
            "kind": getattr(involved, "kind", None),
            "name": getattr(involved, "name", None),
        },
        "namespace": getattr(meta, "namespace", None),
    }


def _crd_item_summary(item: dict[str, Any]) -> dict[str, Any]:
    meta = item.get("metadata") if isinstance(item.get("metadata"), dict) else {}
    status = item.get("status") if isinstance(item.get("status"), dict) else {}
    spec = item.get("spec") if isinstance(item.get("spec"), dict) else {}
    compact_status = {
        key: status[key]
        for key in (
            "phase",
            "applicationState",
            "jobStatus",
            "state",
            "conditions",
        )
        if key in status
    }
    return {
        "name": meta.get("name"),
        "namespace": meta.get("namespace"),
        "creation_timestamp": meta.get("creationTimestamp"),
        "labels": meta.get("labels") or {},
        "spec_keys": sorted(spec.keys())[:20],
        "status": compact_status or None,
    }


@tool
def k8s_list_namespaces() -> dict[str, Any]:
    """List Kubernetes namespaces (highlights known Tahoe platform namespaces)."""
    result = _wrap_api(lambda: _core().list_namespace(), action="list namespaces")
    names = [
        getattr(getattr(item, "metadata", None), "name", None)
        for item in (getattr(result, "items", None) or [])
    ]
    names = [n for n in names if isinstance(n, str) and n.strip()]
    tahoe = [n for n in names if n in TAHOE_NAMESPACES]
    return {
        "count": len(names),
        "tahoe_namespaces": tahoe,
        "namespaces": names,
        "note": (
            "Common Tahoe namespaces include: "
            + ", ".join(TAHOE_NAMESPACES)
        ),
    }


@tool
def k8s_list_pods(
    namespace: str = "",
    label_selector: str = "",
    limit: int = DEFAULT_LIST_LIMIT,
) -> dict[str, Any]:
    """List pods in a namespace with phase, node, and container readiness.

    ``namespace`` defaults to tools.toml ``[k8s].default_namespace``.
    Optional ``label_selector`` uses standard Kubernetes label syntax
    (e.g. ``app=trino``).
    """
    ns = _namespace(namespace)
    page = _clamp_limit(limit)
    result = _wrap_api(
        lambda: _core().list_namespaced_pod(
            namespace=ns,
            watch=False,
            label_selector=(label_selector or "").strip(),
            limit=page,
        ),
        action=f"list pods in {ns}",
    )
    items = [_pod_summary(pod) for pod in (getattr(result, "items", None) or [])]
    return {
        "namespace": ns,
        "label_selector": (label_selector or "").strip() or None,
        "count": len(items),
        "pods": items,
    }


@tool
def k8s_get_pod(name: str, namespace: str = "") -> dict[str, Any]:
    """Get a compact pod summary (phase, node, container states, labels)."""
    ns = _namespace(namespace)
    pod_name = _require_name(name, label="name")
    pod = _wrap_api(
        lambda: _core().read_namespaced_pod(name=pod_name, namespace=ns),
        action=f"get pod {pod_name}",
    )
    return _pod_summary(pod)


@tool
def k8s_describe_pod(name: str, namespace: str = "") -> dict[str, Any]:
    """Describe a pod: status, containers, conditions, and recent events.

    Similar to ``kubectl describe pod``. Use after ``k8s_list_pods`` when a pod
    is CrashLooping or Pending.
    """
    ns = _namespace(namespace)
    pod_name = _require_name(name, label="name")
    pod = _wrap_api(
        lambda: _core().read_namespaced_pod(name=pod_name, namespace=ns),
        action=f"describe pod {pod_name}",
    )
    events_result = _wrap_api(
        lambda: _core().list_namespaced_event(
            namespace=ns,
            field_selector=f"involvedObject.name={pod_name}",
            limit=20,
        ),
        action=f"list events for pod {pod_name}",
    )
    meta = getattr(pod, "metadata", None)
    spec = getattr(pod, "spec", None)
    status = getattr(pod, "status", None)
    summary = _pod_summary(pod)
    summary.update(
        {
            "uid": getattr(meta, "uid", None),
            "created": str(getattr(meta, "creation_timestamp", None) or "") or None,
            "service_account": getattr(spec, "service_account_name", None),
            "restart_policy": getattr(spec, "restart_policy", None),
            "host_ip": getattr(status, "host_ip", None),
            "qos_class": getattr(status, "qos_class", None),
            "conditions": _pod_conditions(pod),
            "container_specs": _container_specs(pod),
            "events": [
                _event_summary(ev) for ev in (getattr(events_result, "items", None) or [])
            ],
        }
    )
    return summary


@tool
def k8s_get_pod_logs(
    name: str,
    namespace: str = "",
    container: str = "",
    tail_lines: int = DEFAULT_LOG_TAIL_LINES,
    previous: bool = False,
) -> dict[str, Any]:
    """Fetch recent logs from a pod container (truncated for agent context).

    Use ``previous=True`` for the last terminated container instance.
    Omit ``container`` when the pod has a single container.
    """
    ns = _namespace(namespace)
    pod_name = _require_name(name, label="name")
    try:
        lines = max(1, int(tail_lines))
    except (TypeError, ValueError) as exc:
        raise ValueError("tail_lines must be an integer") from exc
    container_name = (container or "").strip() or None

    def _call():
        kwargs: dict[str, Any] = {
            "name": pod_name,
            "namespace": ns,
            "tail_lines": lines,
            "previous": bool(previous),
        }
        if container_name:
            kwargs["container"] = container_name
        return _core().read_namespaced_pod_log(**kwargs)

    raw = _wrap_api(_call, action=f"get logs for pod {pod_name}")
    text = raw if isinstance(raw, str) else str(raw)
    truncated = len(text) > MAX_LOG_CHARS
    if truncated:
        text = text[-MAX_LOG_CHARS:]
        text = f"...[truncated to last {MAX_LOG_CHARS} chars]...\n" + text
    return {
        "namespace": ns,
        "pod": pod_name,
        "container": container_name,
        "tail_lines": lines,
        "previous": bool(previous),
        "truncated": truncated,
        "logs": text,
    }


@tool
def k8s_list_deployments(
    namespace: str = "",
    limit: int = DEFAULT_LIST_LIMIT,
) -> dict[str, Any]:
    """List Deployments in a namespace (replicas / ready / available)."""
    ns = _namespace(namespace)
    page = _clamp_limit(limit)
    result = _wrap_api(
        lambda: _apps().list_namespaced_deployment(namespace=ns, limit=page),
        action=f"list deployments in {ns}",
    )
    items = [_deployment_summary(dep) for dep in (getattr(result, "items", None) or [])]
    return {"namespace": ns, "count": len(items), "deployments": items}


@tool
def k8s_list_events(
    namespace: str = "",
    limit: int = DEFAULT_LIST_LIMIT,
) -> dict[str, Any]:
    """List recent Warning/Normal events in a namespace (useful for crash debugging)."""
    ns = _namespace(namespace)
    page = _clamp_limit(limit)
    result = _wrap_api(
        lambda: _core().list_namespaced_event(namespace=ns, limit=page),
        action=f"list events in {ns}",
    )
    items = [_event_summary(ev) for ev in (getattr(result, "items", None) or [])]
    # Prefer warnings first for agents.
    items.sort(key=lambda e: (0 if e.get("type") == "Warning" else 1, e.get("last_timestamp") or ""))
    return {"namespace": ns, "count": len(items), "events": items}


@tool
def k8s_list_custom_objects(
    group: str,
    version: str,
    plural: str,
    namespace: str = "",
    limit: int = DEFAULT_LIST_LIMIT,
) -> dict[str, Any]:
    """List namespaced custom resources (CRDs), returning compact name/status summaries.

    Example Spark Operator apps:
    ``group=sparkoperator.k8s.io``, ``version=v1beta2``, ``plural=sparkapplications``.
    """
    ns = _namespace(namespace)
    page = _clamp_limit(limit)
    group_name = _require_name(group, label="group")
    version_name = _require_name(version, label="version")
    plural_name = _require_name(plural, label="plural")
    result = _wrap_api(
        lambda: _custom().list_namespaced_custom_object(
            group=group_name,
            version=version_name,
            namespace=ns,
            plural=plural_name,
        ),
        action=f"list {plural_name} in {ns}",
    )
    raw_items = result.get("items") if isinstance(result, dict) else None
    items = [_crd_item_summary(item) for item in (raw_items or []) if isinstance(item, dict)]
    items = items[:page]
    return {
        "namespace": ns,
        "group": group_name,
        "version": version_name,
        "plural": plural_name,
        "count": len(items),
        "items": items,
    }


@tool
def k8s_get_custom_object(
    group: str,
    version: str,
    plural: str,
    name: str,
    namespace: str = "",
) -> dict[str, Any]:
    """Get one namespaced custom resource as a compact summary (not the full CR body)."""
    ns = _namespace(namespace)
    obj = _wrap_api(
        lambda: _custom().get_namespaced_custom_object(
            group=_require_name(group, label="group"),
            version=_require_name(version, label="version"),
            namespace=ns,
            plural=_require_name(plural, label="plural"),
            name=_require_name(name, label="name"),
        ),
        action=f"get {plural}/{name}",
    )
    if not isinstance(obj, dict):
        raise K8sToolError(f"unexpected custom object response type: {type(obj)!r}")
    summary = _crd_item_summary(obj)
    summary["api_version"] = obj.get("apiVersion")
    summary["kind"] = obj.get("kind")
    return summary


@tool
def k8s_list_spark_applications(
    namespace: str = "spark",
    limit: int = DEFAULT_LIST_LIMIT,
) -> dict[str, Any]:
    """List SparkApplication CRs (sparkoperator.k8s.io/v1beta2) in a namespace."""
    return k8s_list_custom_objects.invoke(
        {
            "group": "sparkoperator.k8s.io",
            "version": "v1beta2",
            "plural": "sparkapplications",
            "namespace": namespace or "spark",
            "limit": limit,
        }
    )


TOOLS = [
    k8s_list_namespaces,
    k8s_list_pods,
    k8s_get_pod,
    k8s_describe_pod,
    k8s_get_pod_logs,
    k8s_list_deployments,
    k8s_list_events,
    k8s_list_custom_objects,
    k8s_get_custom_object,
    k8s_list_spark_applications,
]

for _k8s_tool in TOOLS:
    register_tool_binding("knowledge,default", _k8s_tool)
    register_tool_binding("diagnostic,default", _k8s_tool)

"""Public web search (Janus WebSearchTool: Tavily / Brave / DuckDuckGo)."""

from __future__ import annotations

import json
import logging
import re
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from html import unescape
from typing import Any, Protocol
from urllib.parse import parse_qs, unquote, urlparse

from langchain.tools import tool

from config.tool_config import tool_config, web_search_api_key
from tools.common import bind_tool_to_agent

USER_AGENT = "TahoePilot/0.1 (+https://github.com/wish/tahoepilot)"
DEFAULT_MAX_RESULTS = 5
_logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class WebSearchHit:
    title: str
    url: str
    snippet: str


class WebSearchClient(Protocol):
    def search(self, query: str, max_results: int) -> list[WebSearchHit]: ...


def _clamp_results(num_results: int | None, default: int = DEFAULT_MAX_RESULTS) -> int:
    if num_results is None or num_results <= 0:
        return max(1, min(default, 10))
    return max(1, min(int(num_results), 10))


def _http_json(
    url: str,
    *,
    method: str = "GET",
    headers: dict[str, str] | None = None,
    body: bytes | None = None,
    timeout: float = 20.0,
) -> dict[str, Any]:
    _logger.info("request to {}, with body {}".format(url, str(body)))
    # todo "error": "Web search failed: ('“*.extern.facebook.com” certificate name does not match input',)"}
    # todo "error": "Web search failed: timed out"}
    request = urllib.request.Request(url, data=body, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            payload = response.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:500]
        raise RuntimeError(f"HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(str(exc.reason or exc)) from exc
    return json.loads(payload) if payload.strip() else {}


def parse_tavily_json(payload: dict[str, Any]) -> list[WebSearchHit]:
    hits: list[WebSearchHit] = []
    for node in payload.get("results") or []:
        if not isinstance(node, dict):
            continue
        title = str(node.get("title") or "")
        url = str(node.get("url") or "")
        snippet = str(node.get("content") or "")
        if title.strip() or url.strip():
            hits.append(WebSearchHit(title=title, url=url, snippet=snippet))
    return hits


def parse_brave_json(payload: dict[str, Any]) -> list[WebSearchHit]:
    web = payload.get("web") if isinstance(payload.get("web"), dict) else {}
    hits: list[WebSearchHit] = []
    for node in web.get("results") or []:
        if not isinstance(node, dict):
            continue
        title = str(node.get("title") or "")
        url = str(node.get("url") or "")
        snippet = str(node.get("description") or "")
        if title.strip() or url.strip():
            hits.append(WebSearchHit(title=title, url=url, snippet=snippet))
    return hits


_RESULT_LINK = re.compile(
    r'class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>',
    re.DOTALL,
)
_RESULT_SNIPPET = re.compile(
    r'class="result__snippet"[^>]*>(.*?)</(?:a|td|div)>',
    re.DOTALL,
)


def _clean_html_text(raw: str) -> str:
    text = re.sub(r"<[^>]+>", "", raw or "")
    text = unescape(text.replace("&amp;", "&"))
    return re.sub(r"\s+", " ", text).strip()


def _resolve_ddg_url(href: str) -> str:
    decoded = (href or "").replace("&amp;", "&")
    if decoded.startswith("//"):
        decoded = "https:" + decoded
    parsed = urlparse(decoded)
    query = parse_qs(parsed.query)
    if "uddg" in query and query["uddg"]:
        return unquote(query["uddg"][0])
    return decoded


def parse_duckduckgo_html(html: str, max_results: int) -> list[WebSearchHit]:
    if not html:
        return []
    titles: list[str] = []
    urls: list[str] = []
    for match in _RESULT_LINK.finditer(html):
        if len(titles) >= max_results:
            break
        urls.append(_resolve_ddg_url(match.group(1)))
        titles.append(_clean_html_text(match.group(2)))
    snippets = [
        _clean_html_text(match.group(1))
        for match in _RESULT_SNIPPET.finditer(html)
    ][:max_results]
    hits: list[WebSearchHit] = []
    for i, title in enumerate(titles):
        snippet = snippets[i] if i < len(snippets) else ""
        hits.append(WebSearchHit(title=title, url=urls[i], snippet=snippet))
    return hits


class TavilyWebSearchClient:
    def __init__(self, api_key: str) -> None:
        key = (api_key or "").strip()
        if not key:
            raise ValueError("Tavily API key is required")
        self.api_key = key

    def search(self, query: str, max_results: int) -> list[WebSearchHit]:
        limit = _clamp_results(max_results)
        body = json.dumps(
            {
                "api_key": self.api_key,
                "query": query.strip(),
                "max_results": limit,
                "search_depth": "basic",
            }
        ).encode("utf-8")
        payload = _http_json(
            "https://api.tavily.com/search",
            method="POST",
            headers={"Content-Type": "application/json", "User-Agent": USER_AGENT},
            body=body,
            timeout=30.0,
        )
        return parse_tavily_json(payload)[:limit]


class BraveWebSearchClient:
    def __init__(self, api_key: str) -> None:
        key = (api_key or "").strip()
        if not key:
            raise ValueError("Brave API key is required")
        self.api_key = key

    def search(self, query: str, max_results: int) -> list[WebSearchHit]:
        limit = _clamp_results(max_results)
        encoded = urllib.parse.quote(query.strip())
        url = f"https://api.search.brave.com/res/v1/web/search?q={encoded}&count={limit}"
        payload = _http_json(
            url,
            headers={
                "Accept": "application/json",
                "X-Subscription-Token": self.api_key,
                "User-Agent": USER_AGENT,
            },
            timeout=20.0,
        )
        return parse_brave_json(payload)[:limit]


class DuckDuckGoWebSearchClient:
    def search(self, query: str, max_results: int) -> list[WebSearchHit]:
        if not (query or "").strip():
            return []
        limit = _clamp_results(max_results)
        body = urllib.parse.urlencode({"q": query.strip(), "b": ""}).encode("utf-8")
        request = urllib.request.Request(
            "https://html.duckduckgo.com/html/",
            data=body,
            method="POST",
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": USER_AGENT,
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=20.0) as response:
                html = response.read().decode("utf-8", errors="replace")
        except urllib.error.HTTPError as exc:
            raise RuntimeError(f"DuckDuckGo search HTTP {exc.code}") from exc
        except urllib.error.URLError as exc:
            raise RuntimeError(str(exc.reason or exc)) from exc
        return parse_duckduckgo_html(html, limit)


def resolve_provider(provider: str, *, tavily_key: str, brave_key: str) -> str:
    name = (provider or "duckduckgo").strip().lower()
    if name == "tavily":
        return "tavily" if tavily_key else "duckduckgo"
    if name == "brave":
        return "brave" if brave_key else "duckduckgo"
    return "duckduckgo"


def create_web_search_client(
    provider: str | None = None,
    *,
    tavily_key: str | None = None,
    brave_key: str | None = None,
) -> WebSearchClient:
    cfg = tool_config.web_search
    tavily = tavily_key if tavily_key is not None else web_search_api_key("tavily", cfg)
    brave = brave_key if brave_key is not None else web_search_api_key("brave", cfg)
    resolved = resolve_provider(provider or cfg.provider, tavily_key=tavily, brave_key=brave)
    if resolved == "tavily":
        return TavilyWebSearchClient(tavily)
    if resolved == "brave":
        return BraveWebSearchClient(brave)
    return DuckDuckGoWebSearchClient()


_client: WebSearchClient | None = None


def set_web_search_client(client: WebSearchClient | None) -> None:
    global _client
    _client = client


def _active_client() -> WebSearchClient:
    if _client is not None:
        return _client
    return create_web_search_client()


def _format_hits(hits: list[WebSearchHit]) -> list[dict[str, str]]:
    return [{"title": hit.title, "url": hit.url, "snippet": hit.snippet} for hit in hits]


@bind_tool_to_agent("tahoe,react")
@bind_tool_to_agent("databot,default")
@bind_tool_to_agent("knowledge,default")
@tool
def web_search(query: str, num_results: int = DEFAULT_MAX_RESULTS) -> dict[str, Any]:
    """Search the public web for up-to-date information. Use for facts, news, company
    background, product docs, and other non-local knowledge. Returns titles, URLs, and snippets.
    Not for searching DataHub/metadata catalogs—use MCP search tools for internal data assets.
    """
    text = (query or "").strip()
    if not text:
        return {"success": False, "query": query, "error": "query must not be blank"}
    cfg = tool_config.web_search
    limit = _clamp_results(num_results, default=cfg.max_results)
    try:
        hits = _active_client().search(text, limit)
    except Exception as exc:
        return {"success": False, "query": text, "error": f"Web search failed: {exc}"}
    if not hits:
        return {
            "success": False,
            "query": text,
            "error": f"No web results found for: {text}",
            "results": [],
        }
    return {"success": True, "query": text, "results": _format_hits(hits)}


def tools_if_enabled() -> list:
    if not tool_config.web_search.enabled:
        return []
    return [web_search]


TOOLS = tools_if_enabled()

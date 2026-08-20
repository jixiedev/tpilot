from __future__ import annotations

from tools.web.search import (
    BraveWebSearchClient,
    DuckDuckGoWebSearchClient,
    TavilyWebSearchClient,
    WebSearchHit,
    parse_brave_json,
    parse_duckduckgo_html,
    parse_tavily_json,
    resolve_provider,
    set_web_search_client,
    web_search,
)


def test_parse_duckduckgo_html_extracts_title_url_snippet() -> None:
    html = (
        '<a class="result__a" href="//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com&amp;rut=1">'
        "Example Title</a>\n"
        '<a class="result__snippet">Short description here.</a>\n'
    )
    results = parse_duckduckgo_html(html, 5)
    assert len(results) == 1
    assert results[0].title == "Example Title"
    assert results[0].url == "https://example.com"
    assert "description" in results[0].snippet


def test_parse_tavily_and_brave_json() -> None:
    tavily = parse_tavily_json(
        {"results": [{"title": "T", "url": "https://t.example", "content": "body"}]}
    )
    assert tavily == [WebSearchHit("T", "https://t.example", "body")]
    brave = parse_brave_json(
        {"web": {"results": [{"title": "B", "url": "https://b.example", "description": "d"}]}}
    )
    assert brave == [WebSearchHit("B", "https://b.example", "d")]


def test_resolve_provider_falls_back_without_key() -> None:
    assert resolve_provider("tavily", tavily_key="", brave_key="") == "duckduckgo"
    assert resolve_provider("tavily", tavily_key="tvly", brave_key="") == "tavily"
    assert resolve_provider("brave", tavily_key="", brave_key="brv") == "brave"
    assert resolve_provider("duckduckgo", tavily_key="x", brave_key="y") == "duckduckgo"


def test_web_search_formats_hits() -> None:
    class _Client:
        def search(self, query: str, max_results: int) -> list[WebSearchHit]:
            assert query == "Wish company history"
            assert max_results == 3
            return [WebSearchHit("Wish", "https://example.com/wish", "Founded in 2010")]

    set_web_search_client(_Client())
    try:
        result = web_search.invoke({"query": "Wish company history", "num_results": 3})
    finally:
        set_web_search_client(None)

    assert result["success"] is True
    assert result["results"][0]["title"] == "Wish"
    assert result["results"][0]["url"] == "https://example.com/wish"
    assert "Founded in 2010" in result["results"][0]["snippet"]


def test_web_search_empty_results() -> None:
    class _Empty:
        def search(self, query: str, max_results: int) -> list[WebSearchHit]:
            return []

    set_web_search_client(_Empty())
    try:
        result = web_search.invoke({"query": "zzzz-not-found"})
    finally:
        set_web_search_client(None)
    assert result["success"] is False
    assert "No web results" in result["error"]


def test_clients_require_api_keys() -> None:
    try:
        TavilyWebSearchClient("")
        raised = False
    except ValueError:
        raised = True
    assert raised
    try:
        BraveWebSearchClient("  ")
        raised = False
    except ValueError:
        raised = True
    assert raised
    assert DuckDuckGoWebSearchClient() is not None

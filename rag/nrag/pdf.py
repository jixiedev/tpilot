"""Heading-aware markdown / PDF documents.

PDFs are converted to text (Tika when a server is available). Sections are
split on markdown headings via markdown-it, then length-chunked by
``LengthSplitStrategy``.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Self
from uuid import uuid4

from markdown_it import MarkdownIt
from markdown_it.token import Token

from rag.nrag.data import Document, Paragraph
from rag.nrag.split import normalize_whitespace


def _heading_title(tokens: list[Token], heading_open_index: int) -> str:
    nxt = heading_open_index + 1
    if nxt < len(tokens) and tokens[nxt].type == "inline":
        return tokens[nxt].content.strip()
    return ""


def tokens_to_text(tokens: list[Token], start: int, end: int) -> str:
    parts: list[str] = []
    for token in tokens[start:end]:
        if token.type == "inline" and token.content:
            parts.append(token.content)
        elif token.type in {"fence", "code_block"} and token.content:
            parts.append(token.content)
        elif token.type in {"paragraph_close", "heading_close"}:
            parts.append("\n\n")
        elif token.type in {"list_item_close", "softbreak", "hardbreak"}:
            parts.append("\n")
    return normalize_whitespace("".join(parts))


def markdown_sections(text: str) -> list[tuple[str, int, int, list[Token]]]:
    """Parse markdown and return ``(title, start, end, tokens)`` heading spans.

    If there are no headings, one span covering the whole token list is returned
    with an empty title (the caller should fall back to the document title).
    """
    tokens = MarkdownIt().parse(text or "")
    heading_at = [i for i, tok in enumerate(tokens) if tok.type == "heading_open"]
    if not heading_at:
        return [("", 0, len(tokens), tokens)]

    spans: list[tuple[str, int, int, list[Token]]] = []
    first = heading_at[0]
    if first > 0:
        preamble = tokens_to_text(tokens, 0, first)
        if preamble:
            spans.append(("", 0, first, tokens))
    for idx, start in enumerate(heading_at):
        end = heading_at[idx + 1] if idx + 1 < len(heading_at) else len(tokens)
        title = _heading_title(tokens, start)
        spans.append((title, start, end, tokens))
    return spans


def markdown_section_texts(
    text: str, *, fallback_title: str = ""
) -> list[tuple[str, str]]:
    """Return ``(title, body)`` sections; one pair when the text has no headings."""
    sections: list[tuple[str, str]] = []
    for title, start, end, tokens in markdown_sections(text):
        body = tokens_to_text(tokens, start, end)
        if body:
            sections.append((title or fallback_title, body))
    return sections


@dataclass(kw_only=True)
class MarkdownDocument(Document):
    tokens: list[Token] = field(default_factory=list, repr=False)
    source_metadata: dict[str, Any] = field(default_factory=dict)

    def metadata(self) -> dict[str, Any]:
        return dict(self.source_metadata)

    @classmethod
    def from_text(
        cls,
        text: str,
        *,
        path: str,
        title: str | None = None,
        doc_id: str | None = None,
        source_metadata: dict[str, Any] | None = None,
    ) -> Self:
        body = text or ""
        tokens = MarkdownIt().parse(body)
        return cls(
            doc_id=doc_id or str(uuid4()),
            url=path,
            title=title or Path(path).stem,
            content=body,
            tokens=tokens,
            source_metadata=source_metadata or {},
        )

    def split_paragraphs(self) -> list[Paragraph]:
        if self.paragraphs:
            return self.paragraphs
        spans = markdown_sections(self.content)
        paras: list[Paragraph] = []
        seq = 0
        for title, start, end, tokens in spans:
            if tokens is not self.tokens:
                self.tokens = tokens
            para = MarkdownParagraph(
                ref_doc=self,
                para_seq=seq,
                para_title=title or self.title,
                token_start=start,
                token_end=end,
            )
            if not para.text:
                continue
            paras.append(para)
            seq += 1
        if not paras:
            paras = [
                MarkdownParagraph(
                    ref_doc=self,
                    para_seq=0,
                    para_title=self.title,
                    token_start=0,
                    token_end=len(self.tokens),
                )
            ]
        self.paragraphs = paras
        return self.paragraphs


@dataclass(kw_only=True)
class MarkdownParagraph(Paragraph):
    """Paragraph backed by a token slice; text is materialized on first read."""

    token_start: int
    token_end: int
    _content: str | None = field(default=None, repr=False, compare=False)

    @property
    def markdown_doc(self) -> MarkdownDocument:
        doc = self.ref_doc
        if not isinstance(doc, MarkdownDocument):
            raise TypeError("MarkdownParagraph.ref_doc must be a MarkdownDocument")
        return doc

    @property
    def text(self) -> str:
        if self._content is None:
            self._content = tokens_to_text(
                self.markdown_doc.tokens, self.token_start, self.token_end
            )
        return self._content


@dataclass(kw_only=True)
class PdfDocument(MarkdownDocument):
    """PDF (or any Tika-supported file) opened via Tika, then split as markdown."""

    @classmethod
    def open(
        cls,
        path: str | Path,
        *,
        tika_endpoint: str | None = None,
    ) -> Self:
        file_path = Path(path)
        suffix = file_path.suffix.lower()
        if suffix in {".md", ".markdown", ".txt"}:
            text = file_path.read_text(encoding="utf-8")
            metadata: dict[str, Any] = {}
        else:
            from tika import parser as tika_parser

            endpoint = (
                tika_endpoint
                or os.environ.get("TIKA_SERVER_ENDPOINT", "").strip()
                or "http://localhost:9998"
            )
            parsed_raw = tika_parser.from_file(str(file_path), serverEndpoint=endpoint)
            parsed = parsed_raw if isinstance(parsed_raw, dict) else {}
            text = str(parsed.get("content") or "").strip()
            raw_meta = parsed.get("metadata") or {}
            metadata = dict(raw_meta) if isinstance(raw_meta, dict) else {}
        return cls.from_text(
            text,
            path=str(file_path),
            title=file_path.stem,
            source_metadata=metadata,
        )

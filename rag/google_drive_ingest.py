"""Ingest Google Drive folder downloads (zip archives and loose files) into Qdrant."""

from __future__ import annotations

import hashlib
import io
import re
import tempfile
import zipfile
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, Iterable

from qdrant_client.http import models as qmodels

from rag.config import get_rag_config
from rag.embeddings import get_embeddings
from rag.store import ensure_collection, upsert_points

# Google Drive "Download" of a folder usually yields one or more zips of exported files.
_TEXT_SUFFIXES = {
    ".txt",
    ".md",
    ".markdown",
    ".rst",
    ".csv",
    ".tsv",
    ".json",
    ".yaml",
    ".yml",
    ".log",
    ".html",
    ".htm",
}
_DOCX_SUFFIXES = {".docx"}
_PDF_SUFFIXES = {".pdf"}
_XLSX_SUFFIXES = {".xlsx", ".xlsm"}
_SKIP_DIR_NAMES = {"__macosx", ".git", ".svn", "node_modules"}
_SKIP_FILE_NAMES = {".ds_store", "thumbs.db", "desktop.ini"}
_SKIP_SUFFIXES = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".ico",
    ".mp4",
    ".mov",
    ".zip",
    ".gz",
    ".tgz",
    ".7z",
    ".exe",
    ".dmg",
    ".gdoc",
    ".gsheet",
    ".gslides",
    ".gdraw",
    ".gform",
    ".gtable",
}

DEFAULT_CHUNK_CHARS = 4000
DEFAULT_CHUNK_OVERLAP = 200


class _HTMLTextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._chunks: list[str] = []
        self._skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "noscript"}:
            self._skip_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript"} and self._skip_depth:
            self._skip_depth -= 1
        if tag in {"p", "div", "br", "li", "h1", "h2", "h3", "h4", "tr"}:
            self._chunks.append("\n")

    def handle_data(self, data: str) -> None:
        if self._skip_depth:
            return
        text = data.strip()
        if text:
            self._chunks.append(text)

    def text(self) -> str:
        return re.sub(r"\n{3,}", "\n\n", " ".join(self._chunks)).strip()


def _stable_point_id(key: str) -> str:
    """Qdrant-compatible UUID derived from a stable content key."""
    digest = hashlib.sha1(key.encode("utf-8")).hexdigest()
    return f"{digest[:8]}-{digest[8:12]}-{digest[12:16]}-{digest[16:20]}-{digest[20:32]}"


def _normalize_whitespace(text: str) -> str:
    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _read_text_bytes(data: bytes, path: Path) -> str:
    for encoding in ("utf-8", "utf-8-sig", "latin-1"):
        try:
            raw = data.decode(encoding)
            break
        except UnicodeDecodeError:
            continue
    else:
        raw = data.decode("utf-8", errors="ignore")
    suffix = path.suffix.lower()
    if suffix in {".html", ".htm"}:
        parser = _HTMLTextExtractor()
        parser.feed(raw)
        return _normalize_whitespace(parser.text())
    return _normalize_whitespace(raw)


def _extract_docx(data: bytes) -> str:
    from docx import Document

    document = Document(io.BytesIO(data))
    parts: list[str] = []
    for paragraph in document.paragraphs:
        text = paragraph.text.strip()
        if text:
            parts.append(text)
    for table in document.tables:
        for row in table.rows:
            cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if cells:
                parts.append(" | ".join(cells))
    return _normalize_whitespace("\n".join(parts))


def _extract_pdf(data: bytes) -> str:
    from pypdf import PdfReader

    reader = PdfReader(io.BytesIO(data))
    parts: list[str] = []
    for page in reader.pages:
        text = (page.extract_text() or "").strip()
        if text:
            parts.append(text)
    return _normalize_whitespace("\n\n".join(parts))


def _extract_xlsx(data: bytes) -> str:
    import pandas as pd

    frames = pd.read_excel(io.BytesIO(data), sheet_name=None, dtype=str, engine="openpyxl")
    parts: list[str] = []
    for sheet_name, frame in frames.items():
        frame = frame.fillna("")
        parts.append(f"# Sheet: {sheet_name}")
        preview = frame.head(200)
        for row in preview.itertuples(index=False, name=None):
            cells = [str(cell).strip() for cell in row if str(cell).strip()]
            if cells:
                parts.append(" | ".join(cells))
    return _normalize_whitespace("\n".join(parts))


def extract_text_from_bytes(data: bytes, path: Path) -> str | None:
    """Return plain text for a Drive-exported file, or None if unsupported/empty."""
    suffix = path.suffix.lower()
    name = path.name.lower()
    if name in _SKIP_FILE_NAMES or suffix in _SKIP_SUFFIXES:
        return None
    try:
        if suffix in _TEXT_SUFFIXES:
            text = _read_text_bytes(data, path)
        elif suffix in _DOCX_SUFFIXES:
            text = _extract_docx(data)
        elif suffix in _PDF_SUFFIXES:
            text = _extract_pdf(data)
        elif suffix in _XLSX_SUFFIXES:
            text = _extract_xlsx(data)
        else:
            return None
    except Exception as exc:  # noqa: BLE001 — skip bad files, continue ingest
        print(f"Skipping {path}: extract failed ({exc})")
        return None
    return text or None


def chunk_text(
    text: str,
    *,
    chunk_chars: int = DEFAULT_CHUNK_CHARS,
    overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> list[str]:
    """Split long documents into overlapping character chunks for embedding."""
    cleaned = _normalize_whitespace(text)
    if not cleaned:
        return []
    if len(cleaned) <= chunk_chars:
        return [cleaned]

    overlap = max(0, min(overlap, chunk_chars // 2))
    chunks: list[str] = []
    start = 0
    length = len(cleaned)
    while start < length:
        end = min(start + chunk_chars, length)
        if end < length:
            window = cleaned[start:end]
            break_at = max(window.rfind("\n\n"), window.rfind("\n"), window.rfind(". "))
            if break_at >= chunk_chars // 2:
                if window[break_at : break_at + 2] == "\n\n":
                    end = start + break_at + 2
                elif window[break_at : break_at + 2] == ". ":
                    end = start + break_at + 2
                else:
                    end = start + break_at + 1
        piece = cleaned[start:end].strip()
        if piece:
            chunks.append(piece)
        if end >= length:
            break
        start = max(end - overlap, start + 1)
    return chunks


def _iter_files(root: Path, *, include_zip: bool = False) -> Iterable[Path]:
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if any(part.lower() in _SKIP_DIR_NAMES for part in path.parts):
            continue
        if path.name.lower() in _SKIP_FILE_NAMES:
            continue
        if not include_zip and path.suffix.lower() == ".zip":
            continue
        yield path


def _chunk_documents(
    *,
    text: str,
    title: str,
    rel_path: str,
    suffix: str,
    source_zip: str,
    point_prefix: str,
) -> list[dict[str, Any]]:
    docs: list[dict[str, Any]] = []
    for chunk_index, chunk in enumerate(chunk_text(text)):
        docs.append(
            {
                "point_key": f"{point_prefix}::{rel_path}::{chunk_index}",
                "embed_text": f"Title: {title}\nPath: {rel_path}\n\n{chunk}",
                "payload": {
                    "source": "google_drive",
                    "source_zip": source_zip,
                    "path": rel_path,
                    "title": title,
                    "suffix": suffix,
                    "chunk_index": chunk_index,
                    "text": chunk,
                },
            }
        )
    return docs


def _documents_from_tree(
    root: Path,
    *,
    source_zip: str,
    relative_to: Path,
    point_prefix: str,
) -> list[dict[str, Any]]:
    docs: list[dict[str, Any]] = []
    for path in _iter_files(root):
        try:
            data = path.read_bytes()
        except OSError as exc:
            print(f"Skipping {path}: read failed ({exc})")
            continue
        text = extract_text_from_bytes(data, path)
        if not text:
            continue
        try:
            rel = str(path.relative_to(relative_to))
        except ValueError:
            rel = path.name
        docs.extend(
            _chunk_documents(
                text=text,
                title=path.stem,
                rel_path=rel,
                suffix=path.suffix.lower(),
                source_zip=source_zip,
                point_prefix=point_prefix,
            )
        )
    return docs


def collect_google_drive_documents(directory: str | Path) -> list[dict[str, Any]]:
    """Scan ``directory`` for Drive zips and loose files; return chunk documents."""
    root = Path(directory).expanduser().resolve()
    if not root.is_dir():
        raise FileNotFoundError(f"Google Drive ingest directory not found: {root}")

    docs: list[dict[str, Any]] = []
    zips = sorted(p for p in root.iterdir() if p.is_file() and p.suffix.lower() == ".zip")
    for zip_path in zips:
        print(f"Extracting {zip_path.name} ...")
        with tempfile.TemporaryDirectory(prefix="gdrive_rag_") as tmp:
            tmp_root = Path(tmp)
            try:
                with zipfile.ZipFile(zip_path, "r") as archive:
                    archive.extractall(tmp_root)
            except zipfile.BadZipFile as exc:
                print(f"Skipping {zip_path.name}: bad zip ({exc})")
                continue
            docs.extend(
                _documents_from_tree(
                    tmp_root,
                    source_zip=zip_path.name,
                    relative_to=tmp_root,
                    point_prefix=zip_path.name,
                )
            )

    # Loose / already-extracted files beside the zips (skip the zip binaries themselves).
    docs.extend(
        _documents_from_tree(
            root,
            source_zip="",
            relative_to=root,
            point_prefix="loose",
        )
    )

    # Deduplicate by point_key (re-running ingest or overlapping loose+zip copies).
    unique = {doc["point_key"]: doc for doc in docs}
    return list(unique.values())


def upload_google_drive(
    directory: str | Path,
    collection_name: str,
    *,
    batch_size: int | None = None,
) -> int:
    """Embed Google Drive downloads under ``directory`` into ``collection_name``.

    ``directory`` should contain the zip file(s) downloaded from Google Drive
    (and optionally already-extracted files). Returns the number of upserted points.
    """
    cfg = get_rag_config().embedding
    size = batch_size or cfg.batch_size
    docs = collect_google_drive_documents(directory)
    ensure_collection(collection_name)
    print(f"Collected {len(docs)} chunks from {directory!s} → collection {collection_name!r}")

    prepared: list[tuple[str, dict[str, Any], str]] = [
        (_stable_point_id(doc["point_key"]), doc["payload"], doc["embed_text"])
        for doc in docs
    ]
    uploaded = 0
    for offset in range(0, len(prepared), size):
        batch = prepared[offset : offset + size]
        try:
            vectors = get_embeddings([text for _, _, text in batch])
        except Exception as exc:  # noqa: BLE001
            print(f"Embedding batch at offset {offset} failed: {exc}")
            continue
        points = [
            qmodels.PointStruct(id=point_id, vector=vector, payload=payload)
            for (point_id, payload, _), vector in zip(batch, vectors, strict=True)
        ]
        try:
            upsert_points(collection_name, points)
            uploaded += len(points)
            print(f"Upserted {uploaded}/{len(prepared)}")
        except Exception as exc:  # noqa: BLE001
            print(f"Upsert failed at offset {offset}: {exc}")
    print(f"Upload complete: {uploaded} points in {collection_name!r}")
    return uploaded

"""Diagrams for the data part of the platform."""

from __future__ import annotations

from docs_site.canvas import TechCanvas
from docs_site.labels import _esc
from docs_site.shapes import (
    ACCENT as _ACCENT,
    ACCENT_B as _ACCENT_B,
    INK as _INK,
    MONO as _MONO,
    MUTED as _MUTED,
    PAPER as _PAPER,
    SANS as _SANS,
    SOFT as _SOFT,
)


def _panel(
    c: TechCanvas,
    x: float,
    y: float,
    w: float,
    h: float,
    title: str,
    rows: tuple[str, ...],
) -> None:
    """A plain side panel: the items that belong to the whole drawing."""
    c.parts.append(
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#ffffff" '
        f'stroke="rgba(0,135,90,0.28)" stroke-width="1.2"/>'
        f'<text x="{x + 20}" y="{y + 30}" font-family="{_SANS}" font-size="13" '
        f'font-weight="600" letter-spacing="0.08em" fill="{_SOFT}">{_esc(title)}</text>'
    )
    for index, row in enumerate(rows):
        c.uml("component", x + 22, y + 50 + index * 62, w - 44, 46, row)


def _rag_flow() -> tuple[str, str]:
    c = TechCanvas(
        "rag",
        1120,
        620,
        "How a question is answered from the knowledge base",
        "A scheduled job fills the index. A question goes out as a vector search and a "
        "keyword search, the results are merged, the best matches are reranked and "
        "duplicates are removed.",
    )
    c.layer(30, 50, 800, 115, "HOW THE INDEX IS FILLED")
    c.uml("cloud", 60, 58, 175, 98, "Your material")
    c.uml("process", 260, 58, 150, 98, "Chunking", "paragraphs become chunks")
    c.uml("process", 430, 58, 160, 98, "Embedding", "meaning and words")
    c.uml("database", 605, 48, 205, 112, "The knowledge index", "Qdrant, on your machine")

    c.layer(30, 200, 800, 120, "YOUR QUESTION")
    c.uml("actor", 52, 208, 74, 92, "You")
    c.uml("queue", 145, 215, 145, 85, "Your question", "the same words")
    c.uml("process", 320, 210, 175, 88, "Vector search", "meaning, not wording")
    c.uml("process", 540, 210, 175, 88, "Keyword search", "the exact terms")

    c.layer(30, 345, 800, 120, "ONE RANKED LIST")
    c.uml("process", 400, 355, 340, 90, "Merge the results", "one list from both searches")

    c.layer(30, 495, 800, 90, "THE BEST MATCHES")
    c.uml("process", 150, 505, 190, 80, "Rerank", "against your question")
    c.uml("process", 370, 505, 170, 80, "Remove duplicates", "one per ticket or model")
    c.uml("note", 570, 505, 260, 80, "The passages the model reads", "grounded in your material")

    c.line(240, 107, 258, 107, accent=True)
    c.line(410, 107, 428, 107, accent=True)
    c.line(590, 107, 603, 107, accent=True)

    # the question goes out two ways at once
    c.line(292, 252, 308, 252, accent=True)
    c.line(308, 225, 308, 280, arrow=False)
    c.path("M308 225 H318", accent=True)
    c.path("M308 280 H318", accent=True)

    # both searches read the index
    c.line(660, 158, 660, 208, accent=True)
    c.path("M607 138 C560 175 470 180 400 206", accent=True)

    c.line(400, 298, 400, 353, accent=True)
    c.line(627, 298, 627, 353, accent=True)
    c.path("M570 447 V470 H245 V503", accent=True)
    c.line(340, 545, 368, 545, accent=True)
    c.line(540, 545, 568, 545, accent=True)

    _panel(
        c,
        850,
        50,
        240,
        290,
        "WHAT IS INDEXED",
        ("Your tickets", "Your dbt models", "Your documents"),
    )
    return (
        c.svg(),
        "A scheduled job fills the index; a question goes out as a vector search and a "
        "keyword search, and the merged, reranked, deduplicated passages reach the model.",
    )


def _tool_errors() -> tuple[str, str]:
    c = TechCanvas(
        "terr",
        1120,
        540,
        "What happens when a tool call fails",
        "A failed call is classified, retried once when the failure looks transient, and "
        "handed back to the agent as a structured result.",
    )
    c.layer(30, 50, 800, 120, "WHEN A TOOL FAILS")
    c.uml("component", 70, 60, 165, 95, "The tool", "reads your data")
    c.uml("note", 265, 60, 150, 95, "The call fails", "an error comes back")
    c.uml("process", 445, 60, 185, 95, "Classify the failure", "the kind of error")
    c.uml("decision", 660, 58, 160, 98, "Worth retrying?", "connection or timeout")

    c.layer(30, 215, 800, 115, "WHAT HAPPENS NEXT")
    c.uml("process", 655, 225, 165, 90, "Try it once more", "one retry only")

    c.layer(30, 370, 800, 115, "WHAT THE AGENT GETS BACK")
    c.uml("note", 60, 380, 280, 95, "A structured result", "type, message, hint")
    c.uml("note", 370, 380, 190, 95, "Another tool to try", "when one exists")
    c.uml("component", 590, 380, 210, 95, "The agent", "it reads it and decides")

    c.line(235, 107, 263, 107, accent=True)
    c.line(415, 107, 443, 107, accent=True)
    c.line(630, 107, 658, 107, accent=True)

    # worth retrying: one more attempt
    c.line(740, 156, 740, 223, accent=True)
    c.label(740, 182, "yes")

    # not worth retrying: straight to the structured result
    c.path("M658 107 C590 190 420 330 284 352", dashed=True)
    c.label(560, 200, "no")

    # the retry fails again: the same structured result
    c.path("M730 317 V345 H284", arrow=False)
    c.line(284, 345, 284, 378, accent=True)

    c.line(340, 427, 368, 427, accent=True)
    c.line(560, 427, 588, 427, accent=True)

    c.pill(40, 515, "If the retry works, the result comes back as usual.")
    _panel(
        c,
        850,
        50,
        240,
        425,
        "THE KINDS OF FAILURE",
        ("Connection", "Timeout", "Syntax", "Not found", "Permission", "Unknown"),
    )
    return (
        c.svg(),
        "A failed call is classified, retried once when it looks transient, and returned "
        "to the agent as a structured result instead of being lost.",
    )


def _evals_run() -> tuple[str, str]:
    c = TechCanvas(
        "ev",
        1120,
        580,
        "An evaluation run",
        "The cases are loaded, each one is run against a model and scored, the suites "
        "are averaged, and the result is compared against the bar.",
    )
    c.layer(30, 50, 800, 110, "LOAD THE CASES")
    c.uml("document", 70, 58, 185, 95, "The cases", "question · context · expectation")
    c.uml("component", 295, 60, 175, 95, "The suites", "named lists of cases")
    c.uml("component", 510, 60, 175, 95, "The specialist", "the agent under test")

    c.layer(30, 195, 800, 120, "RUN AND SCORE EACH CASE")
    c.uml("process", 510, 202, 185, 95, "Run the case", "once per model, on a fresh session")
    c.uml("cloud", 300, 200, 185, 98, "The model", "each model")
    c.uml("process", 70, 202, 185, 95, "Score the run", "tools, rounds, answer")

    c.layer(30, 350, 800, 170, "AVERAGE AND COMPARE")
    c.uml("process", 70, 395, 185, 95, "Average per suite", "every case counts equally")
    c.uml("decision", 295, 392, 180, 100, "Above the bar?", "the bar you set")
    c.uml("note", 520, 365, 200, 72, "The run passes", "clean finish")
    c.uml("note", 520, 450, 200, 72, "The run fails", "it stops there")

    c.line(255, 105, 293, 105, accent=True)
    c.line(470, 105, 508, 105, accent=True)
    c.line(597, 155, 597, 200, accent=True)
    c.line(508, 250, 480, 250, accent=True)
    c.line(345, 250, 259, 250, accent=True)
    c.line(162, 297, 162, 393, accent=True)
    c.line(255, 442, 293, 442, accent=True)
    c.path("M477 436 Q500 401 516 401", accent=True)
    c.path("M477 448 Q500 486 516 486")

    c.pill(40, 555, "The output names every case, so a failure points at one case.")
    _panel(
        c,
        850,
        50,
        240,
        300,
        "THE SUITES",
        ("databot", "knowledge", "intent", "general"),
    )
    return (
        c.svg(),
        "The cases are loaded, each one is run against a model and scored, the suites "
        "are averaged, and the average is compared against the bar.",
    )

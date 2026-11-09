"""Diagrams for the ui part of the platform."""

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


def _agui_chat() -> tuple[str, str]:
    c = TechCanvas(
        "achat",
        1120,
        640,
        "The browser chat",
        "Your message becomes one streaming request. Every event that comes back turns "
        "into a card in the chat, or an update in the panel beside it.",
    )
    c.layer(30, 60, 800, 120, "IN THE BROWSER")
    c.uml("actor", 52, 74, 74, 90, "You")
    c.uml("component", 150, 68, 235, 96, "Chat panel", "your messages, and the tool cards")
    c.uml(
        "component",
        415,
        68,
        235,
        96,
        "Working state panel",
        "tables, draft query, results",
    )

    c.layer(30, 215, 800, 110, "ON THE SERVER")
    c.uml("node", 150, 222, 200, 92, "Next.js", "the web front end")
    c.uml("node", 390, 222, 200, 92, "AG-UI server", "streams the events")
    c.uml("queue", 630, 225, 190, 85, "Event stream", "one event at a time")

    c.layer(30, 360, 800, 115, "THE AGENT")
    c.uml("component", 150, 368, 235, 98, "The databot agent", "asks, calls tools, answers")
    c.uml("component", 415, 368, 190, 98, "Its tools", "read-only by default")
    c.uml("database", 635, 362, 190, 105, "Paused work", "the checkpoint it writes")

    c.layer(30, 510, 800, 90, "WHAT YOU END UP WITH")
    c.uml("note", 150, 518, 235, 74, "The answer", "grounded in your own material")
    c.uml("note", 415, 518, 235, 74, "An error, if it fails", "what went wrong, in the chat")

    c.line(126, 118, 148, 118, accent=True)
    c.line(267, 164, 267, 220, accent=True)
    c.line(364, 280, 388, 280, accent=True)
    c.line(490, 326, 490, 366, accent=True)
    c.line(385, 417, 413, 417)
    c.line(267, 466, 267, 516, accent=True)

    # the event stream travels back up to the browser
    c.path("M700 221 V118 H654", accent=True)
    c.label(772, 140, "the working state")
    c.path("M640 221 C560 195 420 180 334 168", accent=True, dashed=True)
    c.label(600, 190, "each event becomes a card")

    c.pill(40, 620, "Every stream ends with a clear outcome: finished, or failed.")
    return (
        c.svg(),
        "Your message becomes one streaming request; every event that comes back turns "
        "into a card in the chat or an update in the panel beside it.",
    )


def _agui_gate() -> tuple[str, str]:
    c = TechCanvas(
        "agate",
        1120,
        540,
        "An approval in the browser",
        "The agent stops at a gate. The browser shows the question and the options, and "
        "your decision resumes the same stage.",
    )
    c.layer(30, 50, 800, 120, "WHERE THE RUN STOPS")
    c.uml("component", 52, 60, 190, 95, "The agent", "reaches an approval gate")
    c.uml("decision", 280, 58, 175, 100, "The gate", "a decision you must make")
    c.uml("note", 490, 60, 175, 95, "The run ends", "action required, not an answer")

    c.layer(30, 215, 800, 115, "IN THE BROWSER")
    c.uml("actor", 52, 222, 74, 92, "You")
    c.uml("component", 150, 222, 230, 96, "Approval panel", "the question and the options")
    c.uml("component", 490, 222, 195, 96, "The chat banner", "the run needs a decision")

    c.layer(30, 375, 800, 120, "HOW THE RUN CONTINUES")
    c.uml("queue", 150, 388, 190, 85, "Your decision", "posted back to the server")
    c.uml("node", 375, 382, 185, 95, "AG-UI server", "starts a new run")
    c.uml("database", 590, 378, 210, 105, "Paused work", "the checkpoint it picks up")

    c.line(242, 107, 278, 107, accent=True)
    c.line(455, 107, 488, 107, accent=True)
    c.path("M280 108 C268 150 265 180 265 220", dashed=True)
    c.label(180, 190, "the browser is asked")
    c.line(148, 265, 128, 265)
    c.line(265, 318, 265, 386, accent=True)
    c.line(340, 430, 373, 430, accent=True)
    c.line(572, 430, 588, 430, accent=True)

    # the paused stage picks the run up again
    c.path("M467 380 V180 H370 V162", accent=True, dashed=True)
    c.label(420, 342, "it continues")

    c.pill(
        40,
        520,
        "Your decision resumes the paused run exactly where it stopped.",
    )
    _panel(
        c,
        850,
        50,
        240,
        290,
        "WHAT NEEDS APPROVAL",
        ("Which tables to use", "Which query to run", "Anything that would write"),
    )
    return (
        c.svg(),
        "The agent pauses at a gate, the browser shows the question and the options, and "
        "your decision resumes the same stage where it stopped.",
    )


def _agui_action() -> tuple[str, str]:
    c = TechCanvas(
        "aact",
        1120,
        540,
        "Editing a draft before it runs",
        "An edit in the panel is written straight into the paused work. Only the drafts "
        "the current stage owns can be changed.",
    )
    c.layer(30, 50, 800, 120, "IN THE BROWSER")
    c.uml("actor", 52, 60, 74, 92, "You")
    c.uml("component", 150, 58, 290, 96, "The panel", "pick the tables, edit the drafted query")
    c.uml("note", 490, 60, 240, 92, "Not a chat message", "the edit goes straight to the paused work")

    c.layer(30, 215, 800, 120, "HOW THE CHANGE IS APPLIED")
    c.uml("node", 150, 222, 200, 92, "The web front end", "Next.js")
    c.uml("node", 385, 222, 215, 92, "The AG-UI server", "checks the stage")

    c.layer(30, 380, 800, 120, "WHAT HAPPENS NEXT")
    c.uml("note", 150, 388, 190, 96, "The platform refuses", "this stage does not own the draft")
    c.uml("decision", 375, 386, 180, 98, "Allowed here?", "the stage must own it")
    c.uml("component", 590, 388, 240, 96, "The paused work is updated", "your edit goes in place")

    c.line(126, 110, 148, 110, accent=True)
    c.line(440, 106, 488, 106)
    c.line(295, 154, 295, 220, accent=True)
    c.line(364, 280, 383, 280, accent=True)
    c.path("M492 328 V352 H465 V384", accent=True)
    c.line(373, 435, 342, 435)
    c.label(357, 412, "no")
    c.line(555, 435, 588, 435, accent=True)
    c.label(572, 412, "yes")

    c.pill(40, 520, "Only the drafts that belong to the current stage can be edited.")
    _panel(
        c,
        850,
        50,
        240,
        290,
        "WHAT YOU CAN EDIT",
        ("The selected tables", "The drafted query", "Ask for a new draft"),
    )
    return (
        c.svg(),
        "An edit is written straight into the paused work, and only the drafts the "
        "current stage owns can be changed.",
    )

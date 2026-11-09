"""Diagrams for the agents part of the platform."""

from __future__ import annotations

from docs_site.canvas import TechCanvas
from docs_site.shapes import (
    SANS as _SANS,
    SOFT as _SOFT,
)


def _panel(c: TechCanvas, x: float, y: float, w: float, h: float, title: str) -> None:
    """A plain rounded panel for the items that belong to every band."""
    c.parts.append(
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#ffffff" '
        f'stroke="rgba(0,135,90,0.28)" stroke-width="1.2"/>'
        f'<text x="{x + 20}" y="{y + 30}" font-family="{_SANS}" font-size="13" '
        f'font-weight="600" letter-spacing="0.08em" fill="{_SOFT}">{title}</text>'
    )


def _intent_route() -> tuple[str, str]:
    c = TechCanvas(
        "intent",
        1120,
        500,
        "How a question is routed",
        "The routing agent reads your question, publishes one specialist, and asks you "
        "a clarifying question when it is not sure.",
    )
    c.layer(30, 45, 760, 95, "YOU")
    c.uml("actor", 60, 52, 70, 88, "You")
    c.uml("queue", 180, 62, 215, 62, "Your question", "in plain words")

    c.layer(30, 170, 760, 120, "THE ROUTING AGENT")
    c.uml("component", 55, 182, 250, 95, "The routing agent", "intent · reads your question")
    c.uml("decision", 395, 182, 160, 95, "Confident?")

    c.layer(30, 320, 760, 130, "WHAT HAPPENS NEXT")
    c.uml("note", 55, 335, 200, 95, "A clarifying question", "asked instead of guessing")
    c.uml("component", 330, 335, 250, 95, "The chosen specialist", "one specialist answers")
    c.uml("note", 610, 335, 180, 95, "The answer", "in plain words")

    c.line(128, 88, 176, 90, accent=True)
    c.path("M287 126 C287 154 185 152 185 180", accent=True)
    c.line(307, 229, 392, 229, accent=True)

    c.path("M475 279 C475 300 200 296 200 333", accent=True)
    c.label(330, 302, "not sure")
    c.path("M475 279 C475 312 455 306 455 333", accent=True)
    c.label(528, 302, "confident")

    c.path("M100 333 V281", accent=True, dashed=True)
    c.label(152, 305, "you answer")

    c.line(582, 382, 608, 382, accent=True)

    c.path("M557 229 H806", accent=True, dashed=True)
    c.label(681, 211, "publishes one")

    _panel(c, 810, 45, 280, 405, "THE SPECIALISTS")
    for index, (name, sub) in enumerate(
        (
            ("plan", "work that needs several specialists"),
            ("databot", "data questions, answered with SQL"),
            ("knowledge", "what your team already wrote"),
            ("diagnostic", "production triage"),
            ("data_analysis", "analysis and charts"),
            ("swe", "local code and shell"),
        )
    ):
        c.uml("component", 832, 92 + index * 60, 236, 48, name, sub)

    c.pill(40, 485, "One question, one specialist.")
    return (
        c.svg(),
        "The routing agent reads your question and publishes one specialist, or asks "
        "you a clarifying question when it is not sure.",
    )


def _plan_graph() -> tuple[str, str]:
    c = TechCanvas(
        "plan",
        1120,
        660,
        "How a multi-step plan is planned",
        "The plan agent writes the plan, delegates each step to a specialist, adjusts "
        "the plan when the work changes, and closes with a summary.",
    )
    c.layer(30, 45, 760, 95, "YOU")
    c.uml("actor", 60, 52, 70, 88, "You")
    c.uml("queue", 185, 62, 230, 62, "Your question", "that needs several specialists")

    c.layer(30, 175, 760, 125, "THE PLAN AGENT")
    c.uml("component", 60, 187, 250, 95, "The plan agent", "plan · writes the steps")
    c.uml("document", 370, 190, 190, 90, "The plan", "steps and who does each")

    c.layer(30, 340, 760, 150, "ONE STEP AT A TIME")
    c.uml("component", 60, 355, 250, 100, "The step's specialist", "runs on its own")
    c.uml("decision", 370, 355, 180, 100, "Still on track?")
    c.uml("component", 610, 355, 180, 100, "Adjust the plan", "add, skip or rewrite a step")

    c.layer(30, 530, 760, 80, "THE END")
    c.uml("note", 360, 530, 190, 80, "The summary", "one answer for the whole task")

    c.line(130, 88, 182, 90, accent=True)
    c.path("M300 126 C300 154 185 152 185 183", accent=True)
    c.line(312, 234, 368, 234, accent=True)

    c.path("M465 282 C465 318 185 305 185 353", accent=True)
    c.label(250, 320, "step by step")

    c.line(312, 405, 368, 405, accent=True)
    c.line(552, 405, 598, 405, accent=True)
    c.label(558, 428, "changed")

    c.path("M700 458 C700 482 185 482 185 458", accent=True, dashed=True)
    c.label(442, 476, "the plan changes")

    c.path("M460 457 C460 495 455 495 455 528", accent=True)
    c.label(520, 512, "the plan is done")

    _panel(c, 810, 45, 280, 565, "WHAT EACH STEP GETS")
    for index, (title, sub) in enumerate(
        (
            ("Its own tools", "only what that step needs"),
            ("Its own conversation", "the step's own history"),
            ("Its own budget", "a fresh allowance each time"),
        )
    ):
        c.uml("component", 832, 92 + index * 80, 236, 60, title, sub)
    c.uml(
        "note",
        832,
        350,
        236,
        100,
        "Steps stay apart",
        "one step never sees the others",
    )

    c.pill(40, 645, "A step never sees another step's history.")
    return (
        c.svg(),
        "The plan agent writes the plan, delegates each step to a specialist, adjusts "
        "the plan when the work changes, and closes with a summary.",
    )


def _databot_flow() -> tuple[str, str]:
    c = TechCanvas(
        "dbflow",
        1120,
        590,
        "The stages of a data question",
        "Five stages: find the models, review them, draft the query, review it, then "
        "run it. Two of the stages stop and wait for you.",
    )
    c.layer(30, 45, 760, 150, "FINDING THE MODELS")
    c.uml("component", 60, 70, 225, 100, "Find the models", "looks for the models that fit")
    c.uml("document", 330, 70, 190, 100, "The selected models", "the candidates it found")
    c.uml("decision", 560, 68, 215, 102, "Review the models", "you approve or send back")

    c.layer(30, 225, 760, 150, "WRITING AND RUNNING THE QUERY")
    c.uml("component", 60, 250, 225, 100, "Draft the query", "the agent writes the SQL")
    c.uml("document", 330, 250, 190, 100, "The drafted query", "and why it looks that way")
    c.uml("decision", 560, 248, 215, 102, "Review the query", "approve, or ask again")

    c.layer(30, 405, 760, 150, "RUNNING THE QUERY")
    c.uml("component", 60, 430, 225, 100, "Run the query", "read-only, with a row limit")
    c.uml("cloud", 330, 430, 190, 100, "Trino", "your warehouse")
    c.uml("note", 560, 430, 215, 100, "The answer", "what the agent tells you")

    c.line(287, 120, 328, 120, accent=True)
    c.line(522, 120, 558, 120, accent=True)
    c.path("M667 172 C667 210 172 200 172 248", accent=True)
    c.label(400, 208, "approved")

    c.line(287, 300, 328, 300, accent=True)
    c.line(522, 300, 558, 300, accent=True)
    c.path("M667 352 C667 390 172 380 172 428", accent=True)
    c.label(400, 388, "approved")

    c.line(287, 480, 328, 480, accent=True)
    c.line(522, 480, 558, 480, accent=True)

    _panel(c, 810, 45, 280, 510, "WHAT IT READS")
    c.uml("cloud", 832, 95, 236, 96, "Catalog", "the models you own")
    c.uml("database", 832, 205, 236, 96, "The knowledge base", "your notes and tickets")
    c.uml("cloud", 832, 315, 236, 96, "Metadata", "what your tables contain")
    c.uml("note", 832, 425, 236, 90, "Everything is read-only", "your data is never changed")

    c.pill(40, 575, "Nothing reaches the warehouse before both gates are approved.")
    return (
        c.svg(),
        "A data question moves through five stages, and two of them stop and wait for "
        "you before anything reaches the warehouse.",
    )


def _databot_gates() -> tuple[str, str]:
    c = TechCanvas(
        "dbgates",
        1120,
        565,
        "What happens at a gate",
        "At a gate you can approve, send the stage back with comments, stop, or "
        "preview it, and a rejection repeats only that stage.",
    )
    c.layer(30, 45, 760, 115, "WHAT YOU REVIEW")
    c.uml("process", 60, 62, 235, 85, "The stage's work", "models, or a drafted query")
    c.uml("document", 340, 62, 190, 85, "What you see", "before it goes on")
    c.uml("decision", 580, 58, 195, 95, "Your decision", "waits for you")

    c.layer(30, 225, 760, 135, "YOUR FOUR ANSWERS")
    c.uml("process", 60, 245, 150, 85, "Approve", "move on to the next stage")
    c.uml("process", 240, 245, 130, 85, "Stop", "end the turn here")
    c.uml("process", 400, 245, 145, 85, "Preview", "nothing is kept")
    c.uml("process", 575, 245, 200, 85, "Send back with comments", "redo this stage with your notes")

    c.layer(30, 395, 760, 135, "WHAT HAPPENS NEXT")
    c.uml("note", 60, 405, 150, 85, "Stage confirmed", "the pipeline moves on")
    c.uml("note", 240, 405, 130, 85, "The turn ends", "nothing is kept")
    c.uml("note", 400, 405, 145, 85, "Preview only", "nothing is written")
    c.uml("note", 575, 405, 200, 85, "The stage is repeated", "with your comments attached")

    c.line(297, 105, 338, 105, accent=True)
    c.line(532, 105, 578, 105, accent=True)

    c.path("M677 155 V173", accent=True)
    c.line(135, 175, 678, 175, accent=True, arrow=False)
    for column in (135, 305, 472, 675):
        c.line(column, 175, column, 243, accent=True)

    c.line(135, 332, 135, 403, accent=True)
    c.line(305, 332, 305, 403, accent=True)
    c.line(472, 332, 472, 403, accent=True)
    c.line(675, 332, 675, 403, accent=True)

    c.path("M675 492 V512 H42 V105 H58", accent=True, dashed=True)
    c.label(350, 512, "sent back to the same stage")

    _panel(c, 810, 45, 280, 485, "AT BOTH GATES")
    c.uml("component", 832, 92, 236, 48, "Review the models", "after the models are chosen")
    c.uml("component", 832, 152, 236, 48, "Review the query", "after the query is drafted")
    c.uml("note", 832, 225, 236, 100, "The same four answers", "at both gates")

    c.pill(40, 550, "A rejection repeats one stage, not the whole flow.")
    return (
        c.svg(),
        "At a gate you can approve, send the stage back with comments, stop, or "
        "preview it, and a rejection repeats only that stage.",
    )

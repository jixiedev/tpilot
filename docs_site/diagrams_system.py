"""Diagrams for the system part of the platform."""

from __future__ import annotations

from docs_site.canvas import TechCanvas
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


def _system() -> tuple[str, str]:
    c = TechCanvas(
        "sys",
        1120,
        620,
        "TahoePilot system",
        "The terminal and the browser reach the same agent catalog. The catalog binds the "
        "run loop, the tools, memory and knowledge; configuration, local storage and your own "
        "data platform sit underneath.",
    )
    c.layer(30, 45, 800, 100, "CLIENTS")
    c.uml("node", 60, 60, 180, 72, "Terminal", "the command line")
    c.uml("node", 280, 60, 180, 72, "Browser", "the web UI")

    c.layer(30, 165, 800, 100, "TRANSPORT")
    c.uml("process", 60, 175, 180, 72, "Direct call", "in the same process")
    c.uml("node", 280, 175, 180, 72, "AG-UI server", "streams events")

    c.layer(30, 285, 800, 140, "THE AGENT")
    c.uml("component", 60, 295, 230, 90, "Agent catalog", "holds every agent")
    c.uml("component", 310, 295, 115, 90, "Orchestration", "the run loop")
    c.uml("component", 440, 295, 115, 90, "Tools", "read-only")
    c.uml("component", 570, 295, 115, 90, "Memory", "keeps context")
    c.uml("component", 700, 295, 115, 90, "Knowledge", "your material")

    c.layer(30, 445, 800, 120, "WHAT IT READS AND KEEPS")
    c.uml("document", 60, 468, 170, 80, "Configuration", "prompts · budgets")
    c.uml("database", 245, 468, 170, 80, "Local storage", "checkpoints · archives")
    c.uml("database", 430, 468, 170, 80, "Knowledge index", "tickets · models")
    c.uml("cloud", 615, 468, 170, 80, "Your data platform", "warehouse · cluster")

    c.line(150, 132, 150, 175, accent=True)
    c.line(370, 132, 370, 175, accent=True)
    c.line(150, 247, 150, 295, accent=True)
    c.path("M370 247 C370 272 250 272 220 295", accent=True)
    c.line(290, 340, 310, 340, accent=True)
    c.line(150, 385, 150, 468, accent=True)

    c.parts.append(
        f'<rect x="850" y="45" width="240" height="520" rx="10" fill="#ffffff" '
        f'stroke="rgba(0,135,90,0.28)" stroke-width="1.2"/>'
        f'<text x="870" y="75" font-family="{_SANS}" font-size="13" font-weight="600" '
        f'letter-spacing="0.08em" fill="{_SOFT}">THE SPECIALISTS</text>'
    )
    for index, name in enumerate(
        ("intent", "plan", "databot", "knowledge", "diagnostic", "data_analysis", "swe")
    ):
        row_y = 100 + index * 62
        c.uml("component", 872, row_y, 196, 46, name)
    return (
        c.svg(),
        "Two ways in, one agent catalog. The specialists hang off the catalog, and "
        "configuration, local storage and your own data platform sit underneath.",
    )


def _turn_cli() -> tuple[str, str]:
    c = TechCanvas(
        "tcli",
        1120,
        540,
        "One turn in the terminal",
        "The agent is built once. Every question is accepted, worked on, committed, and "
        "answered in the terminal.",
    )
    c.layer(30, 45, 790, 100, "THE AGENT IS BUILT ONCE")
    c.layer(30, 175, 790, 120, "IN THE TERMINAL")
    c.layer(30, 325, 790, 120, "ONE TURN")

    c.uml("component", 55, 58, 250, 76, "Agent catalog", "binds tools, memory and prompts")
    c.uml("component", 350, 58, 230, 76, "Your agent", "the specialist you chose")
    c.line(305, 96, 348, 96, accent=True)

    c.uml("actor", 50, 190, 90, 95, "You")
    c.uml("node", 175, 190, 215, 78, "Terminal", "the command line")
    c.uml("queue", 435, 196, 195, 70, "Your question", "typed at the prompt")
    c.uml("note", 655, 196, 160, 70, "Your answer", "printed in the terminal")
    c.line(112, 232, 173, 232, accent=True)
    c.line(402, 228, 433, 228, accent=True)

    c.uml("process", 55, 340, 175, 92, "Accept", "question and history")
    c.uml("process", 265, 340, 175, 92, "Act", "the model runs tools")
    c.uml("process", 475, 340, 175, 92, "Commit", "saves the turn")
    c.line(230, 386, 263, 386, accent=True)
    c.line(440, 386, 473, 386, accent=True)

    # the terminal runs the agent that was built for it
    c.path("M465 134 V158 H282 V188", accent=True)

    # the question travels down into the turn, the answer comes back up
    c.path("M532 266 V310 H142 V338", accent=True)
    c.path("M563 340 V300 H735 V268", accent=True)

    c.pill(30, 480, "If a tool needs your approval, the terminal asks before it goes on.")

    # the stores every turn reads and writes
    c.parts.append(
        f'<rect x="845" y="45" width="245" height="400" rx="10" fill="#ffffff" '
        f'stroke="rgba(0,135,90,0.28)" stroke-width="1.2"/>'
        f'<text x="865" y="75" font-family="{_SANS}" font-size="13" font-weight="600" '
        f'letter-spacing="0.08em" fill="{_SOFT}">WHAT THE TURN TOUCHES</text>'
    )
    c.uml("database", 865, 95, 205, 70, "Session history", "what you asked before")
    c.uml("database", 865, 185, 205, 70, "Your profile", "what we know about you")
    c.uml("database", 865, 275, 205, 70, "Checkpoints", "where the turn is saved")
    c.path("M865 130 H835 M865 220 H835 M865 310 H835", dashed=True, arrow=False)
    c.path("M835 130 V386 H652", accent=True, dashed=True)
    c.label(735, 372, "the turn saves here")
    return (
        c.svg(),
        "One turn in the terminal: the agent is built once, then every question is "
        "accepted, worked on, committed and answered.",
    )


def _turn_browser() -> tuple[str, str]:
    c = TechCanvas(
        "tbw",
        1120,
        600,
        "One turn in the browser",
        "The chat panel sends the question to the server, the server runs the agent, "
        "and the events stream back while the turn runs.",
    )
    c.layer(30, 45, 790, 120, "IN THE BROWSER")
    c.layer(30, 190, 790, 110, "THE SERVER")
    c.layer(30, 335, 790, 115, "THE AGENT")
    c.layer(30, 470, 790, 100, "WHEN THE TURN PAUSES")

    c.uml("actor", 55, 55, 88, 98, "You")
    c.uml("node", 175, 60, 235, 78, "Web app", "Next.js, the chat panel")
    c.uml("note", 455, 64, 210, 72, "The answer", "shown in the chat")
    c.line(112, 100, 173, 100, accent=True)
    c.line(424, 100, 453, 100, accent=True)

    c.uml("node", 55, 205, 250, 78, "Chat endpoint", "Next.js forwards the request")
    c.uml("node", 350, 205, 255, 78, "AG-UI server", "runs the agent, streams events")
    c.uml("queue", 640, 210, 175, 66, "Event stream", "tool calls and results")
    c.line(317, 248, 348, 248, accent=True)
    c.line(617, 245, 636, 245, accent=True)

    c.uml("component", 55, 350, 245, 86, "Agent catalog", "binds tools and memory")
    c.uml("component", 335, 350, 225, 86, "Your agent", "databot, on LangGraph")
    c.line(300, 393, 333, 393, accent=True)

    c.uml("decision", 55, 485, 200, 80, "Needs approval?", "the tool waits")
    c.uml("note", 300, 485, 220, 80, "You approve or reject", "the turn carries on")

    # the request goes down, the events come back
    c.path("M295 150 V178 H180 V203", accent=True)
    c.path("M472 295 V322 H447 V348", accent=True)
    c.path("M727 210 V145 H424", accent=True, dashed=True)
    c.label(560, 145, "the events stream back", accent=True)

    # the approval asks the person, the answer goes back to the agent
    c.path("M447 436 V460 H155 V483", accent=True)
    c.path("M520 525 H545 V438", accent=True, dashed=True)
    c.line(257, 525, 298, 525, accent=True)

    # the stores the browser shares with the terminal
    c.parts.append(
        f'<rect x="845" y="45" width="245" height="355" rx="10" fill="#ffffff" '
        f'stroke="rgba(0,135,90,0.28)" stroke-width="1.2"/>'
        f'<text x="865" y="75" font-family="{_SANS}" font-size="13" font-weight="600" '
        f'letter-spacing="0.08em" fill="{_SOFT}">SHARED WITH THE TERMINAL</text>'
    )
    c.uml("database", 865, 95, 205, 70, "Checkpoints", "where a paused turn waits")
    c.uml("database", 865, 185, 205, 70, "Your profile", "what we know about you")
    c.uml("database", 865, 275, 205, 70, "Session history", "what you asked before")
    c.path("M865 130 H835 M865 220 H835 M865 310 H835", dashed=True, arrow=False)
    c.path("M835 130 V393 H562", accent=True, dashed=True)
    c.label(700, 379, "the same agent runs in both")
    return (
        c.svg(),
        "One turn in the browser: the chat panel asks the server, the server runs the "
        "agent, and the events stream back while the turn is still going.",
    )


def _turn_lifecycle() -> tuple[str, str]:
    c = TechCanvas(
        "life",
        1120,
        590,
        "The life of one turn",
        "The agent is built once. Each turn accepts the question, runs, commits, and "
        "prints the answer. Cancelling skips the commit.",
    )
    c.layer(30, 45, 790, 100, "STEP 1 · THE AGENT IS BUILT ONCE")
    c.layer(30, 175, 790, 100, "STEP 2 · YOUR QUESTION IS ACCEPTED")
    c.layer(30, 305, 790, 110, "STEP 3 · THE AGENT WORKS")
    c.layer(30, 445, 790, 110, "STEP 4 · THE TURN IS COMMITTED")

    c.uml("component", 55, 58, 250, 76, "Agent catalog", "binds tools, memory and prompts")
    c.uml("component", 350, 58, 230, 76, "Your agent", "the specialist you chose")
    c.line(305, 96, 348, 96, accent=True)

    c.uml("queue", 55, 192, 190, 68, "Your question", "typed in the terminal")
    c.uml("process", 285, 190, 250, 72, "Accept", "history, profile and session")
    c.line(245, 226, 283, 226, accent=True)

    # the agent that was built accepts the question
    c.path("M465 134 V160 H410 V188", accent=True)

    c.uml("process", 55, 320, 250, 76, "Run the turn", "the model decides, the tools act")
    c.uml("decision", 360, 315, 150, 96, "Cancel?", "you stop it")
    c.uml("note", 600, 320, 190, 76, "Nothing is saved", "the commit is skipped")
    c.line(305, 358, 358, 358, accent=True)
    c.path("M512 358 H598", accent=True, dashed=True)

    c.uml("process", 55, 460, 250, 76, "Commit", "saves the checkpoint and your profile")
    c.uml("note", 365, 460, 240, 76, "Your answer", "printed in the terminal")
    c.line(305, 498, 363, 498, accent=True)

    # the turn carries on unless you cancel it
    c.path("M435 411 V432 H180 V458", accent=True)
    c.label(300, 424, "it carries on")

    c.pill(30, 578, "Cancelling skips the commit, so nothing about this turn is remembered.")

    # the stores the turn reads and writes
    c.parts.append(
        f'<rect x="845" y="45" width="245" height="305" rx="10" fill="#ffffff" '
        f'stroke="rgba(0,135,90,0.28)" stroke-width="1.2"/>'
        f'<text x="865" y="75" font-family="{_SANS}" font-size="13" font-weight="600" '
        f'letter-spacing="0.08em" fill="{_SOFT}">WHAT THE TURN USES</text>'
    )
    c.uml("database", 865, 95, 205, 66, "Session history", "earlier questions")
    c.uml("database", 865, 180, 205, 66, "Your profile", "what we know about you")
    c.uml("database", 865, 265, 205, 66, "Checkpoints", "where the turn is saved")
    c.path("M865 128 H835 M865 213 H835 M865 298 H835", dashed=True, arrow=False)
    c.path("M835 128 V226 H537", accent=True, dashed=True)
    c.label(690, 212, "it starts from these")
    return (
        c.svg(),
        "The life of one turn: build the agent once, then accept, run, commit and answer "
        "— and cancelling skips the commit.",
    )


def _react_loop() -> tuple[str, str]:
    c = TechCanvas(
        "react",
        1120,
        600,
        "The reasoning loop",
        "The model reads the turn and decides. If it wants tools they run and it looks "
        "again; if it has the answer the turn ends.",
    )
    c.layer(30, 45, 790, 100, "THE TURN STARTS")
    c.layer(30, 175, 790, 115, "THE MODEL DECIDES")
    c.layer(30, 320, 790, 115, "THE TOOLS ACT")
    c.layer(30, 465, 790, 95, "THE TURN ENDS")

    c.uml("queue", 55, 58, 205, 74, "Your question", "the turn begins")
    c.uml("process", 300, 58, 235, 74, "Compress", "the context is folded, before and after")
    c.line(260, 95, 298, 95, accent=True)

    c.uml("component", 55, 190, 235, 86, "Reason", "the model reads and decides")
    c.uml("decision", 330, 185, 190, 96, "Tools or answer?", "what it wants to do")
    c.line(290, 233, 328, 233, accent=True)

    c.uml("component", 330, 335, 190, 86, "Act", "the tools run")
    c.uml("queue", 55, 340, 225, 76, "Tool results", "the tools answer back")
    c.path("M425 281 V333", accent=True)
    c.label(425, 307, "it wants tools", accent=True)
    c.line(328, 378, 282, 378, accent=True)
    c.path("M167 340 V276", accent=True)
    c.label(167, 308, "the model looks again", accent=True)
    c.path("M330 132 V158 H167 V188", accent=True)

    c.uml("note", 540, 478, 250, 78, "The answer", "the model's reply")
    c.uml("note", 55, 478, 250, 78, "The turn stops", "the stage is complete")
    c.path("M522 233 H665 V476", accent=True)
    c.label(600, 233, "it has the answer", accent=True)
    c.path("M180 416 V476", accent=True, dashed=True)

    # what the loop works with
    c.parts.append(
        f'<rect x="845" y="45" width="245" height="335" rx="10" fill="#ffffff" '
        f'stroke="rgba(0,135,90,0.28)" stroke-width="1.2"/>'
        f'<text x="865" y="75" font-family="{_SANS}" font-size="13" font-weight="600" '
        f'letter-spacing="0.08em" fill="{_SOFT}">WHAT THE LOOP WORKS WITH</text>'
    )
    c.uml("database", 865, 95, 205, 66, "Session history", "older messages")
    c.uml("database", 865, 180, 205, 66, "Checkpoints", "saved as it goes")
    c.uml("component", 865, 265, 205, 66, "Tools", "what it may call")
    c.path("M865 128 H835 M865 213 H835 M865 298 H835", dashed=True, arrow=False)
    c.path("M835 128 V378 H522", accent=True, dashed=True)
    c.label(680, 364, "it reads and saves")
    return (
        c.svg(),
        "The reasoning loop: the model decides, the tools act, and the model looks at "
        "the result and decides again until the turn ends.",
    )

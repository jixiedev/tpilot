"""Diagrams for the memory part of the platform."""

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
    title: str,
    y: float = 45,
    h: float = 505,
    x: float = 850,
    w: float = 240,
) -> None:
    """A plain side panel on the right, with a heading."""
    c.parts.append(
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#ffffff" '
        f'stroke="rgba(0,135,90,0.28)" stroke-width="1.2"/>'
        f'<text x="{x + 20}" y="{y + 30}" font-family="{_SANS}" font-size="13" '
        f'font-weight="600" letter-spacing="0.08em" fill="{_SOFT}">{_esc(title)}</text>'
    )


def _heading(c: TechCanvas, x: float, y: float, text: str) -> None:
    """A small caption that names the list beside it."""
    c.parts.append(
        f'<text x="{x}" y="{y}" font-family="{_SANS}" font-size="11" font-weight="600" '
        f'letter-spacing="0.1em" fill="{_SOFT}">{_esc(text)}</text>'
    )


def _compressor() -> tuple[str, str]:
    c = TechCanvas(
        "comp",
        1120,
        600,
        "The compressor",
        "When the window fills up, content leaves it in four steps, cheapest first: "
        "offload big results, fold old turns, evict write inputs, and only then ask the "
        "model to summarize. Every copy is written to disk before anything is removed.",
    )
    c.layer(30, 45, 800, 505, "THE WINDOW NARROWS")

    # the funnel: the window itself is smaller at every step
    funnel = (
        (60, 460, 410, "The window is full", "everything in play right now"),
        (146, 410, 360, "Room appears", "the big results moved out"),
        (232, 360, 310, "Less to carry", "the old turns are folded away"),
        (318, 310, 260, "Only the essentials", "the write inputs are gone"),
        (404, 260, 260, "Room again", "the window is usable"),
    )
    for y, top, bottom, title, sub in funnel:
        c.band(270, y, top, bottom, 86, title, sub)

    # the four steps, cheapest first
    steps = (
        (74, "Offload the big results", "a disk write instead of the payload"),
        (160, "Fold the old turns", "your questions and the answers you saw"),
        (246, "Evict the write inputs", "the write has already happened"),
        (332, "Summarize", "the model — the last resort"),
    )
    for y, title, sub in steps:
        c.uml("process", 520, y, 290, 58, title, sub)
    for y in (132, 218, 304):
        c.line(665, y, 665, y + 26, accent=True)

    c.uml("note", 520, 420, 290, 96, "What stays", "a summary and the recent turns")
    c.line(665, 390, 665, 418, accent=True)
    c.pill(60, 522, "a copy first, always")

    _panel(c, "ON DISK", 45, 505)
    c.uml("database", 868, 105, 200, 150, "The archive", "every copy, written first")
    c.uml("note", 868, 285, 200, 96, "The model is last", "only when nothing cheaper worked")
    c.uml("note", 868, 405, 200, 96, "Old files are pruned", "after a set number of days")

    # every step writes its copy out before the content leaves the window
    for cy, ey in ((103, 130), (189, 165), (275, 200), (361, 235)):
        c.path(f"M812 {cy} C840 {cy} 844 {ey} 866 {ey}", accent=True, dashed=True)
    return (
        c.svg(),
        "The window narrows in four steps, cheapest first. The model is only asked to "
        "summarize when nothing cheaper was enough.",
    )


def _memory_layout() -> tuple[str, str]:
    c = TechCanvas(
        "memlay",
        1120,
        600,
        "What the platform keeps",
        "A window holds what is in play right now: the instructions, your profile, the "
        "recent turns and the newest tool results. Everything that leaves the window is "
        "written to disk first, in one of four stores.",
    )
    c.layer(30, 45, 800, 195, "IN PLAY RIGHT NOW")
    c.window(
        60,
        68,
        740,
        155,
        "the window",
        (
            ("instructions", 0.18, "#e8f8f0"),
            ("your profile", 0.16, "#dcf7ea"),
            ("recent turns", 0.28, "#f2fbf7"),
            ("tool results", 0.38, "#ffffff"),
        ),
    )

    c.layer(30, 265, 800, 195, "WHERE EVERYTHING ELSE GOES")
    c.uml("database", 60, 305, 175, 125, "Offload store", "large tool results")
    c.uml("database", 250, 305, 175, 125, "The archive", "what leaves the window")
    c.uml("database", 440, 305, 175, 125, "Profile store", "one record per person")
    c.uml("database", 630, 305, 175, 125, "Session checkpoints", "a session survives a restart")

    c.line(140, 225, 140, 300, accent=True)
    c.line(330, 225, 330, 300, accent=True)
    c.label(330, 252, "written here first")
    c.path("M527 225 V300", accent=True, dashed=True)
    c.line(717, 225, 717, 300, accent=True)

    _panel(c, "THE RULES", 45, 515)
    c.uml("note", 868, 90, 200, 96, "Nothing leaves unwritten", "the archive is written first")
    c.uml("note", 868, 210, 200, 96, "Big results move out early", "a pointer stays in place")
    c.uml("note", 868, 330, 200, 96, "Old turns are folded", "the shape of it is kept")
    c.pill(868, 460, "the window is finite")
    c.pill(868, 500, "nothing is lost")
    return (
        c.svg(),
        "What is in play, and where everything else goes. Nothing is removed from the "
        "conversation before a copy of it is on disk.",
    )


def _profile_store() -> tuple[str, str]:
    c = TechCanvas(
        "prof",
        1120,
        580,
        "What is remembered about you",
        "A profile is a small record per person: who you are, what you may read, and how "
        "you like answers. It is refined after every turn and written through to disk.",
    )
    c.layer(30, 45, 800, 210, "ONE RECORD PER PERSON")
    c.uml(
        "document",
        60,
        70,
        240,
        150,
        "Your profile",
        "what we learn about you",
        tag="one record per person",
    )
    _heading(c, 340, 92, "WHAT IT HOLDS")
    for index, text in enumerate(
        (
            "your role and team",
            "the tables you may read",
            "the columns you may not see",
            "your language and currency",
        )
    ):
        c.pill(340, 125 + index * 34, text)

    c.layer(30, 290, 800, 215, "HOW THE RECORD MOVES")
    c.uml("process", 60, 320, 190, 66, "Load it once a session", "at the start of a session")
    c.uml("process", 280, 320, 190, 66, "Refine after every turn", "what we learned is merged in")
    c.uml("database", 500, 310, 230, 125, "Profile store", "one file per person")

    c.path("M180 222 C180 272 155 282 155 316", accent=True)
    c.label(140, 275, "loaded once a session")
    c.line(252, 353, 278, 353, accent=True)
    c.line(472, 353, 498, 353, accent=True)
    c.label(485, 275, "written through")
    c.path("M375 318 C375 268 250 276 250 224", accent=True, dashed=True)
    c.label(345, 275, "merged in")

    c.line(615, 435, 615, 452, accent=True)
    c.filechip(495, 454, 94, 32, "person one")
    c.filechip(600, 454, 94, 32, "person two")
    c.filechip(705, 454, 94, 32, "person three")

    _panel(c, "WHY IT MATTERS", 45, 495)
    c.uml("note", 868, 90, 200, 96, "One profile per person", "not one per session")
    c.uml("note", 868, 210, 200, 96, "Changes apply next time", "a session keeps its start")
    c.uml("note", 868, 330, 200, 96, "Forget it any time", "delete the file and it is gone")
    c.pill(868, 470, "you never repeat yourself")
    return (
        c.svg(),
        "A profile is a small record per person. It is refined after every turn and kept on "
        "disk, one file per person.",
    )


def _session_layout() -> tuple[str, str]:
    c = TechCanvas(
        "sess",
        1120,
        620,
        "One session over time",
        "A session is a conversation. Each turn is answered, approved and then saved, so a "
        "later turn — or a later process — can pick up where the last one stopped.",
    )
    c.layer(30, 45, 800, 360, "ONE TURN")
    c.uml("actor", 60, 90, 100, 115, "You")
    c.uml("process", 200, 75, 230, 62, "You ask a question", "the turn begins")
    c.uml("process", 200, 155, 230, 62, "The agent works", "one step at a time")
    c.uml("decision", 200, 235, 230, 70, "Do you approve?", "the gate waits for you")
    c.uml("process", 200, 325, 230, 62, "The answer comes back", "plain text, same session")
    c.uml("database", 500, 90, 240, 120, "Session checkpoints", "one per session")

    c.path("M125 118 C155 118 165 104 198 104", accent=True)
    c.path("M125 145 C165 205 170 250 198 265", accent=True, dashed=True)
    c.label(140, 212, "you approve")
    c.line(315, 137, 315, 153, accent=True)
    c.line(315, 217, 315, 233, accent=True)
    c.line(315, 305, 315, 323, accent=True)
    c.path("M432 186 C462 186 462 145 498 145", accent=True)
    c.label(465, 162, "saved")

    c.layer(30, 440, 800, 140, "AND LATER")
    c.uml("process", 200, 465, 230, 62, "You ask again", "the session resumes")
    c.path("M620 212 V425 H315 V463", accent=True, dashed=True)
    c.label(470, 415, "the session resumes")
    c.path("M198 496 H150 C118 496 118 132 190 128", accent=True, dashed=True)
    c.label(120, 330, "the same session")

    _panel(c, "ABOUT A SESSION", 45, 535)
    c.uml("note", 868, 90, 200, 96, "One conversation", "with its own history")
    c.uml("note", 868, 210, 200, 96, "Saved as it happens", "not only at the end")
    c.uml("note", 868, 330, 200, 96, "A restart continues", "from the last checkpoint")
    c.pill(868, 460, "name it and come back")
    return (
        c.svg(),
        "A session is one conversation. Every turn is saved, so the next question — or the "
        "next process — continues rather than starts again.",
    )


def _state_layout() -> tuple[str, str]:
    c = TechCanvas(
        "statelay",
        1120,
        580,
        "The state that travels through a turn",
        "One record carries a turn: the conversation so far, which step we are on, the "
        "counters, the plan and what we know about you. It is saved after every step.",
    )
    c.layer(30, 45, 800, 215, "THE RECORD")
    c.uml(
        "document",
        60,
        68,
        280,
        160,
        "The turn record",
        "what every step sees",
        tag="one record per turn",
    )
    _heading(c, 380, 92, "WHAT IT CARRIES")
    for index, text in enumerate(
        (
            "the conversation so far",
            "which step we are on",
            "the counters: calls and rounds",
            "the plan and its steps",
            "what we know about you",
        )
    ):
        c.pill(380, 125 + index * 28, text)

    c.layer(30, 290, 800, 180, "READ AND WRITTEN BACK")
    c.uml("process", 60, 330, 200, 68, "A step runs", "it reads the record")
    c.uml("process", 300, 330, 200, 68, "The step finishes", "the record changes")
    c.uml("database", 560, 320, 230, 115, "The checkpoint", "the record, saved")

    c.path("M200 230 C200 282 150 288 150 328", accent=True)
    c.label(172, 288, "reads")
    c.line(262, 364, 298, 364, accent=True)
    c.line(502, 364, 558, 364, accent=True)
    c.label(530, 340, "writes")
    c.path("M655 318 C655 288 420 296 300 230", accent=True, dashed=True)
    c.label(500, 292, "loaded again")

    _panel(c, "WHY IT IS SAVED", 45, 495)
    c.uml("note", 868, 90, 200, 96, "One record per turn", "the same one all the way")
    c.uml("note", 868, 210, 200, 96, "The step decides", "what happens next is read from it")
    c.uml("note", 868, 330, 200, 96, "Never only in memory", "it is saved after every step")
    c.pill(868, 470, "a restart resumes the turn")
    return (
        c.svg(),
        "One record travels through a turn: the conversation, the current step, the counters, "
        "the plan and the profile. It is saved after every step.",
    )


def _config_shape() -> tuple[str, str]:
    c = TechCanvas(
        "cfg",
        1120,
        620,
        "Configuration shape",
        "A base layer, a team layer, and one file per agent. Each agent file sets the prompt, "
        "run limits, tool set and accepted servers; the surrounding files hold connections, "
        "tool groups, the knowledge base, local paths, models and logging.",
    )
    c.layer(30, 45, 800, 140, "THE LAYERS EVERY AGENT INHERITS")
    c.uml("component", 60, 70, 230, 90, "Shared defaults", "the rules every agent follows")
    c.uml("component", 330, 70, 230, 90, "Team defaults", "what your team shares")
    c.uml("document", 600, 70, 210, 90, "One file per agent", "databot · knowledge · swe")
    c.line(292, 115, 328, 115, accent=True)
    c.label(310, 58, "inherits")
    c.line(562, 115, 598, 115, accent=True)
    c.label(580, 58, "inherits and overrides")

    c.layer(30, 225, 800, 115, "WHAT AN AGENT SETS")
    c.line(705, 162, 705, 244, accent=True)
    c.label(555, 205, "one file sets all of these")
    c.line(108, 248, 748, 248, accent=True, arrow=False)
    for index, (title, sub) in enumerate(
        (
            ("Instructions", "how the agent talks"),
            ("Run limits", "turn length"),
            ("Context budgets", "what is kept"),
            ("Tool set", "what it may call"),
            ("Accepted servers", "servers it trusts"),
            ("Step prompts", "how a step begins"),
        )
    ):
        x = 50 + index * 128
        c.uml("process", x, 256, 116, 64, title, sub)
        c.line(x + 58, 248, x + 58, 256, accent=True, arrow=False)

    c.layer(30, 405, 800, 180, "THE REST OF THE SETTINGS")
    for index, (title, sub) in enumerate(
        (
            ("Connections", "warehouse"),
            ("Tool groups", "shared tools"),
            ("Knowledge", "what is indexed"),
            ("Local paths", "where files live"),
            ("Models", "which model"),
            ("Logging", "how much it says"),
        )
    ):
        c.uml("document", 50 + index * 130, 440, 120, 80, title, sub)
    c.pill(50, 550, "read at startup, never inherited")

    _panel(c, "HOW OVERRIDES WORK", 45, 540)
    c.uml("note", 868, 90, 200, 96, "Each part inherits alone", "one change moves no other")
    c.uml("note", 868, 210, 200, 96, "The agent wins", "where it replaces a setting")
    c.uml("note", 868, 330, 200, 96, "Nothing is inherited here", "these are read at startup")
    c.pill(868, 470, "change it, restart, done")
    return (
        c.svg(),
        "Configuration is layered: shared defaults, then one file per agent. The surrounding "
        "files hold connections, models and paths, and are read at startup rather than inherited.",
    )

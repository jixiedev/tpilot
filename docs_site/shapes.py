"""UML-style shapes for the documentation diagrams.

Every element is drawn with the notation that matches its role, the way a UML
deployment or component diagram would:

============  ==========================================================
Shape         Used for
============  ==========================================================
component     A piece of the platform: an agent, the catalog, the router
node          A running service: the terminal, the browser, the AG-UI server
database      Something that is stored: checkpoints, indexes, archives
decision      A choice, and the human gates that wait for an answer
actor         The person using the platform
queue         Something in flight: a request, a stream of events
process       One step of a flow
note          The outcome: an answer, an error, a summary
document      A file: a settings file, an evaluation case
cloud         Something outside the platform: a warehouse, a catalog, an
              external tool server
============  ==========================================================

The palette is the Tahoe green already used by the site.
"""

from __future__ import annotations

from docs_site.labels import _esc

INK = "#0b1220"
MUTED = "#334155"
SOFT = "#5f6f80"
ACCENT = "#00875a"
ACCENT_B = "#00a165"
PAPER = "#ffffff"
LANE = "#f2fbf7"
END = "#eef2f7"
SANS = "Outfit, ui-sans-serif, system-ui, sans-serif"
MONO = "JetBrains Mono, ui-monospace, monospace"

BLUE = "#dbe9f7"
BLUE_LINE = "#15467d"
SHADE = "#c7dcf0"

FILLS = {
    "component": (PAPER, INK),
    "node": (BLUE, BLUE_LINE),
    "database": ("#ecfdf5", ACCENT_B),
    "decision": ("#fff8e1", "#b45309"),
    "actor": (PAPER, INK),
    "queue": (LANE, ACCENT),
    "process": (PAPER, INK),
    "note": (END, MUTED),
    "document": (PAPER, INK),
    "cloud": ("#eef4fb", BLUE_LINE),
}


def _label(x: float, y: float, w: float, h: float, title: str, sub: str = "",
           tag: str = "", *, size: float = 14, mono: bool = False) -> str:
    """Title and optional subtitle, centred in the given box."""
    family = MONO if mono else SANS
    cx = x + w / 2
    cy = y + h / 2 + (0 if not sub else -6)
    out = [
        f'<text x="{cx}" y="{cy}" text-anchor="middle" font-family="{family}" '
        f'font-size="{size}" font-weight="600" fill="{INK}">{_esc(title)}</text>'
    ]
    if sub:
        out.append(
            f'<text x="{cx}" y="{cy + 17}" text-anchor="middle" font-family="{SANS}" '
            f'font-size="10.5" fill="{SOFT}">{_esc(sub)}</text>'
        )
    if tag:
        tw = min(max(len(tag) * 6.4 + 14, 48), w - 30)
        out.append(
            f'<rect x="{x + 12}" y="{y + 8}" width="{tw}" height="13" rx="2" fill="{PAPER}" '
            f'stroke="rgba(0,135,90,0.40)" stroke-width="0.8"/>'
            f'<text x="{x + 12 + tw / 2}" y="{y + 18}" text-anchor="middle" '
            f'font-family="{SANS}" font-size="8.5" font-weight="600" letter-spacing="0.05em" '
            f'fill="{MUTED}">{_esc(tag)}</text>'
        )
    return "".join(out)


def component(x: float, y: float, w: float, h: float, title: str, sub: str = "",
              tag: str = "") -> str:
    """A replaceable part of the platform: two tabs on the left edge."""
    body = (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="{PAPER}" '
        f'stroke="{INK}" stroke-width="1.4"/>'
        f'<rect x="{x - 9}" y="{y + 10}" width="9" height="{h * 0.22:.0f}" rx="2" '
        f'fill="{PAPER}" stroke="{INK}" stroke-width="1.4"/>'
        f'<rect x="{x - 9}" y="{y + h * 0.58:.0f}" width="9" height="{h * 0.22:.0f}" rx="2" '
        f'fill="{PAPER}" stroke="{INK}" stroke-width="1.4"/>'
    )
    return body + _label(x, y, w, h, title, sub, tag)


def node(x: float, y: float, w: float, h: float, title: str, sub: str = "",
         tag: str = "") -> str:
    """A running machine: the classic three-dimensional server box."""
    d = 12
    body = (
        f'<path d="M{x} {y + d} L{x + d} {y} H{x + w + d} L{x + w} {y + d} Z" '
        f'fill="{SHADE}" stroke="{BLUE_LINE}" stroke-width="1.4"/>'
        f'<path d="M{x + w} {y + d} L{x + w + d} {y} V{y + h} L{x + w} {y + h + d} Z" '
        f'fill="{SHADE}" stroke="{BLUE_LINE}" stroke-width="1.4"/>'
        f'<rect x="{x}" y="{y + d}" width="{w}" height="{h}" rx="3" fill="{BLUE}" '
        f'stroke="{BLUE_LINE}" stroke-width="1.4"/>'
    )
    return body + _label(x, y + d, w, h, title, sub, tag, size=13.5)


def database(x: float, y: float, w: float, h: float, title: str, sub: str = "",
             tag: str = "") -> str:
    """A stored thing: checkpoints, an index, an archive."""
    ry = 15
    body = (
        f'<path d="M{x} {y + ry} V{y + h - ry} A{w / 2} {ry} 0 0 0 {x + w} {y + h - ry} '
        f'V{y + ry}" fill="#ecfdf5" stroke="none"/>'
        f'<path d="M{x} {y + h - ry} A{w / 2} {ry} 0 0 0 {x + w} {y + h - ry}" fill="none" '
        f'stroke="{ACCENT_B}" stroke-width="1.4"/>'
        f'<line x1="{x}" y1="{y + ry}" x2="{x}" y2="{y + h - ry}" stroke="{ACCENT_B}" '
        f'stroke-width="1.4"/>'
        f'<line x1="{x + w}" y1="{y + ry}" x2="{x + w}" y2="{y + h - ry}" stroke="{ACCENT_B}" '
        f'stroke-width="1.4"/>'
        f'<ellipse cx="{x + w / 2}" cy="{y + ry}" rx="{w / 2}" ry="{ry}" fill="#f4fbf8" '
        f'stroke="{ACCENT_B}" stroke-width="1.4"/>'
    )
    return body + _label(x, y + ry * 1.4, w, h - ry * 2.6, title, sub, tag, size=13.5)


def decision(x: float, y: float, w: float, h: float, title: str, sub: str = "",
             tag: str = "") -> str:
    """A choice, or a gate that waits for a person."""
    cx, cy = x + w / 2, y + h / 2
    body = (
        f'<path d="M{cx} {y} L{x + w} {cy} L{cx} {y + h} L{x} {cy} Z" fill="#fff8e1" '
        f'stroke="#b45309" stroke-width="1.5"/>'
    )
    return body + _label(x + w * 0.18, y, w * 0.64, h, title, sub, tag, size=12.5)


def actor(x: float, y: float, w: float, h: float, title: str, sub: str = "",
          tag: str = "") -> str:
    """A person."""
    cx = x + w / 2
    head_y = y + 12
    s = f'stroke="{INK}" stroke-width="1.8" stroke-linecap="round" fill="none"'
    body = (
        f'<circle cx="{cx}" cy="{head_y}" r="8" fill="{PAPER}" stroke="{INK}" stroke-width="1.8"/>'
        f'<path d="M{cx} {head_y + 8} V{head_y + 34}" {s}/>'
        f'<path d="M{cx - 13} {head_y + 16} H{cx + 13}" {s}/>'
        f'<path d="M{cx} {head_y + 34} L{cx - 11} {head_y + 52}" {s}/>'
        f'<path d="M{cx} {head_y + 34} L{cx + 11} {head_y + 52}" {s}/>'
    )
    return body + _label(x, y + h - 26, w, 26, title, sub, tag, size=12.5)


def queue(x: float, y: float, w: float, h: float, title: str, sub: str = "",
          tag: str = "") -> str:
    """Something in flight: a request, a stream of events."""
    tip = 16
    body = (
        f'<path d="M{x} {y} H{x + w - tip} L{x + w} {y + h / 2} L{x + w - tip} {y + h} '
        f'H{x} Z" fill="{LANE}" stroke="{ACCENT}" stroke-width="1.4"/>'
    )
    return body + _label(x, y, w - tip, h, title, sub, tag, size=12.5)


def process(x: float, y: float, w: float, h: float, title: str, sub: str = "",
            tag: str = "") -> str:
    """One step of a flow."""
    body = (
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="9" fill="{PAPER}" '
        f'stroke="{INK}" stroke-width="1.4"/>'
    )
    return body + _label(x, y, w, h, title, sub, tag, size=13)


def note(x: float, y: float, w: float, h: float, title: str, sub: str = "",
         tag: str = "") -> str:
    """The outcome of something: an answer, an error, a summary."""
    fold = 15
    body = (
        f'<path d="M{x} {y} H{x + w - fold} L{x + w} {y + fold} V{y + h} H{x} Z" '
        f'fill="{END}" stroke="{MUTED}" stroke-width="1.3"/>'
        f'<path d="M{x + w - fold} {y} V{y + fold} H{x + w}" fill="none" stroke="{MUTED}" '
        f'stroke-width="1.3"/>'
    )
    return body + _label(x + 6, y + 6, w - 12, h - 12, title, sub, tag, size=13)


def document(x: float, y: float, w: float, h: float, title: str, sub: str = "",
             tag: str = "") -> str:
    """A file: a settings file, an evaluation case."""
    wave, bump = 12, 12
    path = [f'M{x} {y} H{x + w} V{y + h - wave}']
    cursor = x + w
    while cursor - bump > x:
        cursor -= bump
        path.append(f'q{-bump / 2} {wave} {-bump} 0')
    path.append(f'L{x} {y + h - wave} Z')
    body = (
        f'<path d="{" ".join(path)}" fill="{PAPER}" stroke="{INK}" stroke-width="1.4"/>'
    )
    return body + _label(x + 8, y, w - 16, h - wave, title, sub, tag, size=13)


def cloud(x: float, y: float, w: float, h: float, title: str, sub: str = "",
          tag: str = "") -> str:
    """Something outside the platform: a warehouse, a catalog, an external server."""
    body = (
        f'<path d="M{x + w * 0.26} {y + h} a{w * 0.17} {h * 0.30} 0 0 1 '
        f'{w * 0.02} -{h * 0.42} a{w * 0.24} {h * 0.36} 0 0 1 {w * 0.44} -{h * 0.14} '
        f'a{w * 0.20} {h * 0.28} 0 0 1 {w * 0.30} {h * 0.56} Z" fill="#eef4fb" '
        f'stroke="{BLUE_LINE}" stroke-width="1.4"/>'
    )
    return body + _label(x + w * 0.08, y + h * 0.34, w * 0.84, h * 0.66, title, sub, tag,
                          size=12.5)


SHAPES = {
    "component": component,
    "node": node,
    "database": database,
    "decision": decision,
    "actor": actor,
    "queue": queue,
    "process": process,
    "note": note,
    "document": document,
    "cloud": cloud,
}


def shape(kind: str, x: float, y: float, w: float, h: float, title: str, sub: str = "",
          tag: str = "") -> str:
    """Draw one element with the notation that matches its role."""
    try:
        draw = SHAPES[kind]
    except KeyError:
        raise ValueError(f"unknown shape: {kind}") from None
    return draw(x, y, w, h, title, sub, tag)

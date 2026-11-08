"""The drawing canvas for the documentation diagrams.

A thin SVG helper: it paints a grid, a HUD frame, connectors and a set of
UML-style elements. See :mod:`docs_site.shapes` for the element notation.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from docs_site.labels import _esc
from docs_site.shapes import (
    ACCENT as _ACCENT,
    ACCENT_B as _ACCENT_B,
    END as _END,
    INK as _INK,
    LANE as _LANE,
    MONO as _MONO,
    MUTED as _MUTED,
    PAPER as _PAPER,
    SANS as _SANS,
    SOFT as _SOFT,
    shape,
)

_GATE = "#dcf7ea"

@dataclass
class TechCanvas:
    """Owns one HUD drawing: grid, painted nodes, lanes, and connectors."""

    diagram_id: str
    width: int
    height: int
    title: str
    desc: str
    parts: list[str] = field(default_factory=list)

    def lane(self, x: float, y: float, w: float, h: float, label: str) -> None:
        self.parts.append(
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{_LANE}" '
            f'stroke="rgba(0,135,90,0.28)"/>'
            f'<path d="M{x + 10} {y + 18} V{y + 8} H{x + 20}" fill="none" '
            f'stroke="{_ACCENT_B}" stroke-width="1.3"/>'
            f'<path d="M{x + w - 10} {y + 18} V{y + 8} H{x + w - 20}" fill="none" '
            f'stroke="{_ACCENT_B}" stroke-width="1.3"/>'
            f'<text x="{x + 16}" y="{y + 24}" font-family="{_SANS}" font-size="11" '
            f'font-weight="600" letter-spacing="0.14em" fill="{_SOFT}">{_esc(label)}</text>'
        )

    def node(
        self,
        x: float,
        y: float,
        w: float,
        h: float,
        title: str,
        sub: str = "",
        tag: str = "",
        kind: str = "node",
        *,
        icon: str = "",
    ) -> None:
        fill, stroke, sw = {
            "node": (_PAPER, _INK, 1.4),
            "gate": (_GATE, _ACCENT, 1.5),
            "entry": (_PAPER, _ACCENT, 1.5),
            "store": ("#ecfdf5", _ACCENT_B, 1.4),
            "end": (_END, _MUTED, 1.2),
            "done": ("rgba(0,135,90,0.13)", _ACCENT, 1.6),
        }[kind]
        i = self.diagram_id
        cx, title_y = x + w / 2, y + (30 if tag else 26)
        glyph = icon or kind
        body = [
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="{sw}" filter="url(#{i}-lift)"/>',
            f'<rect x="{x + 1}" y="{y + 1}" width="{w - 2}" height="10" rx="7" '
            f'fill="rgba(255,255,255,0.45)"/>',
            f'<rect x="{x}" y="{y}" width="4" height="{h}" rx="2" fill="{_ACCENT_B}"/>',
            _hud_ticks(x, y, w, h),
            _glyph(glyph, x + w - 24, y + 8, stroke),
        ]
        if tag:
            tw = min(max(len(tag) * 6.6 + 16, 52), w - 42)
            body.append(
                f'<rect x="{x + 14}" y="{y + 10}" width="{tw}" height="14" rx="2" fill="{_PAPER}" '
                f'stroke="rgba(0,135,90,0.40)" stroke-width="0.8"/>'
                f'<text x="{x + 14 + tw / 2}" y="{y + 21}" text-anchor="middle" '
                f'font-family="{_SANS}" font-size="9" font-weight="600" letter-spacing="0.05em" '
                f'fill="{_MUTED}">{_esc(tag)}</text>'
            )
            title_y = y + 44
        body.append(
            f'<text x="{cx}" y="{title_y}" text-anchor="middle" font-family="{_SANS}" '
            f'font-size="15" font-weight="600" fill="{_INK}">{_esc(title)}</text>'
        )
        if sub:
            body.append(
                f'<text x="{cx}" y="{title_y + 18}" text-anchor="middle" font-family="{_MONO}" '
                f'font-size="11" fill="{_SOFT}">{_esc(sub)}</text>'
            )
        self.parts.append("".join(body))

    def pill(self, x: float, y: float, label: str, accent: bool = False) -> None:
        fill = _ACCENT if accent else _MUTED
        self.parts.append(
            f'<circle cx="{x}" cy="{y}" r="7" fill="{fill}"/>'
            f'<circle cx="{x}" cy="{y}" r="3.2" fill="{_PAPER}"/>'
            f'<text x="{x + 14}" y="{y + 4}" font-family="{_SANS}" font-size="12" '
            f'font-weight="500" fill="{_MUTED}">{_esc(label)}</text>'
        )

    def line(
        self,
        x1: float,
        y1: float,
        x2: float,
        y2: float,
        *,
        accent: bool = False,
        dashed: bool = False,
        arrow: bool = True,
    ) -> None:
        i = self.diagram_id
        color = _ACCENT_B if accent else _MUTED
        marker = f"url(#{i}-arr-a)" if accent else f"url(#{i}-arr)"
        dash = ' stroke-dasharray="5,4"' if dashed else ""
        end = f' marker-end="{marker}"' if arrow else ""
        self.parts.append(
            f'<circle cx="{x1}" cy="{y1}" r="2.4" fill="{color}"/>'
            f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" '
            f'stroke-width="1.6"{dash}{end}/>'
        )

    def path(
        self,
        d: str,
        *,
        accent: bool = False,
        dashed: bool = False,
        arrow: bool = True,
    ) -> None:
        i = self.diagram_id
        color = _ACCENT_B if accent else _MUTED
        marker = f"url(#{i}-arr-a)" if accent else f"url(#{i}-arr)"
        dash = ' stroke-dasharray="5,4"' if dashed else ""
        end = f' marker-end="{marker}"' if arrow else ""
        self.parts.append(
            f'<path d="{d}" fill="none" stroke="{color}" stroke-width="1.6"{dash}{end}/>'
        )

    def label(self, x: float, y: float, text: str, *, accent: bool = False) -> None:
        color = _ACCENT if accent else _MUTED
        tw = max(len(text) * 6.4 + 12, 28)
        self.parts.append(
            f'<rect x="{x - tw / 2}" y="{y - 12}" width="{tw}" height="16" rx="3" '
            f'fill="#f7fbf9" stroke="rgba(0,135,90,0.22)"/>'
            f'<text x="{x}" y="{y}" text-anchor="middle" font-family="{_SANS}" '
            f'font-size="11" font-weight="500" letter-spacing="0.06em" fill="{color}">'
            f"{_esc(text)}</text>"
        )

    def caption_row(self, y: float, items: tuple[tuple[str, str], ...]) -> None:
        x = 40
        self.parts.append(
            f'<line x1="32" y1="{y - 18}" x2="{self.width - 32}" y2="{y - 18}" '
            f'stroke="rgba(0,135,90,0.28)"/>'
        )
        for kind, text in items:
            fill, stroke = {
                "node": (_PAPER, _INK),
                "gate": (_GATE, _ACCENT),
                "store": ("#ecfdf5", _ACCENT_B),
                "done": ("rgba(0,135,90,0.13)", _ACCENT),
                "end": (_END, _MUTED),
            }[kind]
            self.parts.append(
                f'<rect x="{x}" y="{y - 10}" width="16" height="12" rx="2" fill="{fill}" '
                f'stroke="{stroke}" stroke-width="1.3"/>'
                f'<text x="{x + 22}" y="{y}" font-family="{_SANS}" font-size="12" '
                f'fill="{_MUTED}">{_esc(text)}</text>'
            )
            x += 22 + len(text) * 6.6 + 22

    def cylinder(
        self,
        x: float,
        y: float,
        w: float,
        h: float,
        title: str,
        sub: str = "",
        *,
        fill: str = "#ecfdf5",
        stroke: str = _ACCENT_B,
    ) -> None:
        """A storage drum: something that lives on disk."""
        ry = 15
        body = [
            f'<path d="M{x} {y + ry} V{y + h - ry} A{w / 2} {ry} 0 0 0 {x + w} {y + h - ry} '
            f'V{y + ry}" fill="{fill}" stroke="none"/>',
            f'<path d="M{x} {y + h - ry} A{w / 2} {ry} 0 0 0 {x + w} {y + h - ry}" fill="none" '
            f'stroke="{stroke}" stroke-width="1.4"/>',
            f'<line x1="{x}" y1="{y + ry}" x2="{x}" y2="{y + h - ry}" stroke="{stroke}" '
            f'stroke-width="1.4"/>',
            f'<line x1="{x + w}" y1="{y + ry}" x2="{x + w}" y2="{y + h - ry}" stroke="{stroke}" '
            f'stroke-width="1.4"/>',
            f'<ellipse cx="{x + w / 2}" cy="{y + ry}" rx="{w / 2}" ry="{ry}" fill="#f4fbf8" '
            f'stroke="{stroke}" stroke-width="1.4"/>',
        ]
        cy = y + h / 2 + 4
        body.append(
            f'<text x="{x + w / 2}" y="{cy}" text-anchor="middle" font-family="{_SANS}" '
            f'font-size="14" font-weight="600" fill="{_INK}">{_esc(title)}</text>'
        )
        if sub:
            body.append(
                f'<text x="{x + w / 2}" y="{cy + 17}" text-anchor="middle" '
                f'font-family="{_MONO}" font-size="10.5" fill="{_SOFT}">{_esc(sub)}</text>'
            )
        self.parts.append("".join(body))

    def sheet(
        self,
        x: float,
        y: float,
        w: float,
        h: float,
        title: str,
        rows: tuple[tuple[str, str], ...],
        *,
        tag: str = "",
    ) -> None:
        """A document: a thing with named fields."""
        fold = 16
        body = [
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{_PAPER}" '
            f'stroke="{_INK}" stroke-width="1.4" filter="url(#{self.diagram_id}-lift)"/>',
            f'<path d="M{x + w - fold} {y} V{y + fold} H{x + w}" fill="none" '
            f'stroke="{_INK}" stroke-width="1.4"/>',
            f'<path d="M{x + w - fold} {y} L{x + w - fold} {y + fold} L{x + w} {y + fold}" '
            f'fill="#eef2f7" stroke="{_INK}" stroke-width="1.4"/>',
        ]
        head = y + 26
        if tag:
            body.append(
                f'<rect x="{x + 16}" y="{head - 12}" width="{max(len(tag) * 6.6 + 14, 44)}" '
                f'height="14" rx="2" fill="#f2fbf7" stroke="rgba(0,135,90,0.40)" '
                f'stroke-width="0.8"/>'
                f'<text x="{x + 16 + max(len(tag) * 6.6 + 14, 44) / 2}" y="{head - 1}" '
                f'text-anchor="middle" font-family="{_SANS}" font-size="9" font-weight="600" '
                f'letter-spacing="0.05em" fill="{_MUTED}">{_esc(tag)}</text>'
            )
            head += 22
        body.append(
            f'<text x="{x + 16}" y="{head}" font-family="{_SANS}" font-size="15" '
            f'font-weight="600" fill="{_INK}">{_esc(title)}</text>'
        )
        row_y = head + 22
        for label, value in rows:
            body.append(
                f'<line x1="{x + 16}" y1="{row_y - 4}" x2="{x + w - 16}" y2="{row_y - 4}" '
                f'stroke="rgba(15,23,42,0.08)" stroke-width="1"/>'
                f'<text x="{x + 16}" y="{row_y + 10}" font-family="{_MONO}" font-size="10.5" '
                f'fill="{_SOFT}">{_esc(label)}</text>'
                f'<text x="{x + 128}" y="{row_y + 10}" font-family="{_SANS}" font-size="11" '
                f'fill="{_INK}">{_esc(value)}</text>'
            )
            row_y += 19
        self.parts.append("".join(body))

    def stack(
        self,
        x: float,
        y: float,
        w: float,
        h: float,
        title: str,
        sub: str = "",
        *,
        sheets: int = 3,
    ) -> None:
        """A stack of cards: one thing per person, per session, per record."""
        for offset in range(sheets - 1, 0, -1):
            dx, dy = offset * 11, offset * -11
            self.parts.append(
                f'<rect x="{x + dx}" y="{y + dy}" width="{w}" height="{h}" rx="8" '
                f'fill="#f7fbf9" stroke="rgba(0,135,90,0.30)" stroke-width="1.2"/>'
            )
        body = [
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{_PAPER}" '
            f'stroke="{_ACCENT_B}" stroke-width="1.5" filter="url(#{self.diagram_id}-lift)"/>',
            f'<rect x="{x}" y="{y}" width="4" height="{h}" rx="2" fill="{_ACCENT_B}"/>',
        ]
        cy = y + h / 2 + 4
        body.append(
            f'<text x="{x + w / 2}" y="{cy}" text-anchor="middle" font-family="{_SANS}" '
            f'font-size="14" font-weight="600" fill="{_INK}">{_esc(title)}</text>'
        )
        if sub:
            body.append(
                f'<text x="{x + w / 2}" y="{cy + 17}" text-anchor="middle" '
                f'font-family="{_MONO}" font-size="10.5" fill="{_SOFT}">{_esc(sub)}</text>'
            )
        self.parts.append("".join(body))

    def window(
        self,
        x: float,
        y: float,
        w: float,
        h: float,
        title: str,
        segments: tuple[tuple[str, float, str], ...],
    ) -> None:
        """A framed window holding a bar of segments: what is in play right now."""
        body = [
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{_PAPER}" '
            f'stroke="{_INK}" stroke-width="1.6" filter="url(#{self.diagram_id}-lift)"/>',
            f'<rect x="{x}" y="{y}" width="{w}" height="34" rx="12" fill="#f2fbf7"/>',
            f'<rect x="{x}" y="{y + 22}" width="{w}" height="12" fill="#f2fbf7"/>',
            f'<line x1="{x}" y1="{y + 34}" x2="{x + w}" y2="{y + 34}" '
            f'stroke="rgba(0,135,90,0.28)" stroke-width="1.2"/>',
            f'<circle cx="{x + 20}" cy="{y + 17}" r="4" fill="rgba(0,135,90,0.35)"/>',
            f'<circle cx="{x + 34}" cy="{y + 17}" r="4" fill="rgba(0,135,90,0.22)"/>',
            f'<text x="{x + 52}" y="{y + 22}" font-family="{_SANS}" font-size="12" '
            f'font-weight="600" fill="{_MUTED}">{_esc(title)}</text>',
        ]
        bar_x, bar_y = x + 18, y + h - 62
        bar_w = w - 36
        # a few conversation lines, oldest ones fading out
        lines = ((0.52, 0.10), (0.38, 0.08), (0.60, 0.055), (0.28, 0.035))
        for index, (share, alpha) in enumerate(lines):
            row_y = y + 52 + index * 17
            if row_y + 9 > bar_y - 10:
                break
            body.append(
                f'<circle cx="{bar_x + 5}" cy="{row_y + 4.5}" r="4.5" '
                f'fill="rgba(0,135,90,{alpha + 0.06:.3f})"/>'
                f'<rect x="{bar_x + 16}" y="{row_y}" width="{bar_w * share}" height="9" rx="4.5" '
                f'fill="rgba(15,23,42,{alpha:.3f})"/>'
            )
        cursor = bar_x
        for label, share, colour in segments:
            seg_w = bar_w * share
            body.append(
                f'<rect x="{cursor}" y="{bar_y}" width="{seg_w}" height="30" rx="4" '
                f'fill="{colour}" stroke="rgba(0,135,90,0.30)" stroke-width="1"/>'
                f'<text x="{cursor + seg_w / 2}" y="{bar_y + 19}" text-anchor="middle" '
                f'font-family="{_SANS}" font-size="10.5" fill="{_INK}">{_esc(label)}</text>'
            )
            cursor += seg_w
        body.append(
            f'<text x="{bar_x}" y="{bar_y + 48}" font-family="{_SANS}" font-size="10.5" '
            f'fill="{_SOFT}">{_esc("older messages fade out first")}</text>'
        )
        self.parts.append("".join(body))

    def beat(self, x: float, y: float, title: str, sub: str = "", *, accent: bool = False) -> None:
        """A point on a timeline: text, no box."""
        colour = _ACCENT if accent else _MUTED
        self.parts.append(
            f'<circle cx="{x}" cy="{y}" r="5.5" fill="{colour}"/>'
            f'<circle cx="{x}" cy="{y}" r="2" fill="{_PAPER}"/>'
            f'<text x="{x + 16}" y="{y + 4}" font-family="{_SANS}" font-size="13" '
            f'font-weight="600" fill="{_INK}">{_esc(title)}</text>'
        )
        if sub:
            self.parts.append(
                f'<text x="{x + 16}" y="{y + 21}" font-family="{_SANS}" font-size="11" '
                f'fill="{_SOFT}">{_esc(sub)}</text>'
            )

    def band(
        self,
        cx: float,
        y: float,
        w_top: float,
        w_bottom: float,
        h: float,
        title: str,
        sub: str = "",
        *,
        fill: str = "#f2fbf7",
        stroke: str = "rgba(0,135,90,0.30)",
    ) -> None:
        """A tapering band: one step of something that narrows."""
        tl, tr = cx - w_top / 2, cx + w_top / 2
        bl, br = cx - w_bottom / 2, cx + w_bottom / 2
        body = [
            f'<path d="M{tl} {y} H{tr} L{br} {y + h} H{bl} Z" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="1.3"/>'
        ]
        cy = y + h / 2 + 4
        body.append(
            f'<text x="{cx}" y="{cy}" text-anchor="middle" font-family="{_SANS}" '
            f'font-size="14" font-weight="600" fill="{_INK}">{_esc(title)}</text>'
        )
        if sub:
            body.append(
                f'<text x="{cx}" y="{cy + 17}" text-anchor="middle" font-family="{_SANS}" '
                f'font-size="11" fill="{_SOFT}">{_esc(sub)}</text>'
            )
        self.parts.append("".join(body))

    def filechip(self, x: float, y: float, w: float, h: float, name: str) -> None:
        """One file on disk."""
        fold = 11
        self.parts.append(
            f'<path d="M{x} {y} H{x + w - fold} L{x + w} {y + fold} V{y + h} H{x} Z" '
            f'fill="{_PAPER}" stroke="{_ACCENT_B}" stroke-width="1.3"/>'
            f'<path d="M{x + w - fold} {y} V{y + fold} H{x + w}" fill="#eef2f7" '
            f'stroke="{_ACCENT_B}" stroke-width="1.3"/>'
            f'<text x="{x + 12}" y="{y + h / 2 + 4}" font-family="{_MONO}" font-size="11" '
            f'fill="{_INK}">{_esc(name)}</text>'
        )

    def uml(
        self,
        kind: str,
        x: float,
        y: float,
        w: float,
        h: float,
        title: str,
        sub: str = "",
        tag: str = "",
    ) -> None:
        """Draw one element with the notation that matches its role."""
        self.parts.append(shape(kind, x, y, w, h, title, sub, tag))

    def layer(
        self,
        x: float,
        y: float,
        w: float,
        h: float,
        label: str,
        *,
        fill: str = "#ffffff",
    ) -> None:
        """A horizontal band, labelled on the right: one layer of the system."""
        self.parts.append(
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" '
            f'stroke="rgba(0,135,90,0.28)" stroke-width="1.2"/>'
            f'<text x="{x + w}" y="{y - 10}" text-anchor="end" '
            f'font-family="{_SANS}" font-size="12" font-weight="600" '
            f'letter-spacing="0.1em" fill="{_SOFT}">{_esc(label)}</text>'
        )

    def svg(self) -> str:
        i = self.diagram_id
        w, h = self.width, self.height
        hud = (
            f'<path d="M24 40 V28 H36" fill="none" stroke="{_ACCENT_B}" stroke-width="1.6"/>'
            f'<path d="M{w - 24} 40 V28 H{w - 36}" fill="none" stroke="{_ACCENT_B}" stroke-width="1.6"/>'
            f'<path d="M24 {h - 40} V{h - 28} H36" fill="none" stroke="{_ACCENT_B}" stroke-width="1.6"/>'
            f'<path d="M{w - 24} {h - 40} V{h - 28} H{w - 36}" fill="none" '
            f'stroke="{_ACCENT_B}" stroke-width="1.6"/>'
        )
        traces = (
            f'<path d="M80 {h * 0.18} C220 {h * 0.08} 380 {h * 0.28} 520 {h * 0.16}" '
            f'fill="none" stroke="rgba(0,161,101,0.16)" stroke-width="1.2"/>'
            f'<path d="M{w - 90} {h * 0.72} C{w - 260} {h * 0.82} {w - 420} {h * 0.58} '
            f'{w - 620} {h * 0.78}" fill="none" stroke="rgba(0,161,101,0.14)" stroke-width="1.2"/>'
        )
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'role="img" aria-labelledby="{i}-t {i}-d">'
            f'<title id="{i}-t">{_esc(self.title)}</title>'
            f'<desc id="{i}-d">{_esc(self.desc)}</desc>'
            f"<defs>"
            f'<pattern id="{i}-grid" width="24" height="24" patternUnits="userSpaceOnUse">'
            f'<path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(0,135,90,0.08)" stroke-width="1"/>'
            f"</pattern>"
            f'<radialGradient id="{i}-glow" cx="50%" cy="38%" r="70%">'
            f'<stop offset="0%" stop-color="rgba(0,161,101,0.10)"/>'
            f'<stop offset="100%" stop-color="rgba(247,251,249,0)"/>'
            f"</radialGradient>"
            f'<filter id="{i}-lift" x="-8%" y="-8%" width="116%" height="116%">'
            f'<feDropShadow dx="0" dy="1.4" stdDeviation="1.6" flood-color="#0b1220" '
            f'flood-opacity="0.12"/>'
            f"</filter>"
            f'<marker id="{i}-arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">'
            f'<polygon points="0 0, 8 3, 0 6" fill="{_MUTED}"/></marker>'
            f'<marker id="{i}-arr-a" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">'
            f'<polygon points="0 0, 8 3, 0 6" fill="{_ACCENT_B}"/></marker>'
            f"</defs>"
            f'<rect width="100%" height="100%" fill="#f7fbf9"/>'
            f'<rect width="100%" height="100%" fill="url(#{i}-grid)"/>'
            f'<rect width="100%" height="100%" fill="url(#{i}-glow)"/>'
            f"{traces}"
            f"{hud}"
            f"{''.join(self.parts)}"
            f"</svg>"
        )


def _hud_ticks(x: float, y: float, w: float, h: float) -> str:
    color = "rgba(0,161,101,0.55)"
    return (
        f'<path d="M{x + 7} {y + 14} V{y + 5} H{x + 13}" fill="none" stroke="{color}" stroke-width="1.2"/>'
        f'<path d="M{x + w - 7} {y + 14} V{y + 5} H{x + w - 13}" fill="none" stroke="{color}" stroke-width="1.2"/>'
        f'<path d="M{x + 7} {y + h - 14} V{y + h - 5} H{x + 13}" fill="none" stroke="{color}" stroke-width="1.2"/>'
        f'<path d="M{x + w - 7} {y + h - 14} V{y + h - 5} H{x + w - 13}" fill="none" stroke="{color}" stroke-width="1.2"/>'
    )


def _glyph(name: str, x: float, y: float, color: str) -> str:
    """16×16 kind mark in the node’s top-right corner."""
    s = f'stroke="{color}" fill="none" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"'
    drawn = {
        "terminal": (
            f'<rect x="{x + 1}" y="{y + 2}" width="14" height="12" rx="2" {s}/>'
            f'<path d="M{x + 4} {y + 7} L{x + 6.5} {y + 9} L{x + 4} {y + 11}" {s}/>'
            f'<path d="M{x + 8} {y + 11} H{x + 12}" {s}/>'
        ),
        "browser": (
            f'<rect x="{x + 1}" y="{y + 2}" width="14" height="12" rx="2" {s}/>'
            f'<path d="M{x + 1} {y + 6} H{x + 15}" {s}/>'
            f'<circle cx="{x + 4}" cy="{y + 4}" r="0.7" fill="{color}"/>'
            f'<circle cx="{x + 6.4}" cy="{y + 4}" r="0.7" fill="{color}"/>'
            f'<circle cx="{x + 8.8}" cy="{y + 4}" r="0.7" fill="{color}"/>'
        ),
        "entry": (
            f'<circle cx="{x + 8}" cy="{y + 8}" r="6.2" {s}/>'
            f'<path d="M{x + 6.2} {y + 5.2} L{x + 11.4} {y + 8} L{x + 6.2} {y + 10.8} Z" fill="{color}" stroke="none"/>'
        ),
        "gate": (
            f'<path d="M{x + 8} {y + 1.5} L{x + 14.5} {y + 8} L{x + 8} {y + 14.5} L{x + 1.5} {y + 8} Z" {s}/>'
            f'<circle cx="{x + 8}" cy="{y + 8}" r="2.1" fill="{color}"/>'
        ),
        "store": (
            f'<ellipse cx="{x + 8}" cy="{y + 4.2}" rx="5.4" ry="2.1" {s}/>'
            f'<path d="M{x + 2.6} {y + 4.2} V{y + 11.4} C{x + 2.6} {y + 13.4} {x + 13.4} {y + 13.4} {x + 13.4} {y + 11.4} V{y + 4.2}" {s}/>'
        ),
        "done": (
            f'<circle cx="{x + 8}" cy="{y + 8}" r="6.2" {s}/>'
            f'<circle cx="{x + 8}" cy="{y + 8}" r="3.4" fill="{color}"/>'
        ),
        "end": (
            f'<rect x="{x + 2.5}" y="{y + 2.5}" width="11" height="11" rx="2" transform="rotate(45 {x + 8} {y + 8})" {s}/>'
            f'<path d="M{x + 5.5} {y + 5.5} L{x + 10.5} {y + 10.5} M{x + 10.5} {y + 5.5} L{x + 5.5} {y + 10.5}" {s}/>'
        ),
        "node": (
            f'<rect x="{x + 4}" y="{y + 4}" width="8" height="8" rx="1.2" {s}/>'
            f'<path d="M{x + 4} {y + 7} H{x + 1.8} M{x + 12} {y + 7} H{x + 14.2} '
            f'M{x + 4} {y + 9} H{x + 1.8} M{x + 12} {y + 9} H{x + 14.2} '
            f'M{x + 7} {y + 4} V{y + 1.8} M{x + 9} {y + 4} V{y + 1.8} '
            f'M{x + 7} {y + 12} V{y + 14.2} M{x + 9} {y + 12} V{y + 14.2}" {s}/>'
        ),
        "chip": (
            f'<rect x="{x + 4}" y="{y + 4}" width="8" height="8" rx="1.2" {s}/>'
            f'<path d="M{x + 4} {y + 7} H{x + 1.8} M{x + 12} {y + 7} H{x + 14.2} '
            f'M{x + 4} {y + 9} H{x + 1.8} M{x + 12} {y + 9} H{x + 14.2} '
            f'M{x + 7} {y + 4} V{y + 1.8} M{x + 9} {y + 4} V{y + 1.8} '
            f'M{x + 7} {y + 12} V{y + 14.2} M{x + 9} {y + 12} V{y + 14.2}" {s}/>'
        ),
        "search": (
            f'<circle cx="{x + 7}" cy="{y + 7}" r="4.2" {s}/>'
            f'<path d="M{x + 10.2} {y + 10.2} L{x + 13.4} {y + 13.4}" {s}/>'
        ),
        "folder": (
            f'<path d="M{x + 2} {y + 5.5} V{y + 13} H{x + 14} V{y + 5.5} H{x + 8.2} L{x + 6.6} {y + 3.8} H{x + 2} Z" {s}/>'
        ),
    }
    return f'<g aria-hidden="true">{drawn.get(name, drawn["node"])}</g>'



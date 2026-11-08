# Documentation site

The GitHub Pages site for TahoePilot. It is published at
https://jixiedev.github.io/tpilot/.

The site is written for data-team users: analysts, data engineers and team leads. They
want to know what the platform does and what it can reach. They do not read code.

The repository's own documentation stays developer-facing. The two surfaces are written
separately on purpose.

## Layout

| Path | What it is |
|---|---|
| `docs_site/pages/` | Every published page. Markdown, plus the assets they reference. |
| `docs_site/pages/assets/diagrams/` | The SVG diagrams, generated and committed. |
| `docs_site/overrides/home.html` | The landing page template. |
| `docs_site/pages/stylesheets/extra.css` | Theme styling. |
| `docs_site/kept_terms.md` | The writing rules and the allow-list of names that may stay. |
| `docs_site/diagrams.py` | The diagram catalog, the writer and the command line. |
| `docs_site/canvas.py` | The drawing canvas: grid, HUD frame, connectors, bands. |
| `docs_site/shapes.py` | The shape library: the UML notation each element is drawn with. |
| `docs_site/labels.py` | The reader label map applied to every string that reaches a diagram. |
| `docs_site/diagrams_*.py` | The drawings themselves, grouped by theme. |
| `mkdocs.yml` | Navigation, theme, and the docs directory. |

## Writing a page

Read `docs_site/kept_terms.md` first. It is the contract, and the test suite enforces
the same rules.

In short:

- No module names, no source snippets, no configuration keys.
- Components are described as classes and objects in plain language.
- Links point to other pages of this site, never to a file on GitHub.
- Operational instructions — how to install, start, ask, approve — stay.

## The diagrams

Diagrams are painted by `docs_site/diagrams.py` and committed as static SVG files. The
painter rewrites code-shaped labels into reader-facing words, so a diagram never names a
source file.

### Notation

A diagram is a model, so every element is drawn with the notation that matches its role
rather than as a labelled rectangle:

| Role | Shape |
|---|---|
| A running machine: the terminal, the browser, a server | 3-D box |
| A replaceable part of the platform: an agent, the catalog, the router | rectangle with two tabs |
| Something stored: checkpoints, an index, an archive | cylinder |
| A choice, or a gate that waits for a person | diamond |
| The person using the platform | stick figure |
| Something in flight: a request, a stream of events | pointed rectangle |
| One step of a flow | rounded rectangle |
| The outcome: an answer, an error, a summary | folded-corner note |
| A file: a settings file, an evaluation case | wavy-bottom document |
| Something outside the platform: a warehouse, a catalog | cloud |

Drawings are organised into horizontal bands, one per layer of the system, with the band
labelled above it and shared items in a side panel. `docs_site/diagrams_system.py` holds
the reference drawing.

After changing the drawings, regenerate the assets:

```bash
python -m docs_site.diagrams --write docs_site/pages/assets/diagrams
```

The generator refuses to write a diagram that still names a source file.

## Usage

```bash
./scripts/docs.sh install   # once: uv sync --extra docs
./scripts/docs.sh serve     # http://127.0.0.1:8000/tpilot/
./scripts/docs.sh build     # writes ./site (gitignored)
```

The site is served under `/tpilot/` because `site_url` in `mkdocs.yml` carries that path.

## Checks

```bash
python -m pytest tests/test_docs_site.py
```

The tests build the site with `--strict` and assert that no module name, source snippet,
code-shaped identifier or GitHub file link reaches a published page.

## Pitfalls

- Material styles `figure` as `width: fit-content`, which makes a diagram box narrower
  than the image inside it and the image spills past its own border. The site CSS pins
  `figure.tp-diagram` to `width: 100%` and widens `.md-grid`; without both, every
  diagram renders cropped.
- A new page must be added to the navigation in `mkdocs.yml`. A page that is not in the
  navigation fails the test that checks every page is reachable.
- The Databot state machine is drawn twice: a reader-facing version on the site, and a
  detailed developer version in `docs/databot-graph.html` in the repository. The site
  version is hand-written and stays in English; the developer version is not published.
  Add the repository link to the root README if you want developers to find it.

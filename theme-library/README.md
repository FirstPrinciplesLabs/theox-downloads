# TheoX Theme Library

Theme extensions are optional, inert appearance contributions for TheoX. Each
package uses the `theox.theme-package.v2` schema and may contribute a workbench
palette, a syntax palette, a file-icon palette, or a compatible combination. The
desktop validates every fixed token. Packages cannot include grammars, scripts,
fonts, remote assets, arbitrary SVG, or executable code.

The initial curated collection includes:

- **Aurora Noir** — cool blue-black surfaces with a restrained mint accent.
- **Arctic Daylight** — a crisp cool-light workspace for bright-room review.
- **Cobalt Night** — layered midnight-blue surfaces with luminous cobalt focus cues.
- **Ember Slate** — warm charcoal surfaces with copper navigation accents.
- **Paper Sage** — a warm archival-paper light theme with sage structure.
- **Plum Graphite** — graphite foundations with quiet plum and lavender accents.

File icon choices are independent of the workbench and syntax palettes:

- **Research Spectrum Icons** — balanced semantic symbols for mixed research workspaces.
- **Proof & Paper Icons** — emphasizes Lean, formal sources, LaTeX, and Markdown.
- **Data Atlas Icons** — emphasizes datasets, tables, scripts, and generated assets.
- **Monochrome Lab Icons** — a quiet minimal-label option with restrained neutral colors.
- **High Contrast Research Icons** — vivid, high-separation cues for dense explorers.

TheoX downloads a package only after the user chooses **Add Theme Pack**, verifies its
published SHA-256 digest, stores it in the app's local theme library, and records an
inert installation receipt. Installation adds each contribution to its matching
Appearance selector; it does not silently replace the user's other theme choices.

Version 1.2 separates each curated workbench and syntax contribution so users can
mix them independently. The catalog carries validated preview palettes so TheoX can
show a realistic workspace and highlighted-editor example before installation. File
icon packs use only TheoX's fixed, allowlisted symbols and semantic color tokens;
they cannot ship arbitrary SVG, scripts, fonts, or remote assets.

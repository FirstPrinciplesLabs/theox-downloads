# TheoX Theme Library

Theme extensions are optional, color-only palettes for TheoX. Each package uses the
`theox.theme-package.v1` schema and may contain only the fixed set of validated color
tokens understood by the desktop app. Themes cannot include scripts, fonts, remote
assets, or executable code.

The initial curated collection includes:

- **Aurora Noir** — cool blue-black surfaces with a restrained mint accent.
- **Arctic Daylight** — a crisp cool-light workspace for bright-room review.
- **Cobalt Night** — layered midnight-blue surfaces with luminous cobalt focus cues.
- **Ember Slate** — warm charcoal surfaces with copper navigation accents.
- **Paper Sage** — a warm archival-paper light theme with sage structure.
- **Plum Graphite** — graphite foundations with quiet plum and lavender accents.

TheoX downloads a package only after the user chooses **Add Theme**, verifies its
published SHA-256 digest, stores it in the app's local theme library, and records an
inert installation receipt.

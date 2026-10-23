# TheoX 0.1.2 Preview 2

This preview gives early users a more complete desktop workspace for scientific
research. It is built from TheoX source tag `v0.1.2-preview.2` at commit
`d2494d89b199ac28fc53d4effed1b668abd7f1b5`.

## What is new

- A stronger code and text editing workspace for Study files, including tabs,
  unsaved-change indicators, syntax highlighting, and editable notebooks.
- TheoX notebooks (`.theoxnb`) for combining code, Markdown, advisor work, and
  durable outputs in the same Study. Jupyter notebooks remain supported as the
  familiar code-and-output format.
- User-selected locations for new Studies and clearer start/open behavior when
  no Study is active.
- An integrated, workspace-aware terminal with Study and workspace locations,
  multiple prompt styles, themes, splits, search, and session management.
- Per-Study model-usage history, improved navigation and settings, and more
  reliable desktop-window startup.
- Study file upload, copy, and library improvements.
- Safer provider switching: stored OpenAI, Anthropic, and Gemini tool history is
  translated into the selected provider's native message format while durable
  tool receipts remain intact.
- More resilient context-window recovery and restart behavior in Agent Runtime
  V2.

## Platforms

- macOS on Apple silicon: DMG installer
- Windows x64: installer
- Linux x86_64: AppImage and portable tar archive

Each native package completed source checks, packaged startup checks, and the
TheoX product-acceptance workflow in GitHub Actions for its target operating
system.

## Preview installation notice

These builds are unsigned previews. The macOS DMG is not Apple-notarized and
may require explicit approval in Privacy & Security before first launch.
Windows may display a SmartScreen warning. Verify the downloaded file against
`SHA256SUMS` before installing.

# TheoX Downloads

Official public downloads and release site for TheoX by First Principles Labs.

The application source remains in the private `FirstPrinciplesLabs/theox`
repository. This repository contains only the static download site, public
release metadata, published installer assets, and optional portable Study
templates. Scientific templates are versioned independently and are never
bundled silently into the blank TheoX workspace.

The public product story is intentionally a single homepage. Its overview and
focused model, privacy, and verification films mirror the current TheoX V2 UI;
legacy About and tour URLs redirect back into that page.

## Release policy

- Preview artifacts must be visibly identified as unsigned when applicable.
- Stable macOS and Windows downloads must be signed and pass their platform
  release checks before publication.
- Every published artifact must appear in `release-manifest.json` with its
  SHA-256 digest.
- Study templates live under `study-library/`, publish their own catalog and
  checksum set, and install inertly through TheoX Extensions.
- Color-only themes live under `theme-library/`, publish versioned interface and
  syntax palettes with checksums, and cannot include grammars, executable code,
  fonts, or remote assets.
- Hosted model access extensions live under `model-library/`. They contain no
  weights, credentials, executable code, or private service endpoints.
- GitHub Pages deploys only from `main` through `.github/workflows/pages.yml`.

# TheoX Downloads

Official public downloads and release site for TheoX by First Principles Labs.

The application source remains in the private `FirstPrinciplesLabs/theox`
repository. This repository contains only the static download site, public
release metadata, and published installer assets.

## Release policy

- Preview artifacts must be visibly identified as unsigned when applicable.
- Stable macOS and Windows downloads must be signed and pass their platform
  release checks before publication.
- Every published artifact must appear in `release-manifest.json` with its
  SHA-256 digest.
- GitHub Pages deploys only from `main` through `.github/workflows/pages.yml`.

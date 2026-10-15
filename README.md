# TheoX Downloads

Official public downloads and release site for TheoX by First Principles Labs.

The application source is in the private
[FirstPrinciplesLabs/theox](https://github.com/FirstPrinciplesLabs/theox)
repository. This repository contains only the static download site, public
release metadata, published installer assets, and optional portable Study
templates. Scientific templates are versioned independently and are never
bundled silently into the blank TheoX workspace.

## Which repository do I need?

| Goal | Start here |
| --- | --- |
| Run or develop the current TheoX app | [Application source and setup](https://github.com/FirstPrinciplesLabs/theox#develop) |
| Follow the detailed native/browser setup and first-run walkthrough | [Desktop developer guide](https://github.com/FirstPrinciplesLabs/theox/blob/main/apps/desktop/README.md) |
| Install a published desktop package | [Download website](https://firstprincipleslabs.github.io/theox-downloads/) and [installation guide](https://github.com/FirstPrinciplesLabs/theox/blob/main/apps/desktop/INSTALL.md) |
| Edit the website or host optional Study starting points | This repository |

Cloning this repository does **not** give you the app or an agent runtime.
Colleagues testing the latest merged V2 work should use the source repository;
the published download can be older than `main`. Check
[release-manifest.json](release-manifest.json) and the linked release for the
actual installer version. Pulling source does not update an installed app.

## Run the application from source

You need access to `FirstPrinciplesLabs/theox`, Git, Node.js **22** with npm,
and [`uv`](https://docs.astral.sh/uv/). The app pins Python **3.12**. In a
macOS/Linux terminal or Windows PowerShell:

```sh
git clone https://github.com/FirstPrinciplesLabs/theox.git
cd theox
uv python install 3.12
uv sync --group dev --locked
cd apps/desktop
npm ci
npm run build
npm run desktop
```

For browser development, run `npm run dev` instead of the final two commands,
then open the **single-use local session link printed by that server**. Keep the
link private. Configure and test your own model provider in **Settings**, select
its model in the composer, then create a Study. A private Study requires no
Google account, public relay, or cloud deployment. Actual agent work needs a
provider key or a running compatible local/self-hosted endpoint.

The [desktop guide](https://github.com/FirstPrinciplesLabs/theox/blob/main/apps/desktop/README.md)
covers persistent development workspaces, permissions, credential-storage
limitations, tests, optional LaTeX/Lean tools, and known gaps. Source checks and
unsigned package validation are not proof of signed clean-machine installation
or production human collaboration. Do not bypass platform trust warnings to
make an unsigned installer work; use the source path or an approved signed build.

## Preview this website locally

The site is plain HTML, CSS, JavaScript, and JSON. No npm dependencies, Electron,
Python scientific packages, or model keys are needed to preview it. From this
repository's root, with Python 3 installed:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

On Windows, use `py -3 -m http.server 8080 --bind 127.0.0.1` if the `python3`
command is unavailable. Open `http://127.0.0.1:8080`. This previews the website,
not a hosted TheoX app. Model requests, scientific tools, and Study files belong
to the separate application runtime.

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
  checksum set, and appear in **Study Extensions** for installation into the
  local Study Library. They are not bundled with the app and installation does
  not execute their attached computation or Lean source.
- GitHub Pages deploys only from `main` through `.github/workflows/pages.yml`.
- The Pages workflow checks homepage version, installer links, and featured
  checksum against `release-manifest.json`. Website deployment does not build
  or release the desktop application; application packaging and release gates
  live in the source repository.

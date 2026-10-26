# TheoX 0.1.3 Preview 1

This internal preview strengthens the TheoX desktop runtime and distribution
path for early use. It is built from TheoX source tag `v0.1.3-preview.1` at
commit `84bdc952e992bc45f8b65d533d5feaefba7e1dd2`.

## What is new

- Clear Question, Focused work, and Discovery Goal modes with finite activation
  limits. Longer autonomous work is opt-in, can be paused or stopped, and
  continues through another bounded activation rather than an unlimited run.
- Faster visible feedback while the advisor works, with streamed public
  responses, current activity, elapsed time, and durable restart state.
- Safer cross-provider work. TheoX translates OpenAI, Anthropic, and Gemini tool
  history into the selected provider's native format while retaining durable
  tool receipts and rejecting malformed history before a paid continuation.
- More reliable Stop, Pause, resume, retry, and restart behavior. Completed
  effects are not silently repeated, and uncertain interrupted effects are not
  reported as completed.
- Bounded web search and retrieval with explicit network permission, public-HTTPS
  restrictions, source provenance, and digest-bound retrieval receipts.
- Per-Study model usage grouped by the model that executed the work. Provider
  token and cache counts survive retry and restart without double counting;
  missing usage or cost remains unknown rather than being shown as zero.
- Improved context recovery and selective retrieval of prior evidence without
  loading an entire Study library before every response.
- A more dependable packaged startup and window path across macOS, Windows, and
  Linux.

This preview also contains the editor, workspace-aware terminal, Jupyter and
TheoX notebooks, user-selected Study locations, file views, and Study model
usage work delivered since the previous published preview.

## Installing or updating the preview

These packages are unsigned internal previews. They do not install updates
silently. TheoX can notify you when a newer preview is available and open its
release page.

On macOS:

1. Quit every running TheoX window.
2. Download and open the new DMG, then launch the TheoX copy inside it.
3. Choose **Install in Applications** when TheoX offers the guided install.
4. TheoX replaces the non-running `/Applications/TheoX.app`, quits, and
   relaunches the installed copy.
5. Eject the DMG after the installed copy opens.

Do not run old and new copies from separate DMGs. If the guided move cannot
complete, quit every TheoX copy, drag the new app into `/Applications`, choose
**Replace**, eject the DMG, and launch TheoX from Applications.

Because this preview is unsigned, provider keys remain in memory for the current
app session instead of using macOS Keychain. Re-enter them after quitting TheoX.
Signed releases will restore OS-protected credential persistence.

## Platforms and verification

- macOS on Apple silicon: DMG installer
- Windows x64: installer
- Linux x86_64: AppImage and portable tar archive

Each native package completed the TheoX source checks, security and identity
boundary tests, packaged startup smoke, and product-acceptance workflow in
GitHub Actions for its target operating system. Verify downloads against
`SHA256SUMS` before installing.

This engineering qualification does not claim scientific novelty, proof,
literature completeness, signed distribution, or full TheoX-versus-Codex
parity. The matched-task parity stress test remains a separate exercise.

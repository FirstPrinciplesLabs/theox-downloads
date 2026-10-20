# TheoX Role Library

The Role Library publishes inert declarations for product roles that are already
implemented by a compatible TheoX build. A role package cannot add executable
code, navigation chosen by a publisher, service endpoints, credentials, remote
assets, model weights, grammars, HTML, CSS, fonts, or arbitrary SVG.

## Education

The first supported product role is **Education**. Installing its declaration
allows TheoX core to show its built-in Education destination. Installation does
not create a Class, contact First Principles, store a key, or publish content.

Inside TheoX, an instructor can use Education to:

- keep durable, instructor-owned Class workspaces locally;
- bind exact Study revisions without copying an unrestricted registry;
- turn advisor collaboration into typed, reviewable curriculum directives;
- verify definitions, notation, prerequisites, examples, and nonexamples;
- preview and explicitly approve an immutable student release;
- publish a bounded, invite-only student investigation under a First
  Principles-managed deployment lease; and
- synchronize structured conjectures, counterexamples, proofs, files, contact
  fields, validation results, and instructor review history.

Student investigations use the deterministic TheoX kernel by default. The
First Principles Education key is entered and stored by TheoX itself; the public
package contains no credential and no private or public service endpoint.

## Preview assets

The PNGs in [`previews/`](previews/) illustrate the intended TheoX-owned
instructor and student surfaces. They are documentation assets, not installable
package content, and the role catalog deliberately contains no preview URL.
TheoX renders the actual Education UI from trusted application code.

## Integrity

`SHA256SUMS` covers the exact package bytes referenced by `catalog.json`.
Run the repository checks before publishing:

```sh
node --test tests/role-library.test.mjs
```

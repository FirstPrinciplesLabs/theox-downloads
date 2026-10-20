# TheoX Education Starter Library

Education Class Starters are inert curriculum scaffolds for TheoX Education.
They are not Classes, Studies, registries, hosted sites, or executable plugins.
Importing a starter creates an instructor-owned draft only after the instructor
chooses to do so.

Each package supplies:

- subject-level learning objectives;
- clear student-facing concepts with plain-language and formal definitions;
- explicit notation, prerequisites, worked examples, and nonexamples;
- stable requested descriptor identities that TheoX must resolve against an
  instructor-selected, exact Study revision;
- bounded deterministic investigation palettes; and
- no instructor identity, course title, course code, term, contact policy,
  student identity policy, access policy, or deployment configuration.

The initial collection includes Calculus, Linear Algebra, Combinatorics, and
Graph Theory. Examples are pedagogical source material, not a claim that a
publisher signed or kernel-verified the package. TheoX must validate every
descriptor binding and computable example during import before the material can
pass the Education release clarity gate.

## Trust boundary

Packages use the `theox.education-class-starter.v1` schema. They contain JSON
metadata only: no code, scripts, commands, endpoints, URLs, credentials, model
keys, remote assets, fonts, grammars, weights, or arbitrary markup. Preview PNGs
are repository documentation and are not referenced by the catalog or package.

Catalog entries bind exact package bytes with SHA-256. Checksums detect changed
bytes; they are not publisher signatures or attestations.

Run the validation suite before publication:

```sh
node --test tests/education-starter-library.test.mjs
```

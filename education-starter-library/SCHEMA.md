# Education Class Starter schema

## Catalog

`catalog.json` uses `theox.education-starter-catalog.v1` and contains only a
`packages` array. Each entry carries public descriptive metadata, an exact safe
relative `packagePath`, the raw byte length, and a lowercase SHA-256 digest.

## Package

`theox.education-class-starter.v1` packages have these exact top-level fields:

```text
schema_version, id, title, subject, summary, details, publisher, version,
license, compatibility, tags, published_at, default_class, curriculum
```

`default_class.title` and `default_class.description` are always `null`.
Instructor-specific fields are intentionally absent.

`curriculum` contains `objectives`, `concepts`, and `investigation`.
Every concept has:

```text
descriptor_id, kind, title, plain_language, formal_definition, notation,
prerequisites, worked_example, nonexample, verification
```

Prerequisites name descriptors in the same package. Worked examples include a
prompt, visible reasoning steps, and a conclusion. `verification` is always
`required_at_import`: publishing metadata does not assert mathematical
validation.

The investigation section declares one bounded object family, a palette of
properties and invariants drawn from the package concepts, allowlisted
conjecture families, concept-invention heuristics, visualizations, and hard
limits. `student_model_calls` must be zero. Descriptor identities are requests,
not scientific bindings; TheoX resolves them only after the instructor binds an
exact Study revision and accepts the resulting provenance.

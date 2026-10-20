import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "education-starter-library");
const packageFields = new Set(["schema_version", "id", "title", "subject", "summary", "details", "publisher", "version", "license", "compatibility", "tags", "published_at", "default_class", "curriculum"]);
const catalogFields = new Set(["key", "id", "title", "subject", "summary", "details", "publisher", "version", "license", "compatibility", "tags", "publishedAt", "conceptCount", "propertyCount", "invariantCount", "sizeBytes", "packagePath", "sha256"]);
const conceptFields = new Set(["descriptor_id", "kind", "title", "plain_language", "formal_definition", "notation", "prerequisites", "worked_example", "nonexample", "verification"]);
const conceptKinds = new Set(["definition", "function", "property", "invariant"]);
const conjectureFamilies = new Set(["implication", "equivalence", "equality", "lower_bound", "upper_bound", "monotonic_relationship"]);
const heuristics = new Set(["boolean_composition", "threshold_predicate", "invariant_difference", "invariant_ratio", "restricted_object_view"]);
const visualizations = new Set(["function_plot", "derivative_plot", "matrix_heatmap", "permutation_diagram", "graph_view", "histogram", "invariant_scatter", "property_matrix", "conjecture_graph", "counterexample_table"]);
const expectedIds = ["calculus", "linear-algebra", "combinatorics", "graph-theory"];
const forbiddenKey = /^(?:endpoint|url|uri|script|command|executable|javascript|html|css|font|credential|secret|token|api[_-]?key|weight|grammar|signature|signed|study_id|study_revision|instructor|course_code|term|contact|access_policy)$/i;
const forbiddenValue = /(?:https?:\/\/|wss?:\/\/|localhost|127\.0\.0\.1|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|sk-[A-Za-z0-9]{16,}|<script|javascript:)/i;

function exact(value, fields, label) {
  assert.equal(value && typeof value === "object" && !Array.isArray(value), true, `${label} must be an object`);
  assert.deepEqual(Object.keys(value).filter((key) => !fields.has(key)), [], `${label} has unsupported fields`);
}

async function catalog() {
  return JSON.parse(await readFile(join(root, "catalog.json"), "utf8"));
}

async function packageFor(entry) {
  const raw = await readFile(join(root, entry.packagePath));
  return { raw, value: JSON.parse(raw.toString("utf8")) };
}

test("catalog contains four checksum-bound inert starters", async () => {
  const value = await catalog();
  exact(value, new Set(["schema_version", "packages"]), "catalog");
  assert.equal(value.schema_version, "theox.education-starter-catalog.v1");
  assert.deepEqual(value.packages.map((entry) => entry.id), expectedIds);

  for (const entry of value.packages) {
    exact(entry, catalogFields, `${entry.id} catalog entry`);
    assert.match(entry.packagePath, /^packages\/[a-z0-9-]+-\d+\.\d+\.\d+\.theox-education-starter\.json$/);
    assert.match(entry.sha256, /^[a-f0-9]{64}$/);
    const { raw, value: starter } = await packageFor(entry);
    assert.equal(entry.sizeBytes, raw.byteLength);
    assert.equal(entry.sha256, createHash("sha256").update(raw).digest("hex"));
    assert.equal(entry.id, starter.id);
    assert.equal(entry.version, starter.version);
    assert.equal(entry.title, starter.title);
    assert.equal(entry.conceptCount, starter.curriculum.concepts.length);
    assert.equal(entry.propertyCount, starter.curriculum.investigation.properties.length);
    assert.equal(entry.invariantCount, starter.curriculum.investigation.invariants.length);
  }
});

test("packages leave instructor, Class, access, and Study bindings unset", async () => {
  for (const entry of (await catalog()).packages) {
    const { raw, value: starter } = await packageFor(entry);
    exact(starter, packageFields, `${entry.id} package`);
    assert.equal(starter.schema_version, "theox.education-class-starter.v1");
    assert.deepEqual(starter.default_class, { title: null, description: null });
    assert.doesNotMatch(raw.toString("utf8"), forbiddenValue);

    const walk = (value) => {
      if (Array.isArray(value)) return value.forEach(walk);
      if (!value || typeof value !== "object") return;
      for (const [key, nested] of Object.entries(value)) {
        assert.doesNotMatch(key, forbiddenKey, `${entry.id} contains forbidden field ${key}`);
        walk(nested);
      }
    };
    walk(starter);
  }
});

test("every concept satisfies the student clarity contract", async () => {
  for (const entry of (await catalog()).packages) {
    const { value: starter } = await packageFor(entry);
    assert.ok(starter.curriculum.objectives.length >= 4);
    const ids = new Set(starter.curriculum.concepts.map((concept) => concept.descriptor_id));
    assert.equal(ids.size, starter.curriculum.concepts.length, `${entry.id} descriptor ids must be unique`);

    for (const concept of starter.curriculum.concepts) {
      exact(concept, conceptFields, `${entry.id}:${concept.descriptor_id}`);
      assert.equal(conceptKinds.has(concept.kind), true);
      assert.ok(concept.plain_language.length >= 45);
      assert.ok(concept.formal_definition.length >= 35);
      assert.ok(concept.notation.length >= 1);
      for (const notation of concept.notation) exact(notation, new Set(["symbol", "meaning"]), "notation");
      for (const prerequisite of concept.prerequisites) assert.equal(ids.has(prerequisite), true, `${prerequisite} must resolve locally`);
      exact(concept.worked_example, new Set(["prompt", "steps", "conclusion"]), "worked example");
      assert.ok(concept.worked_example.steps.length >= 2);
      exact(concept.nonexample, new Set(["prompt", "explanation"]), "nonexample");
      assert.ok(concept.nonexample.explanation.length >= 35);
      assert.equal(concept.verification, "required_at_import");
    }
  }
});

test("investigation palettes are referentially complete, allowlisted, and bounded", async () => {
  for (const entry of (await catalog()).packages) {
    const { value: starter } = await packageFor(entry);
    const investigation = starter.curriculum.investigation;
    exact(investigation, new Set(["object_family", "properties", "invariants", "conjecture_families", "concept_invention_heuristics", "visualizations", "limits"]), "investigation");
    exact(investigation.object_family, new Set(["id", "label", "scope", "representation"]), "object family");
    const concepts = new Map(starter.curriculum.concepts.map((concept) => [concept.descriptor_id, concept]));
    for (const item of investigation.properties) {
      exact(item, new Set(["descriptor_id", "label"]), "property palette item");
      assert.equal(concepts.get(item.descriptor_id)?.kind, "property");
    }
    for (const item of investigation.invariants) {
      exact(item, new Set(["descriptor_id", "label"]), "invariant palette item");
      assert.equal(["invariant", "function"].includes(concepts.get(item.descriptor_id)?.kind), true);
    }
    for (const family of investigation.conjecture_families) assert.equal(conjectureFamilies.has(family), true);
    for (const heuristic of investigation.concept_invention_heuristics) assert.equal(heuristics.has(heuristic), true);
    for (const visualization of investigation.visualizations) assert.equal(visualizations.has(visualization), true);
    exact(investigation.limits, new Set(["max_objects", "max_properties", "max_invariants", "max_conjectures_per_run", "max_derived_concepts", "student_model_calls"]), "limits");
    assert.equal(investigation.limits.student_model_calls, 0);
    assert.ok(investigation.limits.max_objects > 0 && investigation.limits.max_objects <= 50000);
    assert.ok(investigation.limits.max_conjectures_per_run <= 500);
    assert.ok(investigation.limits.max_derived_concepts <= 20);
  }
});

test("checksum file and PNG documentation previews cover the published starters", async () => {
  const value = await catalog();
  const expectedSums = value.packages.map((entry) => `${entry.sha256}  ${entry.packagePath}`).join("\n") + "\n";
  assert.equal(await readFile(join(root, "SHA256SUMS"), "utf8"), expectedSums);

  for (const id of expectedIds) {
    const bytes = await readFile(join(root, "previews", `${id}.png`));
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(bytes.readUInt32BE(16), 1400);
    assert.equal(bytes.readUInt32BE(20), 840);
  }
});

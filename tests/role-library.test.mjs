import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const libraryRoot = join(repositoryRoot, "role-library");
const catalogPath = join(libraryRoot, "catalog.json");

const packageFields = new Set([
  "schema_version", "id", "title", "summary", "details", "publisher", "version", "license",
  "compatibility", "contribution", "authentication", "service_id", "capabilities", "limitations",
  "data_notice", "availability_notice", "tags", "published_at",
]);
const catalogEntryFields = new Set([
  "key", "id", "title", "summary", "details", "publisher", "version", "license",
  "compatibility", "contribution", "authentication", "serviceId", "capabilities", "limitations",
  "dataNotice", "availabilityNotice", "tags", "publishedAt", "sizeBytes", "packagePath", "sha256",
]);
const contributionFields = new Set(["id", "activity_label", "activity_icon"]);
const expectedContribution = {
  id: "education",
  activity_label: "Education",
  activity_icon: "education",
};
const semverPattern = /^\d+\.\d+\.\d+(?:[-+][a-zA-Z0-9.-]+)?$/;
const digestPattern = /^[a-f0-9]{64}$/;
const safePathPattern = /^(?!\/)(?!.*(?:^|\/)\.\.?\/)(?!.*\\)(?!.*:)[a-zA-Z0-9._/-]+$/;
const forbiddenFieldPattern = /(?:endpoint|url|uri|script|command|executable|javascript|html|css|font|credential|secret|token|api[_-]?key|weight|grammar)/i;
const forbiddenValuePattern = /(?:https?:\/\/|wss?:\/\/|localhost|127\.0\.0\.1|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|sk-[A-Za-z0-9]{16,})/i;

function exactKeys(value, allowed, label) {
  assert.equal(value && typeof value === "object" && !Array.isArray(value), true, `${label} must be an object`);
  const extras = Object.keys(value).filter((key) => !allowed.has(key));
  assert.deepEqual(extras, [], `${label} has unsupported fields`);
}

async function loadCatalog() {
  return JSON.parse(await readFile(catalogPath, "utf8"));
}

async function packageFixture(entry) {
  const raw = await readFile(join(libraryRoot, entry.packagePath));
  return { raw, value: JSON.parse(raw.toString("utf8")) };
}

test("Role Library exposes only the exact catalog schema accepted by TheoX", async () => {
  const catalog = await loadCatalog();
  exactKeys(catalog, new Set(["schema_version", "packages"]), "catalog");
  assert.equal(catalog.schema_version, "theox.role-library-catalog.v1");
  assert.equal(Array.isArray(catalog.packages), true);
  assert.equal(catalog.packages.length, 1);

  const [entry] = catalog.packages;
  exactKeys(entry, catalogEntryFields, "catalog entry");
  exactKeys(entry.contribution, contributionFields, "catalog contribution");
  assert.deepEqual(entry.contribution, expectedContribution);
  assert.equal(entry.key, "role-package:education");
  assert.equal(entry.id, "education");
  assert.equal(entry.authentication, "firstprinciples_llm_key");
  assert.equal(entry.serviceId, "first-principles-education-v1");
  assert.match(entry.version, semverPattern);
  assert.match(entry.compatibility, semverPattern);
  assert.match(entry.packagePath, safePathPattern);
  assert.match(entry.sha256, digestPattern);
});

test("Education package is metadata-only and matches the TheoX-owned implementation", async () => {
  const [entry] = (await loadCatalog()).packages;
  const { raw, value: rolePackage } = await packageFixture(entry);
  exactKeys(rolePackage, packageFields, "role package");
  exactKeys(rolePackage.contribution, contributionFields, "package contribution");
  assert.equal(rolePackage.schema_version, "theox.product-role-package.v1");
  assert.equal(rolePackage.id, "education");
  assert.deepEqual(rolePackage.contribution, expectedContribution);
  assert.equal(rolePackage.authentication, "firstprinciples_llm_key");
  assert.equal(rolePackage.service_id, "first-principles-education-v1");
  assert.equal(rolePackage.compatibility?.minimum_version, "0.1.2");
  assert.match(rolePackage.version, semverPattern);
  assert.ok(raw.byteLength < 64 * 1024, "role package must remain below TheoX's 64 KB limit");

  for (const key of Object.keys(rolePackage)) {
    assert.doesNotMatch(key, forbiddenFieldPattern, `package must not declare ${key}`);
  }
  assert.doesNotMatch(raw.toString("utf8"), forbiddenValuePattern, "package must not embed an endpoint or secret-like value");
});

test("catalog metadata mirrors the signed package identity and policy", async () => {
  const [entry] = (await loadCatalog()).packages;
  const { raw, value: rolePackage } = await packageFixture(entry);
  const digest = createHash("sha256").update(raw).digest("hex");

  assert.equal(entry.sha256, digest);
  assert.equal(entry.sizeBytes, raw.byteLength);
  assert.equal(entry.id, rolePackage.id);
  assert.equal(entry.title, rolePackage.title);
  assert.equal(entry.summary, rolePackage.summary);
  assert.equal(entry.details, rolePackage.details);
  assert.equal(entry.publisher, rolePackage.publisher);
  assert.equal(entry.version, rolePackage.version);
  assert.equal(entry.license, rolePackage.license);
  assert.equal(entry.authentication, rolePackage.authentication);
  assert.equal(entry.serviceId, rolePackage.service_id);
  assert.deepEqual(entry.contribution, rolePackage.contribution);
  assert.deepEqual(entry.capabilities, rolePackage.capabilities);
  assert.deepEqual(entry.limitations, rolePackage.limitations);
  assert.equal(entry.dataNotice, rolePackage.data_notice);
  assert.equal(entry.availabilityNotice, rolePackage.availability_notice);
  assert.deepEqual(entry.tags, rolePackage.tags);
  assert.equal(entry.publishedAt, rolePackage.published_at);

  const sums = await readFile(join(libraryRoot, "SHA256SUMS"), "utf8");
  assert.equal(sums, `${digest}  ${entry.packagePath}\n`);
});

test("Education metadata makes install, custody, deployment, and model boundaries explicit", async () => {
  const [entry] = (await loadCatalog()).packages;
  const { value: rolePackage } = await packageFixture(entry);
  const policy = [
    rolePackage.details,
    ...rolePackage.capabilities,
    ...rolePackage.limitations,
    rolePackage.data_notice,
    rolePackage.availability_notice,
  ].join(" ").toLowerCase();

  for (const phrase of [
    "installing this package is inert",
    "durable local history",
    "exact study revision",
    "deterministic",
    "invite-only",
    "structured conjecture",
    "operating-system credential vault",
    "managed deployment leases",
  ]) {
    assert.match(policy, new RegExp(phrase.replaceAll("-", "[- ]")), `missing product boundary: ${phrase}`);
  }
});

test("documentation previews are fixed PNG assets and never installable role content", async () => {
  const [entry] = (await loadCatalog()).packages;
  const previewNames = [
    "education-marketplace.png",
    "education-class-workspace.png",
    "education-student-investigation.png",
  ];

  for (const name of previewNames) {
    const bytes = await readFile(join(libraryRoot, "previews", name));
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], `${name} must be a PNG`);
    assert.equal(bytes.readUInt32BE(16), 1600, `${name} width changed`);
    assert.equal(bytes.readUInt32BE(20), 1000, `${name} height changed`);
  }

  assert.equal(Object.keys(entry).some((key) => /preview|image|asset/i.test(key)), false);
  const { value: rolePackage } = await packageFixture(entry);
  assert.equal(Object.keys(rolePackage).some((key) => /preview|image|asset/i.test(key)), false);
});

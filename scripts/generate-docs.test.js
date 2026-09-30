#!/usr/bin/env node
/**
 * CATemplate/README*.md is generated. A README that no longer matches the templates reads as if
 * it were correct, so a stale one is a failure here, not a warning.
 */
const fs = require("fs");
const path = require("path");
const assert = require("node:assert");
const { test } = require("node:test");

const { build } = require("./generate-docs");

test("de README's in CATemplate/ zijn bij (anders: node scripts/generate-docs.js)", () => {
  for (const [pad, verwacht] of Object.entries(build())) {
    assert.ok(fs.existsSync(pad), `${path.basename(pad)} ontbreekt`);
    assert.strictEqual(fs.readFileSync(pad, "utf8"), verwacht, `${path.basename(pad)} is verouderd`);
  }
});

test("elke policy staat in elke README", () => {
  const templates = fs.readdirSync(path.join(__dirname, "..", "CATemplate")).filter((f) => f.startsWith("CXNM__STANDARD__") && f.endsWith(".json"));
  for (const inhoud of Object.values(build())) {
    for (const f of templates) assert.ok(inhoud.includes(`(${f})`), `${f} ontbreekt in de README`);
  }
});

// Tests for the marketing engine. Run with: npm test
// Uses the built-in Node test runner, so no extra packages are needed.

import test from "node:test";
import assert from "node:assert/strict";
import {
  validateInputs,
  generateMarketingKit,
  kitToMarkdown,
  kitToJson,
  abResult,
  SIMULATED_LABEL,
} from "./marketingEngine.js";

const GOOD = {
  brandName: "StudyForge AI",
  productLine: "A study planner for university students in Mexico.",
  tone: "Friendly",
};

// Software test 2 (logic part): the kit has the right amount of content.
test("kit has 10 posts, 3 scripts and a 14-day calendar", () => {
  const kit = generateMarketingKit(GOOD);
  assert.equal(kit.posts.length, 10);
  assert.equal(kit.scripts.length, 3);
  assert.equal(kit.calendar.length, 14);
  assert.equal(kit.landing.benefits.length, 3);
  assert.equal(kit.landing.faq.length, 3);
});

test("kit is labeled as simulated output", () => {
  const kit = generateMarketingKit(GOOD);
  assert.equal(kit.simulated, true);
  assert.equal(kit.label, SIMULATED_LABEL);
});

test("every calendar row points to a real piece", () => {
  const kit = generateMarketingKit(GOOD);
  const ids = new Set(["landing", ...kit.posts.map((p) => p.id), ...kit.scripts.map((s) => s.id)]);
  kit.calendar.forEach((row, i) => {
    assert.equal(row.day, i + 1);
    assert.ok(ids.has(row.piece), `row ${row.day} points to missing piece ${row.piece}`);
  });
});

test("kit uses the brand name the user typed", () => {
  const kit = generateMarketingKit({ ...GOOD, brandName: "NotaClara" });
  assert.ok(kit.posts[0].text.includes("NotaClara"));
  assert.ok(kit.posts[0].hashtags.includes("#NotaClara"));
});

// Software test 3 (logic part): empty or bad input is blocked.
test("invalid input is blocked", () => {
  assert.ok(validateInputs({ ...GOOD, brandName: "   " }).length > 0);
  assert.ok(validateInputs({ ...GOOD, productLine: "" }).length > 0);
  assert.ok(validateInputs({ ...GOOD, tone: "Angry" }).length > 0);
  assert.deepEqual(validateInputs(GOOD), []);
  assert.throws(() => generateMarketingKit({ ...GOOD, brandName: "" }));
});

test("export to markdown and json works", () => {
  const kit = generateMarketingKit(GOOD);
  const md = kitToMarkdown(kit);
  assert.ok(md.includes("## Social posts"));
  assert.ok(md.includes("## 14-day campaign calendar"));
  assert.ok(md.includes(SIMULATED_LABEL));
  const parsed = JSON.parse(kitToJson(kit));
  assert.equal(parsed.posts.length, 10);
});

// A/B rule: at least 10 votes and 60% for one version.
test("A/B result follows the winner rule", () => {
  assert.equal(abResult({ A: 0, B: 0 }).winner, null);
  assert.equal(abResult({ A: 6, B: 3 }).winner, null); // only 9 votes
  assert.equal(abResult({ A: 7, B: 3 }).winner, "A"); // 10 votes, 70%
  assert.equal(abResult({ A: 3, B: 8 }).winner, "B");
  assert.equal(abResult({ A: 6, B: 5 }).message, "No clear winner."); // 55% is not enough
  const r = abResult({ A: 1, B: 2 });
  assert.equal(r.pctA + r.pctB, 100);
});

// Tests for the Week 6 venture data and engine. Run with: npm test
// Uses the built-in Node test runner, so no extra packages are needed.

import test from "node:test";
import assert from "node:assert/strict";
import {
  NAV_LINKS,
  AGENTS,
  WALKTHROUGH,
  IMPACT_CHECKS,
  ROADMAP,
} from "./ventureData.js";
import { validateFeedback, summarizeFeedback } from "./ventureEngine.js";

const good = {
  tester: "Vale L.",
  finished: true,
  usefulness: 4,
  helped: "yes",
  wouldUse: "maybe",
  comment: "It helped me pick what to study first.",
};

test("valid feedback is accepted and cleaned", () => {
  const result = validateFeedback({ ...good, tester: "  Vale L. ", usefulness: "4" });
  assert.equal(result.ok, true);
  assert.equal(result.value.tester, "Vale L.");
  assert.equal(result.value.usefulness, 4);
});

test("empty initials, bad rating and missing answers are rejected", () => {
  const result = validateFeedback({ tester: "", usefulness: 7, helped: "maybe" });
  assert.equal(result.ok, false);
  assert.ok(result.errors.tester);
  assert.ok(result.errors.finished);
  assert.ok(result.errors.usefulness);
  assert.ok(result.errors.helped);
  assert.equal(validateFeedback({ ...good, usefulness: 0 }).ok, false);
  assert.equal(validateFeedback({ ...good, usefulness: 2.5 }).ok, false);
});

test("emails and phone numbers are rejected in the comment and in the initials", () => {
  assert.equal(validateFeedback({ ...good, comment: "write me at ana@mail.com" }).ok, false);
  assert.equal(validateFeedback({ ...good, comment: "call 55 1234 5678" }).ok, false);
  assert.equal(validateFeedback({ ...good, tester: "ana@mail.com" }).ok, false);
  assert.equal(validateFeedback({ ...good, comment: "x".repeat(501) }).ok, false);
});

test("summary with 0 rows has no invented numbers", () => {
  const s = summarizeFeedback([]);
  assert.equal(s.total, 0);
  assert.equal(s.avgUsefulness, null);
  assert.equal(s.helpedPercent, null);
});

test("summary with real rows counts and averages correctly", () => {
  const s = summarizeFeedback([
    { finished: true, usefulness: 5, helped: "yes" },
    { finished: true, usefulness: 4, helped: "some" },
    { finished: false, usefulness: 3, helped: "no" },
    { finished: true, usefulness: 4, helped: "yes" },
  ]);
  assert.equal(s.total, 4);
  assert.equal(s.finished, 3);
  assert.equal(s.avgUsefulness, 4);
  assert.equal(s.helpedYes, 2);
  assert.equal(s.helpedSome, 1);
  assert.equal(s.helpedNo, 1);
  assert.equal(s.helpedPercent, 50);
});

test("walkthrough has 7 steps and every step and agent link is in the navigation", () => {
  assert.equal(WALKTHROUGH.length, 7);
  const hrefs = NAV_LINKS.map((l) => l.href);
  for (const step of WALKTHROUGH) {
    assert.ok(hrefs.includes(step.href), `step ${step.id} links to ${step.href}`);
    assert.ok(step.instruction && step.expected);
  }
  assert.equal(AGENTS.length, 6);
  for (const agent of AGENTS) {
    assert.ok(hrefs.includes(agent.href), `${agent.name} links to ${agent.href}`);
    assert.ok(["Simulated", "Rule-based", "Calculator", "Manual log", "Static"].includes(agent.mode));
  }
});

test("impact check and roadmap are complete", () => {
  assert.ok(IMPACT_CHECKS.harm.length >= 5);
  assert.ok(IMPACT_CHECKS.value.length >= 3);
  assert.ok(IMPACT_CHECKS.viability.length >= 3);
  assert.ok(ROADMAP.length >= 5);
  for (const item of ROADMAP) {
    assert.ok(["Now", "Next", "Later"].includes(item.stage));
    assert.ok(item.reason.length > 20);
  }
});

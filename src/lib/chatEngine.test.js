// Tests for the chat engine. Run with: npm test
// Uses the built-in Node test runner, so no extra packages are needed.

import test from "node:test";
import assert from "node:assert/strict";
import {
  INTAKE_QUESTIONS,
  validateAnswer,
  checkGuardrails,
  buildStudyPlan,
  summarizeSession,
} from "./chatEngine.js";

test("there are exactly 3 intake questions", () => {
  assert.equal(INTAKE_QUESTIONS.length, 3);
  assert.deepEqual(INTAKE_QUESTIONS.map((q) => q.id), ["subject", "days", "hours"]);
});

test("valid answers are accepted", () => {
  assert.deepEqual(validateAnswer("subject", " Math "), { ok: true, value: "Math" });
  assert.deepEqual(validateAnswer("days", "7"), { ok: true, value: 7 });
  assert.deepEqual(validateAnswer("days", "10 days"), { ok: true, value: 10 });
  assert.deepEqual(validateAnswer("hours", "2"), { ok: true, value: 2 });
  assert.deepEqual(validateAnswer("hours", "1.5 hours"), { ok: true, value: 1.5 });
});

test("invalid answers are rejected with a message", () => {
  assert.equal(validateAnswer("subject", "").ok, false);
  assert.equal(validateAnswer("subject", "1234").ok, false);
  assert.equal(validateAnswer("days", "0").ok, false);
  assert.equal(validateAnswer("days", "500").ok, false);
  assert.equal(validateAnswer("days", "soon").ok, false);
  assert.equal(validateAnswer("hours", "25").ok, false);
  assert.equal(validateAnswer("hours", "0").ok, false);
  assert.ok(validateAnswer("days", "0").error.length > 0);
});

test("guardrail blocks cheating and grade promises", () => {
  const cheat = checkGuardrails("Give me the exam answers");
  assert.equal(cheat.type, "blocked");
  assert.equal(cheat.category, "cheating");
  assert.ok(cheat.message.length > 0);
  assert.equal(checkGuardrails("Can you guarantee I will pass?").type, "blocked");
  assert.equal(checkGuardrails("write my essay for me").type, "blocked");
});

test("guardrail blocks personal data", () => {
  assert.equal(checkGuardrails("my email is ana@example.com").category, "personal data");
  assert.equal(checkGuardrails("my phone is 5512345678").type, "blocked");
});

test("distress and requests for a person go to the human checkpoint", () => {
  const sad = checkGuardrails("I feel hopeless about my exams");
  assert.equal(sad.type, "human");
  assert.ok(sad.message.includes("800 911 2000"));
  assert.ok(sad.message.includes("911"));
  assert.equal(checkGuardrails("I want to talk to a real person").type, "human");
  assert.equal(checkGuardrails("quiero morir").type, "human");
});

test("off-topic is detected only when a study topic is required", () => {
  assert.equal(checkGuardrails("what is the best pizza in town").type, "ok");
  assert.equal(checkGuardrails("what is the best pizza in town", { requireStudyTopic: true }).type, "offtopic");
  assert.equal(checkGuardrails("any tips to focus while I study?", { requireStudyTopic: true }).type, "ok");
});

test("a normal message passes the guardrails", () => {
  assert.equal(checkGuardrails("Math").type, "ok");
  assert.equal(checkGuardrails("").type, "ok");
});

test("a study plan is built from valid answers", () => {
  const plan = buildStudyPlan({ subject: "Math", days: 3, hours: 2 });
  assert.equal(plan.lines.length, 3);
  assert.ok(plan.title.includes("Math"));
  assert.ok(plan.summary.includes("6 h"));
  assert.equal(plan.simulated, true);
  assert.ok(plan.lines[0].text.includes("1 h")); // 50% of 2 hours
});

test("a long plan stays short (7 lines at most)", () => {
  const plan = buildStudyPlan({ subject: "Chemistry", days: 30, hours: 1 });
  assert.equal(plan.lines.length, 7);
  assert.equal(buildStudyPlan({ subject: "Law", days: 1, hours: 3 }).lines.length, 1);
});

test("session summaries are short and clear", () => {
  assert.equal(
    summarizeSession({ answers: { subject: "Math", days: 7, hours: 2 }, outcome: "plan" }),
    "Plan: Math, 7 days, 2 h/day"
  );
  assert.ok(summarizeSession({ answers: {}, outcome: "blocked", category: "cheating" }).includes("cheating"));
  assert.ok(summarizeSession({ answers: {}, outcome: "human" }).startsWith("Human checkpoint"));
});

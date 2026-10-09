// Tests for the pricing engine. Run with: npm test
// Uses the built-in Node test runner, so no extra packages are needed.

import test from "node:test";
import assert from "node:assert/strict";
import { calcRevenue, validateInputs } from "./pricingEngine.js";
import { SCENARIOS } from "./pricingData.js";

// Pricing test 1: individual students.
// 1,000 users, 70% Free / 20% Plus / 10% Pro.
// Monthly = (200 x 79) + (100 x 149) = 15,800 + 14,900 = 30,700.
test("pricing 1: individual students revenue is correct", () => {
  const result = calcRevenue({
    users: 1000,
    freePct: 70,
    plusPct: 20,
    proPct: 10,
    schools: 0,
    seatsPerSchool: 0,
    pricePerSeat: 99,
  });
  assert.equal(result.ok, true);
  assert.equal(result.individual.freeUsers, 700);
  assert.equal(result.individual.plusUsers, 200);
  assert.equal(result.individual.proUsers, 100);
  assert.equal(result.monthly, 30700);
  assert.equal(result.annual, 368400);
});

// Pricing test 2: B2B only.
// 2 schools x 300 seats x 99 = 59,400 per month; x 12 = 712,800 per year.
test("pricing 2: B2B school seats revenue is correct", () => {
  const result = calcRevenue({
    users: 0,
    freePct: 100,
    plusPct: 0,
    proPct: 0,
    schools: 2,
    seatsPerSchool: 300,
    pricePerSeat: 99,
  });
  assert.equal(result.ok, true);
  assert.equal(result.b2b.seats, 600);
  assert.equal(result.monthly, 59400);
  assert.equal(result.annual, 712800);
});

// Extra: the "expected" preset adds both segments (30,700 + 59,400).
test("expected preset combines both segments", () => {
  const result = calcRevenue(SCENARIOS.expected.inputs);
  assert.equal(result.monthly, 90100);
  assert.equal(result.annual, 1081200);
});

// Extra: a split that is not 100% must be blocked.
test("invalid split (not 100%) is blocked", () => {
  const inputs = { ...SCENARIOS.expected.inputs, freePct: 50 };
  assert.ok(validateInputs(inputs).length > 0);
  const result = calcRevenue(inputs);
  assert.equal(result.ok, false);
});

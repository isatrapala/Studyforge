// src/lib/pricingEngine.js
//
// Pure functions for the pricing simulator. No React, no Supabase, no
// browser APIs, so they can be tested directly with `npm test`.

import { TIERS } from "./pricingData.js";

const PRICE = Object.fromEntries(TIERS.map((t) => [t.id, t.priceMonthly]));

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

// Returns a list of error messages. An empty list means the inputs are valid.
export function validateInputs(inputs) {
  const errors = [];
  const fields = ["users", "freePct", "plusPct", "proPct", "schools", "seatsPerSchool", "pricePerSeat"];

  for (const field of fields) {
    const n = toNumber(inputs[field]);
    if (Number.isNaN(n) || n < 0) {
      errors.push(`${field} must be a number that is 0 or more.`);
    }
  }
  if (errors.length > 0) return errors;

  const split = toNumber(inputs.freePct) + toNumber(inputs.plusPct) + toNumber(inputs.proPct);
  if (Math.round(split * 100) !== 10000) {
    errors.push(`Free + Plus + Pro must add up to 100% (now ${split}%).`);
  }
  return errors;
}

// Individual students: Free pays 0, Plus and Pro pay their monthly price.
export function calcIndividual(inputs) {
  const users = Math.round(toNumber(inputs.users));
  const plusUsers = Math.round((users * toNumber(inputs.plusPct)) / 100);
  const proUsers = Math.round((users * toNumber(inputs.proPct)) / 100);
  const freeUsers = users - plusUsers - proUsers;
  const monthly = plusUsers * PRICE.plus + proUsers * PRICE.pro;
  return { users, freeUsers, plusUsers, proUsers, monthly };
}

// Universities and schools: schools x seats x price per seat.
export function calcB2B(inputs) {
  const seats = Math.round(toNumber(inputs.schools)) * Math.round(toNumber(inputs.seatsPerSchool));
  const monthly = seats * toNumber(inputs.pricePerSeat);
  return { seats, monthly };
}

// Full result. Annual = monthly x 12 (no churn, no growth, no discounts).
export function calcRevenue(inputs) {
  const errors = validateInputs(inputs);
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  const individual = calcIndividual(inputs);
  const b2b = calcB2B(inputs);
  const monthly = individual.monthly + b2b.monthly;
  return {
    ok: true,
    errors: [],
    individual,
    b2b,
    monthly,
    annual: monthly * 12,
  };
}

export function formatMXN(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

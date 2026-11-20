// src/lib/ventureEngine.js
//
// Pure functions for Week 6: validate the /demo feedback form and summarize
// the real feedback rows. No React and no database, so they are tested with
// npm test.

const HELPED = ["yes", "some", "no"];
const WOULD_USE = ["yes", "maybe", "no"];

const EMAIL = /\S+@\S+\.\S+/;
// 7 or more digits, even with spaces, dots, dashes or brackets in between.
const PHONE = /(?:\d[\s\-().]*){7,}/;
const INITIALS = /^[\p{L}][\p{L} .'-]{0,19}$/u;

export function looksLikePersonalData(text) {
  const value = String(text ?? "");
  return EMAIL.test(value) || PHONE.test(value);
}

// Returns { ok: true, value } or { ok: false, errors } where errors maps a
// field name to a short message.
export function validateFeedback(input = {}) {
  const errors = {};

  const tester = String(input.tester ?? "").trim();
  if (!tester) {
    errors.tester = "Write your initials.";
  } else if (!INITIALS.test(tester) || looksLikePersonalData(tester)) {
    errors.tester = "Use initials only (up to 20 letters), no email or phone.";
  }

  if (typeof input.finished !== "boolean") {
    errors.finished = "Tell us if you finished the 7 steps.";
  }

  const usefulnessNumber = Number(input.usefulness);
  if (
    input.usefulness === "" ||
    input.usefulness === null ||
    input.usefulness === undefined ||
    !Number.isInteger(usefulnessNumber) ||
    usefulnessNumber < 1 ||
    usefulnessNumber > 5
  ) {
    errors.usefulness = "Pick a number from 1 to 5.";
  }

  if (!HELPED.includes(input.helped)) {
    errors.helped = "Pick yes, a little or no.";
  }

  const wouldUse = input.wouldUse ? input.wouldUse : null;
  if (wouldUse !== null && !WOULD_USE.includes(wouldUse)) {
    errors.wouldUse = "Pick yes, maybe or no.";
  }

  const comment = String(input.comment ?? "").trim();
  if (comment.length > 500) {
    errors.comment = "Keep the comment under 500 characters.";
  } else if (looksLikePersonalData(comment)) {
    errors.comment = "Please remove emails and phone numbers from the comment.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    value: {
      tester,
      finished: input.finished,
      usefulness: usefulnessNumber,
      helped: input.helped,
      wouldUse,
      comment,
    },
  };
}

// Turns real feedback rows into the numbers shown on /demo and /dashboard.
// With no rows, every average or percent is null (the page says "No data yet").
export function summarizeFeedback(rows = []) {
  const list = Array.isArray(rows) ? rows : [];
  const total = list.length;
  if (total === 0) {
    return {
      total: 0,
      finished: 0,
      avgUsefulness: null,
      helpedYes: 0,
      helpedSome: 0,
      helpedNo: 0,
      helpedPercent: null,
    };
  }
  const finished = list.filter((r) => r.finished === true).length;
  const sum = list.reduce((acc, r) => acc + Number(r.usefulness || 0), 0);
  const helpedYes = list.filter((r) => r.helped === "yes").length;
  const helpedSome = list.filter((r) => r.helped === "some").length;
  const helpedNo = list.filter((r) => r.helped === "no").length;
  return {
    total,
    finished,
    avgUsefulness: Math.round((sum / total) * 10) / 10,
    helpedYes,
    helpedSome,
    helpedNo,
    helpedPercent: Math.round((helpedYes / total) * 100),
  };
}

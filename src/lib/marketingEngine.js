// src/lib/marketingEngine.js
//
// Pure functions for the Marketing Engine. No React, no Supabase, no browser
// APIs, so they can be tested directly with `npm test`.
//
// IMPORTANT: this is NOT an AI model. The kit is built from fixed templates
// and the inputs the user typed. It is always labeled as simulated output.

import { TONES, AB_MIN_VOTES, AB_WIN_SHARE } from "./brandData.js";

export const SIMULATED_LABEL = "Simulated output (templates, no AI API)";

const STYLES = {
  Friendly: { open: "Hey!", close: "You've got this." },
  Motivating: { open: "Ready?", close: "Small steps add up." },
  Professional: { open: "Introducing", close: "Study with a clear plan." },
  Funny: { open: "Plot twist:", close: "Your future self says thanks." },
};

function clean(value) {
  return String(value ?? "").trim();
}

// Remove a final dot so templates can add their own punctuation.
function noDot(text) {
  return clean(text).replace(/[.!?\s]+$/, "");
}

// Lowercase the first letter when the text goes in the middle of a sentence
// ("StudyForge AI: a study planner..."). Keep it if the second letter is also
// a capital, like "AI tool" or "UNAM app".
function lowerFirst(text) {
  if (text.length > 1 && text[1] === text[1].toUpperCase() && /[A-Z]/.test(text[1])) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function toHashtag(brandName) {
  const word = clean(brandName).replace(/[^a-zA-Z0-9]/g, "");
  return word ? `#${word}` : "#Study";
}

// Returns a list of error messages. An empty list means the inputs are valid.
export function validateInputs(inputs) {
  const errors = [];
  const brandName = clean(inputs?.brandName);
  const productLine = clean(inputs?.productLine);
  const tone = clean(inputs?.tone);

  if (!brandName) errors.push("Brand name is required.");
  else if (brandName.length > 40) errors.push("Brand name must be 40 characters or less.");

  if (!productLine) errors.push("Product description is required.");
  else if (productLine.length > 140) errors.push("Product description must be 140 characters or less.");

  if (!TONES.includes(tone)) errors.push("Choose a tone from the list.");

  return errors;
}

function buildPosts(b, p, pm, s, tag) {
  const base = [
    ["Instagram", `${s.open} Meet ${b}. ${p}.`],
    ["TikTok", `POV: exam week is close and your notes are a mess. ${b}: ${pm}.`],
    ["WhatsApp", `Send this to the friend who studies everything the night before. ${b}: ${pm}.`],
    ["X", `Studying more is not the same as studying better. ${b}: ${pm}.`],
    ["Instagram", `Three steps: tell us what you need, get a plan, stay on track. That is ${b}.`],
    ["TikTok", `Question for university students in Mexico: how do you pick what to study first? ${b} is built for that. ${p}.`],
    ["WhatsApp", `Study group tip: share one clear plan, not ten sets of notes. Try ${b}.`],
    ["X", `We are a student project and we want honest feedback. Try ${b} and tell us what to fix.`],
    ["Instagram", `A clear plan means less stress before exams. ${b}: ${pm}. ${s.close}`],
    ["TikTok", `Which headline do you like more? Vote on our site and help us choose. ${b}. ${s.close}`],
  ];
  return base.map(([channel, text], i) => ({
    id: `post-${i + 1}`,
    channel,
    text,
    hashtags: [tag, "#StudyTips", "#UniversityMexico"],
  }));
}

function buildScripts(b, pm, s) {
  return [
    {
      id: "script-1",
      title: "From messy notes to a plan",
      seconds: 30,
      hook: "Your notes are a mess and the exam is close.",
      body: `Show a screen full of long, messy notes. Then show ${b}. Say: ${pm}. Show the plan on screen.`,
      cta: `Try ${b} with your own notes. ${s.close}`,
    },
    {
      id: "script-2",
      title: "Study the core first",
      seconds: 30,
      hook: "Stop studying everything.",
      body: `Say that most exams have a few core ideas. Show how ${b} helps you find them first. Say: ${pm}.`,
      cta: `Open ${b} and start with the core.`,
    },
    {
      id: "script-3",
      title: "A student project",
      seconds: 30,
      hook: "We are students building a tool for students.",
      body: `Say what you are building: ${pm}. Say clearly that it is a student project and that feedback is welcome.`,
      cta: "Vote on our headline and tell us what to improve.",
    },
  ];
}

// 14 rows. Every row points to a real piece in the kit by id.
function buildCalendar() {
  const rows = [
    ["landing", "Website", "Launch the landing page", "Get first visits"],
    ["post-1", "Instagram", "Introduce the product", "Get awareness"],
    ["script-1", "TikTok", "Show messy notes to a plan", "Get views"],
    ["post-2", "TikTok", "Exam week pain point", "Get views"],
    ["post-3", "WhatsApp", "Share with a friend", "Get shares"],
    ["post-4", "X", "Study better, not more", "Get replies"],
    ["post-5", "Instagram", "Explain the 3 steps", "Get understanding"],
    ["script-2", "TikTok", "Study the core first", "Get views"],
    ["post-6", "TikTok", "Ask students a question", "Get comments"],
    ["post-7", "WhatsApp", "Study group tip", "Get shares"],
    ["post-8", "X", "Ask for honest feedback", "Get feedback"],
    ["script-3", "Instagram", "Student project story", "Build trust"],
    ["post-9", "Instagram", "Less stress before exams", "Get clicks"],
    ["post-10", "TikTok", "Ask for A/B votes", "Get votes"],
  ];
  return rows.map(([piece, channel, content, goal], i) => ({
    day: i + 1,
    channel,
    piece,
    content,
    goal,
  }));
}

// Builds the whole kit from the inputs. Throws if the inputs are not valid.
export function generateMarketingKit(inputs) {
  const errors = validateInputs(inputs);
  if (errors.length > 0) throw new Error(errors.join(" "));

  const b = clean(inputs.brandName);
  const p = noDot(inputs.productLine);
  const tone = clean(inputs.tone);
  const s = STYLES[tone];
  const tag = toHashtag(b);

  return {
    simulated: true,
    label: SIMULATED_LABEL,
    inputs: { brandName: b, productLine: p, tone },
    landing: {
      headline: `Meet ${b}`,
      subheadline: `${p}.`,
      benefits: [
        "Know what to study first.",
        "Spend less time sorting messy notes.",
        "Go into exam week with a clear plan.",
      ],
      buttonText: `Try ${b}`,
      faq: [
        { q: `What is ${b}?`, a: `${p}.` },
        { q: "Who is it for?", a: "University students in Mexico." },
        { q: "How do I start?", a: "Click the button and try it with your own notes." },
      ],
    },
    posts: buildPosts(b, p, lowerFirst(p), s, tag),
    scripts: buildScripts(b, lowerFirst(p), s),
    calendar: buildCalendar(),
  };
}

// --- Text helpers used by the Copy and Save buttons ---

export function postToText(post) {
  return `${post.text}\n${post.hashtags.join(" ")}`;
}

export function scriptToText(script) {
  return `${script.title} (${script.seconds} seconds)\nHook: ${script.hook}\nBody: ${script.body}\nCall to action: ${script.cta}`;
}

export function landingToText(landing) {
  const benefits = landing.benefits.map((x) => `- ${x}`).join("\n");
  const faq = landing.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n");
  return `${landing.headline}\n${landing.subheadline}\n\nBenefits:\n${benefits}\n\nButton: ${landing.buttonText}\n\nFAQ:\n${faq}`;
}

export function calendarToText(calendar) {
  return calendar
    .map((r) => `Day ${r.day} | ${r.channel} | ${r.content} (${r.piece}) | Goal: ${r.goal}`)
    .join("\n");
}

// --- Export ---

export function kitToMarkdown(kit) {
  const lines = [];
  lines.push(`# Marketing kit: ${kit.inputs.brandName}`);
  lines.push("");
  lines.push(`_${kit.label}_`);
  lines.push("");
  lines.push("## Landing page copy");
  lines.push("");
  lines.push(`**${kit.landing.headline}**`);
  lines.push(kit.landing.subheadline);
  lines.push("");
  kit.landing.benefits.forEach((x) => lines.push(`- ${x}`));
  lines.push("");
  lines.push(`Button: ${kit.landing.buttonText}`);
  lines.push("");
  kit.landing.faq.forEach((f) => {
    lines.push(`**${f.q}**`);
    lines.push(f.a);
    lines.push("");
  });
  lines.push("## Social posts");
  lines.push("");
  kit.posts.forEach((p, i) => {
    lines.push(`${i + 1}. (${p.channel}) ${p.text} ${p.hashtags.join(" ")}`);
  });
  lines.push("");
  lines.push("## Video scripts");
  lines.push("");
  kit.scripts.forEach((s) => {
    lines.push(`### ${s.title} (${s.seconds} seconds)`);
    lines.push(`- Hook: ${s.hook}`);
    lines.push(`- Body: ${s.body}`);
    lines.push(`- Call to action: ${s.cta}`);
    lines.push("");
  });
  lines.push("## 14-day campaign calendar");
  lines.push("");
  lines.push("| Day | Channel | Content | Piece | Goal |");
  lines.push("| --- | --- | --- | --- | --- |");
  kit.calendar.forEach((r) => {
    lines.push(`| ${r.day} | ${r.channel} | ${r.content} | ${r.piece} | ${r.goal} |`);
  });
  lines.push("");
  return lines.join("\n");
}

export function kitToJson(kit) {
  return JSON.stringify(kit, null, 2);
}

// --- A/B test result ---
//
// counts = { A: number, B: number }.
// A winner needs at least AB_MIN_VOTES votes and AB_WIN_SHARE for one version.
export function abResult(counts) {
  const a = Number(counts?.A) || 0;
  const b = Number(counts?.B) || 0;
  const total = a + b;
  const pctA = total === 0 ? 0 : Math.round((a / total) * 100);
  const pctB = total === 0 ? 0 : 100 - pctA;

  let winner = null;
  let message = "";
  if (total < AB_MIN_VOTES) {
    message = `Not enough votes yet (${total} of ${AB_MIN_VOTES}).`;
  } else if (a / total >= AB_WIN_SHARE) {
    winner = "A";
    message = "Version A is the winner.";
  } else if (b / total >= AB_WIN_SHARE) {
    winner = "B";
    message = "Version B is the winner.";
  } else {
    message = "No clear winner.";
  }
  return { a, b, total, pctA, pctB, winner, message };
}

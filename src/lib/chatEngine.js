// src/lib/chatEngine.js
//
// Pure functions for the guided assistant on /chat. No React, no Supabase, no
// browser APIs, so they can be tested directly with `npm test`.
//
// IMPORTANT: this is NOT an AI model. It is a set of fixed rules and templates.
// The page always labels it as simulated.

export const SIMULATED_LABEL = "Guided assistant (simulated, no AI API)";

export const INTAKE_QUESTIONS = [
  { id: "subject", text: "What subject or topic is your exam about?", hint: "For example: Math. For a more specific plan, add topics after a colon: Economics: inflation, GDP, supply" },
  { id: "days", text: "How many days until your exam?", hint: "A whole number from 1 to 60" },
  { id: "hours", text: "How many hours per day can you study?", hint: "A number from 0.5 to 12" },
];

export const HUMAN_HELP_TEXT =
  "If you feel you are in danger or might hurt yourself, call 911 now. In Mexico you can also call Linea de la Vida at 800 911 2000.";

// Returns { ok: true, value } or { ok: false, error }.
export function validateAnswer(stepId, text) {
  const raw = String(text ?? "").trim();

  if (stepId === "subject") {
    if (raw.length < 2) return { ok: false, error: "Please write the subject or topic (at least 2 letters)." };
    if (raw.length > 120) return { ok: false, error: "Please keep the subject and topics under 120 characters." };
    if (!/[a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(raw)) return { ok: false, error: "The subject needs some letters, for example \"Math\"." };
    return { ok: true, value: raw };
  }

  if (stepId === "days") {
    const match = raw.match(/^\s*(\d{1,3})\s*(days?|dias|días)?\s*$/i);
    if (!match) return { ok: false, error: "Please write a whole number of days, for example 7." };
    const days = Number(match[1]);
    if (days < 1 || days > 60) return { ok: false, error: "Days must be between 1 and 60." };
    return { ok: true, value: days };
  }

  if (stepId === "hours") {
    const match = raw.match(/^\s*(\d{1,2}(?:[.,]\d)?)\s*(h|hr|hrs|hours?|horas?)?\s*$/i);
    if (!match) return { ok: false, error: "Please write the hours per day as a number, for example 2 or 1.5." };
    const hours = Number(match[1].replace(",", "."));
    if (hours < 0.5 || hours > 12) return { ok: false, error: "Hours per day must be between 0.5 and 12." };
    return { ok: true, value: hours };
  }

  return { ok: false, error: "Unknown question." };
}

// --- Guardrails ---

const HUMAN_PATTERNS = [
  /suicid/, /kill myself/, /end my life/, /want to die/, /hurt myself/, /self[- ]?harm/,
  /hopeless/, /can'?t go on/, /no point (in|to)/, /panic attack/, /give up on (everything|life)/,
  /talk to (a )?(real )?(person|human)/, /real person/, /speak to (a )?human/,
  /quiero morir/, /quitarme la vida/, /sin esperanza/, /no puedo m[aá]s/, /hablar con una persona/,
];

const BLOCKED_RULES = [
  { category: "cheating", patterns: [/exam answers/, /answers? (to|for) (the|my) (exam|test|quiz)/, /\bcheat/, /do my homework/, /write my (essay|thesis|paper)/, /plagiar/, /respuestas del examen/, /hacer trampa/, /copiar en el examen/] },
  { category: "grades", patterns: [/guarantee/, /promise me/, /will i (pass|get an? [a-z])/, /sure (to )?pass/, /garantiz/] },
  { category: "medical or legal advice", patterns: [/diagnos/, /medication/, /prescri/, /adderall/, /ritalin/, /lawsuit/, /legal advice/, /medicamento/] },
  { category: "harmful or illegal", patterns: [/\bbomb\b/, /\bweapon/, /buy drugs/, /\bhack (into|a|the)/, /steal/] },
];

const PERSONAL_DATA_PATTERNS = [
  /[\w.+-]+@[\w-]+\.[\w.]+/, // email
  /\b\d{10,}\b/, // phone or card number
  /password|contrase[nñ]a/,
];

const STUDY_WORDS = [
  "study", "exam", "test", "quiz", "class", "subject", "topic", "notes", "learn", "review", "plan",
  "schedule", "course", "lecture", "revise", "memor", "focus", "hours", "days", "tips", "read",
  "pomodoro", "homework", "teacher", "professor", "semester", "estudi", "examen", "clase", "tarea",
];

const REPLIES = {
  human:
    "I am really sorry you are going through this. I am only a simple study helper, and I cannot give you the support you deserve. " +
    "Please talk to a person you trust, or your university student services. " + HUMAN_HELP_TEXT + " I am pausing the study plan for now.",
  personal:
    "Please do not share personal data here (emails, phone numbers, card numbers or passwords). I do not need it, so I will not use it. You can start again without it.",
  offtopic:
    "I can only help with study plans for exams. Tell me about your exam and I will make a simple plan. Start over to try again.",
};

function blockedReply(category) {
  return `I cannot help with that (${category}). I can help you make a study plan so you feel more ready. Start over to try again.`;
}

// Returns { type: "ok" | "offtopic" | "blocked" | "human", category?, message? }.
// Set options.requireStudyTopic to true for free messages outside the 3 questions.
export function checkGuardrails(text, options = {}) {
  const t = String(text ?? "").toLowerCase().trim();
  if (!t) return { type: "ok" };

  if (HUMAN_PATTERNS.some((re) => re.test(t))) {
    return { type: "human", category: "human checkpoint", message: REPLIES.human };
  }
  for (const rule of BLOCKED_RULES) {
    if (rule.patterns.some((re) => re.test(t))) {
      return { type: "blocked", category: rule.category, message: blockedReply(rule.category) };
    }
  }
  if (PERSONAL_DATA_PATTERNS.some((re) => re.test(t))) {
    return { type: "blocked", category: "personal data", message: REPLIES.personal };
  }
  if (options.requireStudyTopic && !STUDY_WORDS.some((w) => t.includes(w))) {
    return { type: "offtopic", category: "off-topic", message: REPLIES.offtopic };
  }
  return { type: "ok" };
}

// --- Study plan (templates, no AI) ---

function round5(minutes) {
  return Math.max(5, Math.round(minutes / 5) * 5);
}

function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

// "Economics: inflation, GDP and supply" -> { subject: "Economics", topics: ["inflation", "GDP", "supply"] }
export function parseSubject(value) {
  const raw = String(value ?? "").trim();
  const colon = raw.indexOf(":");
  if (colon === -1) return { subject: raw, topics: [] };
  const subject = raw.slice(0, colon).trim() || raw;
  const topics = raw
    .slice(colon + 1)
    .split(/,|;|\band\b|\by\b/i)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => t.slice(0, 40))
    .slice(0, 6);
  return { subject, topics };
}

// answers = { subject, days, hours }. Returns a simple plan made from templates.
// If the subject has topics ("Economics: inflation, GDP"), each day names a topic.
export function buildStudyPlan(answers) {
  const { subject, topics } = parseSubject(answers.subject);
  const days = Number(answers.days);
  const hours = Number(answers.hours);
  const dayMinutes = Math.round(hours * 60);

  const core = round5(dayMinutes * 0.5);
  const practice = round5(dayMinutes * 0.3);
  const recap = round5(dayMinutes * 0.2);

  const phases = [
    { name: "Learn the core ideas", detail: (l) => `Read your notes for ${l} and write the key ideas in your own words (${formatMinutes(core)}). Then do a few practice questions (${formatMinutes(practice)}) and a short recap (${formatMinutes(recap)}).` },
    { name: "Practice and recall", detail: (l) => `Do practice questions on ${l} (${formatMinutes(core)}), then close the notes and try to explain the key ideas from memory (${formatMinutes(practice)}). Write down what you missed (${formatMinutes(recap)}).` },
    { name: "Review and rest", detail: (l) => `Review what you missed in ${l} (${formatMinutes(core)}), do one timed practice set (${formatMinutes(practice)}) and a light recap (${formatMinutes(recap)}). Sleep well.` },
  ];

  const phaseFor = (dayIndex) => {
    if (days === 1) return phases[0];
    const share = dayIndex / (days - 1); // 0 to 1
    if (dayIndex === days - 1) return phases[2];
    return share < 0.5 ? phases[0] : phases[1];
  };

  // Label for a day: the topic of that day if there are topics, else the subject.
  // The last day reviews all topics together.
  const labelFor = (dayIndex, isLast) => {
    if (topics.length === 0) return subject;
    if (isLast && days > 1) return `${subject} (all topics: ${topics.join(", ")})`;
    return `${topics[dayIndex % topics.length]} (${subject})`;
  };

  const lines = [];
  if (days <= 7) {
    for (let i = 0; i < days; i++) {
      const phase = phaseFor(i);
      lines.push({ day: `Day ${i + 1}`, text: `${phase.name}: ${phase.detail(labelFor(i, i === days - 1))}` });
    }
  } else {
    // Group the days into 7 stages so the plan stays short.
    const size = days / 7;
    for (let st = 0; st < 7; st++) {
      const start = Math.floor(st * size);
      const end = Math.max(start, Math.floor((st + 1) * size) - 1);
      const label = start === end ? `Day ${start + 1}` : `Days ${start + 1}-${end + 1}`;
      const phase = phaseFor(end);
      lines.push({ day: label, text: `${phase.name}: ${phase.detail(labelFor(st, end === days - 1))}` });
    }
  }

  const totalHours = Math.round(days * hours * 10) / 10;
  return {
    title: `Study plan for ${subject}`,
    days,
    hours,
    topics,
    lines,
    summary: `${days} ${days === 1 ? "day" : "days"} x ${hours} h = ${totalHours} h of study in total.`,
    note: "This is a simple template plan, not personal advice. Change it to fit you.",
    simulated: true,
  };
}

// --- Summary used when a session is saved ---

export function summarizeSession({ answers, outcome, category }) {
  if (outcome === "plan") {
    return `Plan: ${answers.subject}, ${answers.days} days, ${answers.hours} h/day`;
  }
  if (outcome === "human") return "Human checkpoint: the user was pointed to a person or service";
  if (outcome === "blocked") return `Blocked (${category || "unsafe request"})`;
  if (outcome === "offtopic") return "Off-topic message redirected";
  return "Session";
}

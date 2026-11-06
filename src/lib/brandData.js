// src/lib/brandData.js
//
// Static brand and marketing data for Week 4. No React, no Supabase, so it can
// be imported by the pages and by the tests.

export const BRAND = {
  name: "StudyForge AI",
  tagline: "Study the core first.",
  oneLiner: "A study planner that helps university students decide what to study first.",
  voiceWords: ["Simple", "Friendly", "Honest", "Focused"],
  colors: [
    { name: "Ink", hex: "#111111", use: "Text and main buttons" },
    { name: "Slate", hex: "#475569", use: "Secondary text" },
    { name: "Mist", hex: "#F1F5F9", use: "Cards and backgrounds" },
  ],
  dos: [
    "Use short sentences and simple words.",
    "Talk to one student at a time.",
    "Say it is a student project.",
  ],
  donts: [
    "Do not invent numbers, reviews or customer logos.",
    "Do not promise grades.",
    "Do not use hard words when a simple one works.",
  ],
};

// This is an archetype (a made-up example user), not a real person.
export const PERSONA = {
  label: "Archetype, not a real person",
  name: "Mariana",
  age: 20,
  profile: "4th-semester university student in Mexico.",
  situation: "Has exams every few weeks and her notes are long and messy.",
  goal: "Know what to study first so she does not study everything the night before.",
  painPoint: "Too much material and not enough time.",
  channels: ["Instagram", "TikTok", "WhatsApp"],
  objection: "I do not want to learn another app.",
};

export const TONES = ["Friendly", "Motivating", "Professional", "Funny"];

// The two A/B tests. test id is saved in ab_votes.test_id.
export const AB_TESTS = [
  {
    id: "headline",
    title: "Test 1: Homepage headline",
    question: "Which headline makes you want to try the app?",
    A: "Turn messy notes into a study plan",
    B: "Stop studying everything. Study the core first.",
  },
  {
    id: "cta",
    title: "Test 2: Button text",
    question: "Which button would you click?",
    A: "Try the Core Agent",
    B: "Make my study plan",
  },
];

// A winner needs at least this many votes and this share for one version.
export const AB_MIN_VOTES = 10;
export const AB_WIN_SHARE = 0.6;

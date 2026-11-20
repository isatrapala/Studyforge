// src/lib/ventureData.js
//
// Static content for Week 6 (the integrated venture): the shared navigation,
// the agent map, the /demo walkthrough, the impact check, the Version 2
// roadmap, the testing summary, the build logs and the prompt library.
//
// Rule for this file: only facts that exist in my own packets, my git history
// or my tests. Anything I do not know is written as null or "See the packet".
// No invented users, ratings or statistics.

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/core", label: "Core Agent" },
  { href: "/research", label: "Research" },
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/marketing", label: "Marketing" },
  { href: "/chat", label: "Chat" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/demo", label: "Demo" },
  { href: "/docs", label: "Docs" },
];

// mode: Simulated (templates, no AI API), Rule-based (plain rules),
// Calculator (math on my own assumptions), Manual log (people type entries),
// Static (a page with fixed content).
export const AGENTS = [
  {
    id: "core",
    name: "Core Agent",
    job: "Finds the core of messy notes.",
    input: "Messy topic or notes",
    output: "Core topic, key concepts, study order",
    table: "core_outputs",
    mode: "Simulated",
    href: "/core",
  },
  {
    id: "research",
    name: "Research",
    job: "Compares competitors and logs real research.",
    input: "Interview, survey or observation notes",
    output: "Risk map and research log",
    table: "research_outputs",
    mode: "Manual log",
    href: "/research",
  },
  {
    id: "product",
    name: "Product",
    job: "Shows the tiers, the features and the customer segments.",
    input: "Nothing (reference page)",
    output: "3 tiers, feature map, 2 segments",
    table: null,
    mode: "Static",
    href: "/product",
  },
  {
    id: "pricing",
    name: "Pricing",
    job: "Estimates revenue from my own assumptions.",
    input: "Users, plan mix, price",
    output: "Monthly and yearly revenue scenario",
    table: "pricing_scenarios",
    mode: "Calculator",
    href: "/pricing",
  },
  {
    id: "marketing",
    name: "Marketing Engine",
    job: "Builds a marketing kit and tests two A/B ideas.",
    input: "Brand name, product line, tone",
    output: "10 posts, 3 scripts, 14-day calendar, A/B votes",
    table: "marketing_assets, ab_votes",
    mode: "Simulated",
    href: "/marketing",
  },
  {
    id: "chat",
    name: "Guided Assistant",
    job: "Asks 3 questions and gives a study plan; refuses unsafe requests.",
    input: "Subject (and topics), days, hours per day",
    output: "Day-by-day plan, refusal or human checkpoint",
    table: "chat_sessions",
    mode: "Rule-based",
    href: "/chat",
  },
];

export const WALKTHROUGH = [
  {
    id: 1,
    title: "Core Agent: find the core of messy notes",
    instruction: "Paste a few lines of notes from any class, press generate and save the result.",
    href: "/core",
    expected: "A card with a core topic, key concepts and a study order, marked as simulated; the saved item appears in the list.",
  },
  {
    id: 2,
    title: "Research: see the market and the research log",
    instruction: "Look at the risk map and the competitors, then read the research log entries.",
    href: "/research",
    expected: "A risk map, global examples, direct competitors and the saved research entries.",
  },
  {
    id: 3,
    title: "Product: tiers, features and segments",
    instruction: "Read the 3 pricing tiers and the feature map.",
    href: "/product",
    expected: "Free, Plus and Pro tiers, a feature map and 2 customer segments.",
  },
  {
    id: 4,
    title: "Pricing: try a revenue scenario",
    instruction: "Pick a scenario, change one number and save the scenario with a name.",
    href: "/pricing",
    expected: "The revenue numbers change when you change an input; the saved scenario shows in the list.",
  },
  {
    id: 5,
    title: "Marketing: generate and copy content",
    instruction: "Press generate, copy one text (you do not post anything anywhere) and vote in one A/B test.",
    href: "/marketing",
    expected: "10 posts, 3 scripts and a 14-day calendar; the button says Copied; the A/B vote count goes up by one.",
  },
  {
    id: 6,
    title: "Chat: get a plan, then try a refusal",
    instruction: "Answer the 3 questions (try \"Economics: inflation, GDP, supply\"). Then Start over and type \"give me the exam answers\".",
    href: "/chat",
    expected: "A plan with one topic per day; then a polite refusal that offers a study plan instead.",
  },
  {
    id: 7,
    title: "Dashboard: see the saved records",
    instruction: "Open the dashboard and find what you just saved.",
    href: "/dashboard",
    expected: "A count and the latest records for every table, including what you saved in the earlier steps.",
  },
];

export const IMPACT_CHECKS = {
  value: [
    {
      text: "Turns messy notes into a short study order (Core Agent).",
      evidence: "Week 1 live page with saved outputs.",
    },
    {
      text: "Gives a day-by-day study plan in about a minute (Guided Assistant).",
      evidence: "Week 5: 3 of 3 external testers got a plan.",
    },
    {
      text: "Testers asked for more specific plans, so the assistant now takes exam topics.",
      evidence: "Week 5 iteration, commit a99fc15.",
    },
  ],
  harm: [
    {
      text: "Refuses cheating, grade promises, medical or legal advice, harmful requests and personal data.",
      evidence: "Week 5 software test and the chat engine unit tests.",
    },
    {
      text: "Stress or hopelessness stops the plan and points to real people and services, with no therapy and no claim that a team reads the chat.",
      evidence: "Week 5 software test (tested by me, not by outside testers).",
    },
    {
      text: "Every simulated agent says it is simulated.",
      evidence: "Labels on /core, /marketing and /chat; checked again in the Week 6 regression test.",
    },
    {
      text: "No personal data is stored. Testers use initials and the form rejects emails and phone numbers.",
      evidence: "validateFeedback unit tests.",
    },
    {
      text: "No invented numbers. The dashboard and the value numbers come from Supabase or from my own packets.",
      evidence: "Mockup placeholders were not copied into the app (see docs/week6/EVIDENCE.md).",
    },
    {
      text: "Known limit: the database is public (no login), so anyone could add rows or spam it.",
      evidence: "Listed in the Version 2 roadmap as login and limits.",
    },
  ],
  viability: [
    {
      text: "Running cost today is 0 MXN per month on free tiers (Vercel, Supabase, GitHub).",
      evidence: "No paid tools or APIs are used.",
    },
    {
      text: "Price ideas are Plus 79 MXN and Pro 149 MXN per month. They are my own assumptions, not market data, and no one has paid.",
      evidence: "See /pricing; saved scenarios are simulations.",
    },
    {
      text: "A real AI model would add a cost per use. I need to estimate it and add a spending limit before turning it on.",
      evidence: "Version 2 roadmap, Next.",
    },
  ],
};

export const ROADMAP = [
  {
    stage: "Now",
    title: "A dedicated exam-topics field in the chat",
    reason: "Week 5 testers asked for topics and more detail. Today topics only work after a colon, which needs an explanation.",
  },
  {
    stage: "Now",
    title: "Ask every tester to press a rating",
    reason: "In Week 5 only 1 of 3 testers rated. I need more ratings to know what works.",
  },
  {
    stage: "Next",
    title: "Login and limits",
    reason: "The database is public today. Login would let each student see only their own records and stop spam.",
  },
  {
    stage: "Next",
    title: "A real AI model behind a server route",
    reason: "All agents are simulated today. I would first estimate the cost per use and add a spending limit.",
  },
  {
    stage: "Later",
    title: "Study reminders",
    reason: "The mockup idea of staying on track. I have no test evidence for it yet, so it comes after the first four.",
  },
  {
    stage: "Later",
    title: "A pilot with one university",
    reason: "Seat pricing is only a simulation. I need real conversations with a school before I count on it.",
  },
];

// Real numbers only. null means "I do not have the number here"; the page
// then says "See the packet".
export const TEST_SUMMARY = [
  {
    week: "Week 1",
    what: "Core Agent: generate and save",
    people: null,
    checks: null,
    result: "See the Week 1 packet.",
  },
  {
    week: "Week 2",
    what: "Research log with real people",
    people: null,
    checks: null,
    result: "See the Week 2 packet.",
  },
  {
    week: "Week 3",
    what: "Pricing logic",
    people: null,
    checks: "4 unit tests",
    result: "All passed.",
  },
  {
    week: "Week 4",
    what: "Marketing kit and 2 A/B tests",
    people: "20 votes at the time of the Week 4 packet (10 per test); more votes came in later",
    checks: "8 unit tests",
    result: "Headline A won 7 of 10. Button B won 9 of 10. A bug was found and fixed.",
  },
  {
    week: "Week 5",
    what: "Guided assistant",
    people: "3 external testers",
    checks: "3 software tests + 14 unit tests",
    result: "3 of 3 got a plan. 1 of 3 rated (thumbs up). 2 asked for more detail, which led to the topics feature.",
  },
];

export const BUILD_LOGS = [
  {
    week: "Week 1",
    feature: "Generative Core Agent (/core)",
    commits: "3 (including the project scaffold)",
    deployments: "Auto-deploy on every push",
    decision: "Use a simulated engine and say so on the page, instead of a paid API.",
  },
  {
    week: "Week 2",
    feature: "Research + Benchmarking Dashboard (/research)",
    commits: "1",
    deployments: "Auto-deploy on every push",
    decision: "Mark the starting references as \"verify and refine\", not as facts.",
  },
  {
    week: "Week 3",
    feature: "Product architecture + Pricing simulator (/product, /pricing)",
    commits: "7",
    deployments: "Auto-deploy on every push",
    decision: "Put the pricing logic in pure functions with tests, and label the prices as my own assumptions.",
  },
  {
    week: "Week 4",
    feature: "Marketing Engine + Content System (/marketing)",
    commits: "10",
    deployments: "6",
    decision: "Collect real A/B votes instead of inventing results, then apply the winner.",
  },
  {
    week: "Week 5",
    feature: "Public Chatbot / Guided Assistant (/chat)",
    commits: "7",
    deployments: "4",
    decision: "Make the assistant safe before smart: refuse unsafe requests, point to real people, and add topics after tester feedback.",
  },
  {
    week: "Week 6",
    feature: "Integrated venture (/demo, /dashboard, impact check)",
    commits: "See the Week 6 packet",
    deployments: "See the Week 6 packet",
    decision: "Show only real records and real feedback; list the known limits in the open.",
  },
];

// Prompts that would be used if a real model replaced the simulated engines.
// They are NOT used by the app today: the output is simulated.
export const PROMPTS = [
  {
    id: "marketing",
    week: "Week 4",
    title: "Marketing kit prompt",
    text: `You write marketing content for a student project.
Brand: {{brandName}}. Product: {{productLine}}. Tone: {{tone}}.
Audience: university students in Mexico.
Write 10 short social posts (Instagram, TikTok, WhatsApp, X), 3 video
scripts of about 30 seconds (hook, body, call to action) and a 14-day
calendar where every day points to one of the pieces.
Rules: no invented statistics, no fake testimonials, no promises about
grades. Return strict JSON.`,
  },
  {
    id: "assistant",
    week: "Week 5",
    title: "Guided assistant system prompt",
    text: `You are the StudyForge guided assistant. Ask exactly 3 questions,
one at a time: subject (and optional topics), days until the exam (1 to
60) and study hours per day (0.5 to 12). Then give a short day-by-day
plan using the topics, one per day, and review all of them on the last day.
Refuse: exam answers or cheating, grade promises, medical or legal
advice, harmful requests, personal data. Redirect off-topic messages.
If the user shows strong stress, hopelessness or self-harm, stop the plan,
be kind and short, and point to a trusted person, university student
services, Linea de la Vida (800 911 2000) and 911 for emergencies. Do not
act as a therapist and do not say a team reads the chat.`,
  },
  {
    id: "feedback",
    week: "Week 6",
    title: "Feedback summary prompt",
    text: `You receive rows of tester feedback: finished, usefulness (1 to 5),
helped (yes / some / no) and a comment. Summarize only what is in the rows:
how many testers, how many finished, the average usefulness and the share
who said it helped. List the repeated requests. Do not invent numbers and
do not estimate missing values. If there are no rows, say "No data yet".`,
  },
];

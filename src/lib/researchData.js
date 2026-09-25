// src/lib/researchData.js
//
// "Research + Benchmarking Dashboard" -- Week 2
//
// This is a STARTING reference set, not a finished market study: 5 well
// known global products in the note-taking / studying / AI-learning space,
// plus 8 tools that compete more directly with StudyForge's core mechanic
// (turn messy input into a structured, actionable study plan).
//
// `overlapScore` (0-10) and `threatScore` (0-10) are a first-pass judgment
// call -- a normal starting point for a competitive 2x2, not a scientific
// measurement -- meant to be refined as real research (interviews, trials,
// desk research) comes in via the "Log a research finding" form below.
// overlapScore: how close their core mechanic is to StudyForge's.
// threatScore: how much of a competitive threat they pose right now
// (reach, brand, funding, momentum).

export const GLOBAL_EXAMPLES = [
  {
    id: "notion-ai",
    name: "Notion AI",
    type: "global",
    country: "Global (US)",
    description:
      "All-in-one workspace (docs, wikis, databases) with an AI add-on that can summarize, draft, and answer questions from your pages.",
    pricing: "Freemium; AI add-on ~$8-10/user/mo on top of a paid plan.",
    keyFeatures: ["Docs + databases", "AI summarize/Q&A", "Templates"],
    strengths: ["Huge existing user base", "Extremely flexible", "Strong brand"],
    weaknesses: [
      "Not built specifically for studying",
      "AI is a bolt-on, not the core loop",
      "Steep setup cost for a new student",
    ],
    overlapScore: 6,
    threatScore: 8,
    url: "https://www.notion.com/product/ai",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    type: "global",
    country: "Global",
    description:
      "Local-first networked notes (Markdown files + backlinks) for personal knowledge management.",
    pricing: "Free for personal use; paid Sync/Publish add-ons.",
    keyFeatures: ["Local Markdown files", "Backlinks/graph view", "Plugin ecosystem"],
    strengths: ["Very loyal power-user community", "Owns its data model", "No lock-in"],
    weaknesses: [
      "Steep learning curve",
      "No built-in AI or study-plan generation",
      "Not aimed at students specifically",
    ],
    overlapScore: 5,
    threatScore: 4,
    url: "https://obsidian.md",
  },
  {
    id: "anki",
    name: "Anki",
    type: "global",
    country: "Global",
    description:
      "The default spaced-repetition flashcard app for students, especially in med school and language learning.",
    pricing: "Free (desktop/Android); one-time paid iOS app.",
    keyFeatures: ["Spaced repetition", "Custom decks", "Huge shared-deck library"],
    strengths: ["Habitual daily use", "Proven learning-science method", "Zero cost on most platforms"],
    weaknesses: [
      "No help turning messy notes into cards",
      "Dated interface",
      "No planning layer, just review",
    ],
    overlapScore: 4,
    threatScore: 5,
    url: "https://apps.ankiweb.net",
  },
  {
    id: "quizlet",
    name: "Quizlet",
    type: "global",
    country: "Global -- very popular across Latin America, including Mexico",
    description:
      "Flashcards and study sets with AI features (e.g. Q-Chat tutor) layered on top of a huge shared library of student-made content.",
    pricing: "Freemium; Quizlet Plus roughly $7.99/mo.",
    keyFeatures: ["Flashcards/study sets", "Practice tests", "AI tutor chat"],
    strengths: [
      "Massive installed base among students, incl. Mexico/LatAm",
      "Network effect from shared study sets",
      "Strong mobile habit",
    ],
    weaknesses: [
      "Doesn't turn raw notes into a plan, just cards",
      "Best content is crowd-sourced, so quality varies",
    ],
    overlapScore: 6,
    threatScore: 7,
    url: "https://quizlet.com",
  },
  {
    id: "remnote",
    name: "RemNote",
    type: "global",
    country: "Global",
    description:
      "Note-taking app with built-in spaced repetition and AI flashcard/summary generation -- structurally the closest global product to StudyForge's idea.",
    pricing: "Freemium; Pro roughly $8-10/mo.",
    keyFeatures: ["Outline notes", "Built-in spaced repetition", "AI-generated flashcards"],
    strengths: [
      "Closest existing product to \"notes -> structured study\"",
      "Combines note-taking and review in one place",
    ],
    weaknesses: ["Much smaller brand than Notion/Quizlet", "Learning curve for the outline model"],
    overlapScore: 7,
    threatScore: 5,
    url: "https://www.remnote.com",
  },
];

export const COMPETITORS = [
  {
    id: "notebooklm",
    name: "Google NotebookLM",
    type: "competitor",
    country: "Global (Google)",
    description:
      "AI notebook that ingests your own sources (PDFs, docs, slides, links) and answers questions, summarizes, and generates study guides / audio overviews grounded in them.",
    pricing: "Free tier; paid NotebookLM Plus/Pro tiers via Google One / Workspace.",
    keyFeatures: ["Source-grounded Q&A", "Auto study guides", "Audio overviews"],
    strengths: [
      "Backed by Google -- huge reach and trust",
      "Genuinely turns messy source material into structured output",
      "Free tier is generous",
    ],
    weaknesses: [
      "General-purpose, not planning-focused",
      "No spaced repetition or study-schedule layer",
    ],
    overlapScore: 8,
    threatScore: 9,
    url: "https://notebooklm.google",
  },
  {
    id: "mem",
    name: "Mem",
    type: "competitor",
    country: "Global (US)",
    description:
      "AI-powered personal notes app that auto-organizes and surfaces related notes instead of relying on manual folders/tags.",
    pricing: "Freemium.",
    keyFeatures: ["AI auto-organization", "Smart search", "Note linking"],
    strengths: ["AI-first positioning close to StudyForge's pitch", "Clean, fast note capture"],
    weaknesses: [
      "General notes tool, not student-specific",
      "Smaller team/roadmap uncertainty vs. big platforms",
    ],
    overlapScore: 6,
    threatScore: 4,
    url: "https://mem.ai",
  },
  {
    id: "wisdolia",
    name: "Wisdolia",
    type: "competitor",
    country: "Global",
    description:
      "Turns PDFs, notes, and YouTube videos into AI-generated flashcards and quizzes.",
    pricing: "Freemium.",
    keyFeatures: ["PDF/notes -> flashcards", "YouTube -> quiz", "Browser extension"],
    strengths: ["Very close mechanic to part of StudyForge's flow", "Low-friction browser extension"],
    weaknesses: ["Small team/brand", "Narrower scope (cards/quizzes, not a full study plan)"],
    overlapScore: 7,
    threatScore: 4,
    url: "https://www.wisdolia.com",
  },
  {
    id: "studyfetch",
    name: "StudyFetch (Spark.E)",
    type: "competitor",
    country: "Global (US)",
    description:
      "AI study platform: upload notes/slides and it generates flashcards, quizzes, and podcasts, plus an AI tutor (\"Spark.E\") to talk through the material.",
    pricing: "Freemium; paid plans for higher usage limits.",
    keyFeatures: ["Notes -> flashcards/quizzes/podcast", "AI tutor chat", "Practice tests"],
    strengths: [
      "Closest direct competitor -- same \"messy material in, structured study out\" promise",
      "Multiple output formats (not just text)",
    ],
    weaknesses: ["Newer brand, still building trust/scale", "Can feel feature-heavy for a quick task"],
    overlapScore: 9,
    threatScore: 6,
    url: "https://studyfetch.com",
  },
  {
    id: "khanmigo",
    name: "Khanmigo (Khan Academy)",
    type: "competitor",
    country: "Global (US nonprofit)",
    description:
      "AI tutor/guide built into Khan Academy's courses; walks students through problems with Socratic-style hints instead of direct answers.",
    pricing: "Free for teachers; about $4/mo for individual learners and parents.",
    keyFeatures: ["Socratic AI tutor", "Tied to Khan Academy courses", "Teacher tools"],
    strengths: ["Massive nonprofit reach and trust", "Backed by an established content library"],
    weaknesses: [
      "Tutoring-focused, not a notes-to-plan tool",
      "Tied to Khan Academy's own course content",
    ],
    overlapScore: 5,
    threatScore: 7,
    url: "https://www.khanmigo.ai",
  },
  {
    id: "glasp",
    name: "Glasp",
    type: "competitor",
    country: "Global",
    description:
      "AI web highlighter and summarizer that turns articles and pages you read into organized notes.",
    pricing: "Freemium.",
    keyFeatures: ["Web highlighting", "AI summaries", "Social note sharing"],
    strengths: ["Captures the \"messy input\" stage well (highlights while reading)"],
    weaknesses: ["Niche community", "Stops at notes -- no study-plan or review layer"],
    overlapScore: 5,
    threatScore: 3,
    url: "https://glasp.co",
  },
  {
    id: "otter",
    name: "Otter.ai",
    type: "competitor",
    country: "Global (US)",
    description:
      "AI transcription and summarization for meetings and lectures -- captures messy spoken content into notes and action items.",
    pricing: "Freemium.",
    keyFeatures: ["Live transcription", "AI summary/action items", "Speaker labels"],
    strengths: ["Well-known brand, strong in the \"lecture capture\" niche adjacent to StudyForge"],
    weaknesses: ["Built for meetings, not exam prep", "No study-plan or spaced-repetition layer"],
    overlapScore: 4,
    threatScore: 5,
    url: "https://otter.ai",
  },
  {
    id: "aprende-org",
    name: "Aprende.org",
    type: "competitor",
    country: "Mexico / Latin America (Fundacion Carlos Slim)",
    description:
      "Free educational content platform from Fundacion Carlos Slim, offering courses and content across many subjects for Spanish-speaking learners, especially in Mexico.",
    pricing: "Free.",
    keyFeatures: ["Free curated courses", "Broad subject coverage", "Mobile app"],
    strengths: [
      "Huge free reach and funding in Mexico specifically",
      "Trusted institutional brand in the target market",
    ],
    weaknesses: [
      "Different core mechanic -- course content, not notes-to-plan",
      "Not aimed at organizing a student's own messy material",
    ],
    overlapScore: 2,
    threatScore: 6,
    url: "https://aprende.org",
  },
];

export const BENCHMARK_ENTRIES = [...GLOBAL_EXAMPLES, ...COMPETITORS];

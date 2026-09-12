// src/lib/coreEngine.js
//
// "Generative Core Agent" — Week 1
//
// IMPORTANT: This is a SIMULATED core-extraction engine. It does not call any
// AI model or paid API. It uses simple, deterministic text heuristics
// (sentence splitting + word-frequency) to stand in for what a real LLM call
// would do later in the semester. Every place this output is shown in the UI
// is labeled "Simulated" per the course rule: "If AI output is simulated,
// label it clearly."
//
// See /docs for the exact prompt this function is standing in for — that's
// the prompt we'd send to a real model once the course allows a live API key.

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "so", "of", "to", "in", "on", "for",
  "with", "is", "are", "was", "were", "be", "been", "being", "this", "that",
  "these", "those", "it", "its", "as", "at", "by", "from", "into", "about",
  "than", "then", "your", "you", "we", "our", "i", "not", "can", "will",
  "which", "who", "what", "when", "where", "how", "also", "just", "like",
  "de", "la", "el", "los", "las", "y", "en", "que", "un", "una", "para",
  "con", "por", "es", "son",
]);

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function topKeywords(text, count) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñü\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w));

  const freq = new Map();
  for (const w of words) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, count)
    .map(([w]) => w);
}

function titleCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Deterministically "extracts the core" of a messy block of text.
 * @param {string} rawText - the pasted topic / notes / chapter.
 * @param {string} [titleHint] - optional title the student typed in.
 * @returns {{
 *   coreTopic: string,
 *   keyConcepts: string[],
 *   studySteps: string[],
 *   whyItMatters: string,
 *   simulated: true,
 * }}
 */
export function extractCore(rawText, titleHint) {
  const text = (rawText || "").trim();
  const sentences = splitSentences(text);

  const coreTopic =
    (titleHint || "").trim() ||
    (sentences[0]
      ? sentences[0].split(" ").slice(0, 8).join(" ")
      : "Untitled topic");

  const keywords = topKeywords(text, 5);
  const keyConcepts =
    keywords.length > 0
      ? keywords.map(titleCase)
      : ["Not enough text to extract concepts yet"];

  const chunkCount = Math.min(4, Math.max(1, Math.ceil(sentences.length / 3)));
  const chunkSize = Math.ceil(sentences.length / chunkCount) || 1;
  const studySteps = [];
  for (let i = 0; i < chunkCount; i++) {
    const chunk = sentences.slice(i * chunkSize, (i + 1) * chunkSize);
    if (chunk.length === 0) continue;
    const preview = chunk[0].split(" ").slice(0, 10).join(" ");
    studySteps.push(`Review: ${preview}${chunk[0].split(" ").length > 10 ? "…" : ""}`);
  }
  if (studySteps.length === 0) {
    studySteps.push("Paste more text to generate study steps.");
  }

  const whyItMatters = `Understanding "${coreTopic}" gives you the foundation the rest of this material builds on — starting here makes everything after it easier to follow.`;

  return {
    coreTopic,
    keyConcepts,
    studySteps,
    whyItMatters,
    simulated: true,
  };
}

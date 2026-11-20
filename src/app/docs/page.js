import { BUILD_LOGS, PROMPTS } from "../../lib/ventureData.js";

const corePrompt = `You are a study coach. Given a messy topic, chapter, or set of
notes, extract its core:

1. coreTopic — a short name for what this material is actually about.
2. keyConcepts — 3 to 5 key concepts a student must know, in order of
   importance.
3. studySteps — a suggested study order broken into small, doable chunks.
4. whyItMatters — one sentence on why understanding this topic first makes
   everything after it easier.

Return strict JSON with exactly those four fields. Do not add commentary
outside the JSON.

Input:
"""
{{rawText}}
"""`;

const dataModel = [
  {
    table: "core_outputs",
    week: "Week 1",
    columns: [
      ["title", "text", "Optional student-provided title"],
      ["input_text", "text", "The raw, messy text that was pasted in"],
      [
        "output_json",
        "jsonb",
        "{ coreTopic, keyConcepts[], studySteps[], whyItMatters, simulated: true }",
      ],
      ["created_at", "timestamptz", "Set automatically on insert"],
    ],
  },
  {
    table: "research_outputs",
    week: "Week 2",
    columns: [
      ["title", "text", "Optional label for the research entry"],
      [
        "method",
        "text",
        "How the research was gathered: Entrevista, Encuesta, Observación, Investigación de escritorio",
      ],
      ["summary", "text", "What was asked and what the person/source said"],
      [
        "validates_hypothesis",
        "text",
        "yes / no / mixed — whether this entry supports the \"messy notes\" problem",
      ],
      ["created_at", "timestamptz", "Set automatically on insert"],
    ],
  },
  {
    table: "pricing_scenarios",
    week: "Week 3",
    columns: [
      ["name", "text", "Name the student gave the scenario"],
      ["scenario", "text", "conservative / expected / optimistic / custom"],
      ["inputs_json", "jsonb", "All calculator inputs at the time of saving"],
      ["monthly_revenue", "numeric", "Calculated monthly revenue in MXN"],
      ["annual_revenue", "numeric", "Calculated annual revenue (monthly x 12)"],
      ["created_at", "timestamptz", "Set automatically on insert"],
    ],
  },
  {
    table: "marketing_assets",
    week: "Week 4",
    columns: [
      ["asset_type", "text", "post, script, landing or calendar"],
      ["title", "text", "Title the student gave the saved piece"],
      ["content", "text", "The saved text"],
      ["created_at", "timestamptz", "Set automatically on insert"],
    ],
  },
  {
    table: "ab_votes",
    week: "Week 4",
    columns: [
      ["test_id", "text", "Which A/B test was voted on (headline or cta)"],
      ["variant", "text", "A or B"],
      ["created_at", "timestamptz", "Set automatically on insert"],
    ],
  },
  {
    table: "chat_sessions",
    week: "Week 5",
    columns: [
      ["answers", "jsonb", "The intake answers: subject, days, hours"],
      ["outcome", "text", "plan / blocked / offtopic / human"],
      ["rating", "text", "up / down, or empty if not rated"],
      ["comment", "text", "Optional comment given with the rating"],
      ["summary", "text", "One short line describing the session"],
      ["created_at", "timestamptz", "Set automatically on insert"],
    ],
  },
  {
    table: "venture_feedback",
    week: "Week 6",
    columns: [
      ["tester", "text", "Initials only. No names, emails or phone numbers"],
      ["finished", "boolean", "Did the tester finish the 7 demo steps"],
      ["usefulness", "int", "1 to 5"],
      ["helped", "text", "yes / some / no: did it help decide what to study first"],
      ["would_use", "text", "yes / maybe / no (optional)"],
      ["comment", "text", "Optional comment"],
      ["created_at", "timestamptz", "Set automatically on insert"],
    ],
  },
];

export default function DocsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
        Docs
      </span>
      <h1 className="mt-3 text-3xl font-semibold text-zinc-900">
        Docs &amp; prompt library
      </h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        The prompts and data model behind each week&apos;s feature, so
        simulated output can be swapped for a real model call once the
        course allows a live API key, and so the Supabase schema is
        documented in one place.
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">
          Week 1 — Generative Core Agent
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          <code>/core</code> currently uses{" "}
          <code>src/lib/coreEngine.js</code>, a deterministic, simulated
          heuristic (sentence splitting + word frequency) — clearly labeled
          &ldquo;Simulated output&rdquo; in the UI. This is the prompt it
          stands in for:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-900 p-4 text-xs text-zinc-100">
          <code>{corePrompt}</code>
        </pre>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">
          Week 2 — Research + Benchmarking Dashboard
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          <code>/research</code> is not AI-generated: the 5 global examples
          and 8 direct competitors in <code>src/lib/researchData.js</code>{" "}
          are manually curated reference data, and the &ldquo;Overlap&rdquo;
          / &ldquo;Threat&rdquo; scores are a first-pass judgment call (a
          standard 2x2 competitive-positioning technique), not a
          measurement — meant to be revised as real research comes in.
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          The research log itself (the &ldquo;Log a research finding&rdquo;
          form) is where genuine human validation is recorded: who was
          asked, what method was used, what they said, and whether it
          supports the core &ldquo;messy notes&rdquo; problem hypothesis.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">
          Prompt library (Weeks 4 to 6)
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          These are the prompts a real model would use to replace the
          simulated engines. The app does <strong>not</strong> call them
          today: marketing and chat are templates and rules, and the
          output is labeled as simulated.
        </p>
        <div className="mt-4 space-y-6">
          {PROMPTS.map((prompt) => (
            <div key={prompt.id}>
              <p className="text-sm font-semibold text-zinc-900">
                {prompt.title}{" "}
                <span className="font-normal text-zinc-500">— {prompt.week}</span>
              </p>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-900 p-4 text-xs text-zinc-100">
                <code>{prompt.text}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">Build logs</h2>
        <p className="mt-2 text-sm text-zinc-600">
          One line per week: what was built, how many commits and
          deployments, and the main decision. The full evidence is in each
          weekly packet and in the GitHub history.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
          <table className="min-w-[640px] divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-zinc-700">Week</th>
                <th className="px-4 py-2 text-left font-semibold text-zinc-700">Feature</th>
                <th className="px-4 py-2 text-left font-semibold text-zinc-700">Commits</th>
                <th className="px-4 py-2 text-left font-semibold text-zinc-700">Deployments</th>
                <th className="px-4 py-2 text-left font-semibold text-zinc-700">Main decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {BUILD_LOGS.map((log) => (
                <tr key={log.week}>
                  <td className="px-4 py-2 font-medium text-zinc-900">{log.week}</td>
                  <td className="px-4 py-2 text-zinc-600">{log.feature}</td>
                  <td className="px-4 py-2 text-zinc-600">{log.commits}</td>
                  <td className="px-4 py-2 text-zinc-600">{log.deployments}</td>
                  <td className="px-4 py-2 text-zinc-600">{log.decision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">Data model</h2>
        <div className="mt-4 space-y-8">
          {dataModel.map((t) => (
            <div key={t.table}>
              <p className="text-sm font-semibold text-zinc-900">
                <code>{t.table}</code>{" "}
                <span className="font-normal text-zinc-500">— {t.week}</span>
              </p>
              <div className="mt-2 overflow-x-auto rounded-xl border border-zinc-200">
                <table className="min-w-full divide-y divide-zinc-200 text-sm">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                        Column
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-zinc-700">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {t.columns.map(([col, type, notes]) => (
                      <tr key={col}>
                        <td className="px-4 py-2 font-mono text-xs text-zinc-800">
                          {col}
                        </td>
                        <td className="px-4 py-2 text-xs text-zinc-500">{type}</td>
                        <td className="px-4 py-2 text-zinc-600">{notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

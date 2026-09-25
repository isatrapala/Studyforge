"use client";

import { useEffect, useMemo, useState } from "react";
import { BENCHMARK_ENTRIES } from "@/lib/researchData";
import {
  isSupabaseConfigured,
  listResearchOutputs,
  saveResearchOutput,
} from "@/lib/supabaseClient";

const METHODS = ["Entrevista", "Encuesta", "Observación", "Investigación de escritorio"];
const VALIDATION_OPTIONS = [
  { value: "yes", label: "Sí valida el problema" },
  { value: "no", label: "No lo valida" },
  { value: "mixed", label: "Resultado mixto" },
];

function TypeBadge({ type }) {
  const isGlobal = type === "global";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isGlobal ? "bg-indigo-100 text-indigo-700" : "bg-rose-100 text-rose-700"
      }`}
    >
      {isGlobal ? "Global example" : "Direct competitor"}
    </span>
  );
}

function ReferenceBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
      Starting reference — verify &amp; refine with your own research
    </span>
  );
}

function RiskMap({ entries }) {
  const quadrants = [
    { key: "tl", className: "bg-amber-50", label: "Big platforms, adjacent — monitor" },
    { key: "tr", className: "bg-rose-50", label: "Direct threats — watch closely" },
    { key: "bl", className: "bg-zinc-50", label: "Low priority for now" },
    { key: "br", className: "bg-emerald-50", label: "Similar mechanic, smaller reach — learn from" },
  ];

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
        <span>Risk map</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-indigo-500" /> Global example
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Competitor
          </span>
        </span>
      </div>

      <div className="mt-2 flex gap-2">
        <div className="flex w-6 flex-col items-center justify-between py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
          <span>High threat</span>
          <span
            className="[writing-mode:vertical-rl] rotate-180 text-zinc-400"
            aria-hidden
          >
            Competitive threat
          </span>
          <span>Low threat</span>
        </div>

        <div className="relative aspect-square w-full max-w-xl overflow-hidden rounded-xl border border-zinc-200">
          <div className="grid h-full w-full grid-cols-2 grid-rows-2">
            {quadrants.map((q) => (
              <div key={q.key} className={`relative p-2 ${q.className}`}>
                <span className="text-[10px] font-medium leading-tight text-zinc-500">
                  {q.label}
                </span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-zinc-300" />
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-zinc-300" />

          {entries.map((entry) => {
            const left = Math.min(96, Math.max(4, entry.overlapScore * 10));
            const top = Math.min(96, Math.max(4, 100 - entry.threatScore * 10));
            return (
              <div
                key={entry.id}
                title={`${entry.name} — overlap ${entry.overlapScore}/10, threat ${entry.threatScore}/10`}
                className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow ${
                  entry.type === "global" ? "bg-indigo-500" : "bg-rose-500"
                }`}
                style={{ left: `${left}%`, top: `${top}%` }}
              />
            );
          })}
        </div>
      </div>

      <p className="ml-8 mt-1 text-center text-[10px] font-medium uppercase tracking-wide text-zinc-400">
        Overlap with StudyForge&apos;s core mechanic &rarr;
      </p>
    </div>
  );
}

function BenchmarkTable({ entries }) {
  if (entries.length === 0) {
    return (
      <p className="mt-6 text-sm text-zinc-500">
        No entries match that search — try a different name or country.
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200">
      <table className="min-w-full divide-y divide-zinc-200 text-sm">
        <thead className="bg-zinc-50">
          <tr>
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700">Name</th>
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700">Type</th>
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700">Country / market</th>
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700">Pricing</th>
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700">Overlap</th>
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700">Threat</th>
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700">Strengths</th>
            <th className="px-4 py-2.5 text-left font-semibold text-zinc-700">Weaknesses</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {entries.map((entry) => (
            <tr key={entry.id} className="align-top">
              <td className="px-4 py-3">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-900 hover:text-indigo-600"
                >
                  {entry.name}
                </a>
                <p className="mt-1 max-w-xs text-xs text-zinc-500">{entry.description}</p>
              </td>
              <td className="px-4 py-3">
                <TypeBadge type={entry.type} />
              </td>
              <td className="px-4 py-3 text-zinc-600">{entry.country}</td>
              <td className="px-4 py-3 text-zinc-600">{entry.pricing}</td>
              <td className="px-4 py-3 text-zinc-600">{entry.overlapScore}/10</td>
              <td className="px-4 py-3 text-zinc-600">{entry.threatScore}/10</td>
              <td className="px-4 py-3 text-zinc-600">
                <ul className="list-inside list-disc space-y-0.5">
                  {entry.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-3 text-zinc-600">
                <ul className="list-inside list-disc space-y-0.5">
                  {entry.weaknesses.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResearchPage() {
  const [query, setQuery] = useState("");

  const [title, setTitle] = useState("");
  const [method, setMethod] = useState(METHODS[0]);
  const [summary, setSummary] = useState("");
  const [validates, setValidates] = useState(VALIDATION_OPTIONS[0].value);

  const [saveStatus, setSaveStatus] = useState(null); // null | "saving" | "saved" | "error"
  const [saveMessage, setSaveMessage] = useState("");
  const [saved, setSaved] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const filteredEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BENCHMARK_ENTRIES;
    return BENCHMARK_ENTRIES.filter((entry) =>
      [entry.name, entry.country, entry.description]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    async function loadSaved() {
      const { data } = await listResearchOutputs(5);
      if (!cancelled) {
        setSaved(data || []);
        setLoadingSaved(false);
      }
    }
    loadSaved();
    return () => {
      cancelled = true;
    };
  }, [saveStatus]);

  async function handleSaveResearch(e) {
    e.preventDefault();
    setSaveStatus("saving");
    const { error } = await saveResearchOutput({
      title: title || `${method} — ${new Date().toLocaleDateString()}`,
      method,
      summary,
      validatesHypothesis: validates,
    });
    if (error) {
      setSaveStatus("error");
      setSaveMessage(error.message);
    } else {
      setSaveStatus("saved");
      setSaveMessage("Saved to Supabase.");
      setTitle("");
      setSummary("");
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
        Week 2 &middot; Research + Benchmarking Dashboard
      </span>
      <h1 className="mt-3 text-3xl font-semibold text-zinc-900">
        Research &amp; competitive benchmarking
      </h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        Where StudyForge sits next to 5 well-known global tools and 8 more
        direct competitors, plus a running log of real research (interviews,
        surveys, desk research) that tests whether the &ldquo;messy
        notes&rdquo; problem is actually real for people.
      </p>

      {!isSupabaseConfigured && (
        <div className="mt-6 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Supabase isn&apos;t connected yet, so the benchmarking table and
          risk map still work, but logged research won&apos;t be saved. Add
          your keys to <code>.env.local</code> (and in Vercel) to enable
          saving.
        </div>
      )}

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-zinc-900">
            Benchmarking: 5 global examples + 8 direct competitors
          </h2>
          <ReferenceBadge />
        </div>
        <p className="mt-2 text-sm text-zinc-600">
          &ldquo;Global examples&rdquo; are established, widely-used tools in
          the note-taking / studying space that inspire the category.
          &ldquo;Direct competitors&rdquo; are the tools closest to
          StudyForge&apos;s actual pitch: turning messy input into a
          structured study plan. Overlap and threat scores are a first
          judgment call to revisit as research comes in.
        </p>

        <div className="mt-6">
          <label className="block text-sm font-medium text-zinc-700">
            Search by name, country, or description
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. México, flashcards, Google…"
            className="mt-1 w-full max-w-sm rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <RiskMap entries={BENCHMARK_ENTRIES} />
        <BenchmarkTable entries={filteredEntries} />
      </section>

      <section className="mt-16 border-t border-zinc-200 pt-10">
        <h2 className="text-xl font-semibold text-zinc-900">
          Log a research finding
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-zinc-600">
          After an interview, survey, or a session with a competitor&apos;s
          app, log it here. This is what backs up the &ldquo;human
          validation&rdquo; step of the build discipline packet.
        </p>

        <form onSubmit={handleSaveResearch} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Entrevista con compañero de clase"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Does it validate the problem?
              </label>
              <select
                value={validates}
                onChange={(e) => setValidates(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {VALIDATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              What did you ask, and what did they say?
            </label>
            <textarea
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={5}
              placeholder="Le pregunté si sus apuntes de clase están desordenados y qué hace al respecto…"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saveStatus === "saving"}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {saveStatus === "saving" ? "Saving…" : "Save"}
            </button>
            {saveStatus === "saved" && (
              <span className="text-sm text-emerald-600">{saveMessage}</span>
            )}
            {saveStatus === "error" && (
              <span className="text-sm text-red-600">{saveMessage}</span>
            )}
          </div>
        </form>
      </section>

      <section className="mt-16 border-t border-zinc-200 pt-8">
        <h2 className="text-xl font-semibold text-zinc-900">
          Dashboard preview — saved research
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          The last 5 research findings saved to Supabase.
        </p>

        {loadingSaved ? (
          <p className="mt-4 text-sm text-zinc-500">Loading…</p>
        ) : saved.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            Nothing saved yet &mdash; log a finding above and click
            &ldquo;Save&rdquo;.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {saved.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-zinc-900">{row.title}</p>
                  <span className="text-xs text-zinc-500">
                    {new Date(row.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {row.method} &middot;{" "}
                  {VALIDATION_OPTIONS.find((o) => o.value === row.validates_hypothesis)
                    ?.label || row.validates_hypothesis}
                </p>
                <p className="mt-1 text-sm text-zinc-600">{row.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

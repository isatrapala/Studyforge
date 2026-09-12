"use client";

import { useEffect, useState } from "react";
import { extractCore } from "@/lib/coreEngine";
import {
  isSupabaseConfigured,
  listCoreOutputs,
  saveCoreOutput,
} from "@/lib/supabaseClient";

function SimulatedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
      Simulated output — no real AI call yet
    </span>
  );
}

function OutputCard({ output }) {
  if (!output) return null;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-zinc-900">
          {output.coreTopic}
        </h3>
        <SimulatedBadge />
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Key concepts
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {output.keyConcepts.map((concept) => (
            <span
              key={concept}
              className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Suggested study order
        </p>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-zinc-700">
          {output.studySteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Why it matters
        </p>
        <p className="mt-2 text-sm text-zinc-700">{output.whyItMatters}</p>
      </div>
    </div>
  );
}

export default function CorePage() {
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [output, setOutput] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // null | "saving" | "saved" | "error"
  const [saveMessage, setSaveMessage] = useState("");
  const [saved, setSaved] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadSaved() {
      const { data } = await listCoreOutputs(5);
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

  function handleExtract(e) {
    e.preventDefault();
    const result = extractCore(rawText, title);
    setOutput(result);
    setSaveStatus(null);
    setSaveMessage("");
  }

  async function handleSave() {
    if (!output) return;
    setSaveStatus("saving");
    const { error } = await saveCoreOutput({
      title: title || output.coreTopic,
      inputText: rawText,
      output,
    });
    if (error) {
      setSaveStatus("error");
      setSaveMessage(error.message);
    } else {
      setSaveStatus("saved");
      setSaveMessage("Saved to Supabase.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
        Week 1 &middot; Generative Core Agent
      </span>
      <h1 className="mt-3 text-3xl font-semibold text-zinc-900">
        Core extraction
      </h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        Paste a messy topic, a rough chapter, or your own notes. This page
        extracts the core of it &mdash; the topic, the key concepts, and a
        suggested order to study them in &mdash; using a simulated engine (no
        paid AI API required). See{" "}
        <a href="/docs" className="font-medium text-indigo-600 hover:text-indigo-800">
          /docs
        </a>{" "}
        for the exact prompt this stands in for.
      </p>

      {!isSupabaseConfigured && (
        <div className="mt-6 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Supabase isn&apos;t connected yet, so extraction works but
          won&apos;t be saved. Add your keys to <code>.env.local</code> (and
          in Vercel) to enable saving.
        </div>
      )}

      <form onSubmit={handleExtract} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Title (optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Chapter 3 — Cellular Respiration"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Paste your topic, chapter, or notes
          </label>
          <textarea
            required
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={8}
            placeholder="Paste anything messy here..."
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          Extract core
        </button>
      </form>

      {output && (
        <div className="mt-8 space-y-4">
          <OutputCard output={output} />
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className="rounded-full border border-indigo-600 px-5 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 disabled:opacity-50"
            >
              {saveStatus === "saving" ? "Saving…" : "Save this output"}
            </button>
            {saveStatus === "saved" && (
              <span className="text-sm text-emerald-600">{saveMessage}</span>
            )}
            {saveStatus === "error" && (
              <span className="text-sm text-red-600">{saveMessage}</span>
            )}
          </div>
        </div>
      )}

      <section className="mt-16 border-t border-zinc-200 pt-8">
        <h2 className="text-xl font-semibold text-zinc-900">
          Dashboard preview — saved outputs
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          The last 5 core extractions saved to Supabase.
        </p>

        {loadingSaved ? (
          <p className="mt-4 text-sm text-zinc-500">Loading…</p>
        ) : saved.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            Nothing saved yet &mdash; extract something above and click
            &ldquo;Save this output&rdquo;.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {saved.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-zinc-900">
                    {row.title || row.output_json?.coreTopic}
                  </p>
                  <span className="text-xs text-zinc-500">
                    {new Date(row.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  {(row.output_json?.keyConcepts || []).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

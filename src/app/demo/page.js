"use client";

import { useEffect, useState } from "react";
import {
  isSupabaseConfigured,
  listVentureFeedback,
  saveVentureFeedback,
} from "../../lib/supabaseClient.js";
import { validateFeedback, summarizeFeedback } from "../../lib/ventureEngine.js";
import {
  AGENTS,
  IMPACT_CHECKS,
  ROADMAP,
  WALKTHROUGH,
} from "../../lib/ventureData.js";

const MODE_STYLE = {
  Simulated: "bg-amber-100 text-amber-800",
  "Rule-based": "bg-sky-100 text-sky-800",
  Calculator: "bg-emerald-100 text-emerald-800",
  "Manual log": "bg-zinc-100 text-zinc-700",
  Static: "bg-zinc-100 text-zinc-700",
};

const EMPTY_FORM = {
  tester: "",
  finished: "",
  usefulness: "",
  helped: "",
  wouldUse: "",
  comment: "",
};

function ModeBadge({ mode }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${MODE_STYLE[mode]}`}>
      {mode}
    </span>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      <div className="mt-1">{children}</div>
      {error ? <p className="mt-1 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

const inputClass = "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm";

export default function DemoPage() {
  const [done, setDone] = useState([]);
  const [rows, setRows] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  function loadFeedback() {
    return listVentureFeedback(500).then(({ data, error }) => {
      setRows(data);
      setLoadError(error ? error.message : null);
    });
  }

  useEffect(() => {
    let cancelled = false;
    listVentureFeedback(500).then(({ data, error }) => {
      if (cancelled) return;
      setRows(data);
      setLoadError(error ? error.message : null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = summarizeFeedback(rows);

  function toggleStep(id) {
    setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    const result = validateFeedback({
      tester: form.tester,
      finished: form.finished === "yes" ? true : form.finished === "no" ? false : undefined,
      usefulness: form.usefulness,
      helped: form.helped,
      wouldUse: form.wouldUse,
      comment: form.comment,
    });
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setSaving(true);
    const { error } = await saveVentureFeedback(result.value);
    setSaving(false);
    if (error) {
      setStatus({ type: "error", text: `Your feedback was not saved: ${error.message}` });
      return;
    }
    setStatus({ type: "ok", text: "Thank you! Your feedback was saved." });
    setForm(EMPTY_FORM);
    loadFeedback();
  }

  const progress = Math.round((done.length / WALKTHROUGH.length) * 100);

  return (
    <main className="flex-1">
      <section className="border-b border-zinc-200 bg-gradient-to-b from-indigo-50/60 to-white">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            Week 6 · Integrated venture
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            See StudyForge AI in action
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Follow 7 short steps through every module, then tell me what you think. It takes about
            5 minutes. Study the core first.
          </p>
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            Guided demo: the agents are simulated, rule-based or calculators. There is no AI API.
            Each page says which one it is.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-6 py-12">
        <section aria-label="Walkthrough">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-2xl font-semibold text-zinc-900">1. Guided walkthrough</h2>
            <p className="text-sm font-medium text-zinc-600">
              {done.length} of {WALKTHROUGH.length} steps done
            </p>
          </div>
          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-200"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={WALKTHROUGH.length}
            aria-valuenow={done.length}
            aria-label="Walkthrough progress"
          >
            <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <ol className="mt-6 space-y-3">
            {WALKTHROUGH.map((step) => {
              const checked = done.includes(step.id);
              return (
                <li key={step.id} className="rounded-lg border border-zinc-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                      {step.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-zinc-900">{step.title}</h3>
                      <p className="mt-1 text-sm text-zinc-700">{step.instruction}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        <span className="font-medium text-zinc-600">You should see:</span> {step.expected}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4">
                        <a
                          href={step.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700"
                        >
                          Open page
                        </a>
                        <label className="flex items-center gap-2 text-sm text-zinc-700">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleStep(step.id)}
                            className="h-4 w-4"
                          />
                          Done
                        </label>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-label="Agent map">
          <h2 className="text-2xl font-semibold text-zinc-900">2. Agent map</h2>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Six modules. Each one takes an input, gives an output and saves it in Supabase. The
            dashboard reads everything back. The tag says how each one works today.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((agent) => (
              <a
                key={agent.id}
                href={agent.href}
                className="block rounded-lg border border-zinc-200 bg-white p-4 hover:border-indigo-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-zinc-900">{agent.name}</h3>
                  <ModeBadge mode={agent.mode} />
                </div>
                <p className="mt-1 text-sm text-zinc-600">{agent.job}</p>
                <dl className="mt-3 space-y-1 text-xs text-zinc-600">
                  <div><dt className="inline font-semibold">In: </dt><dd className="inline">{agent.input}</dd></div>
                  <div><dt className="inline font-semibold">Out: </dt><dd className="inline">{agent.output}</dd></div>
                  <div><dt className="inline font-semibold">Saved in: </dt><dd className="inline">{agent.table ?? "nothing (static page)"}</dd></div>
                </dl>
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col items-stretch gap-2 text-center text-sm font-medium sm:flex-row sm:items-center">
            <div className="flex-1 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-700">
              6 modules save their records
            </div>
            <span aria-hidden="true" className="text-zinc-400">→</span>
            <div className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900">
              Supabase (7 tables)
            </div>
            <span aria-hidden="true" className="text-zinc-400">→</span>
            <a href="/dashboard" className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-500">
              Dashboard
            </a>
          </div>
        </section>

        <section aria-label="Practical impact check">
          <h2 className="text-2xl font-semibold text-zinc-900">3. Practical impact check</h2>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Does it create value, does it avoid obvious harm, and can it survive? Each line says how
            I checked it.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <h3 className="font-semibold text-zinc-900">Value</h3>
              <p className="mt-2 rounded-md bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
                {summary.total === 0
                  ? "Demo feedback: no data yet."
                  : `Demo feedback: ${summary.helpedYes} of ${summary.total} testers said it helped them decide what to study first (${summary.helpedPercent}%). Average usefulness ${summary.avgUsefulness}/5. This is a small sample.`}
              </p>
              <ul className="mt-3 space-y-3 text-sm text-zinc-700">
                {IMPACT_CHECKS.value.map((item) => (
                  <li key={item.text}>
                    {item.text}
                    <span className="block text-xs text-zinc-500">Evidence: {item.evidence}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <h3 className="font-semibold text-zinc-900">Harm check</h3>
              <ul className="mt-3 space-y-3 text-sm text-zinc-700">
                {IMPACT_CHECKS.harm.map((item) => (
                  <li key={item.text}>
                    {item.text}
                    <span className="block text-xs text-zinc-500">Evidence: {item.evidence}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4">
              <h3 className="font-semibold text-zinc-900">Viability</h3>
              <ul className="mt-3 space-y-3 text-sm text-zinc-700">
                {IMPACT_CHECKS.viability.map((item) => (
                  <li key={item.text}>
                    {item.text}
                    <span className="block text-xs text-zinc-500">Evidence: {item.evidence}</span>
                  </li>
                ))}
              </ul>
              <a href="/pricing" className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800">
                Open the pricing simulator
              </a>
            </div>
          </div>
        </section>

        <section aria-label="Version 2 roadmap">
          <h2 className="text-2xl font-semibold text-zinc-900">4. Version 2 roadmap</h2>
          <p className="mt-2 max-w-2xl text-zinc-600">
            What I would build next, in order, and why. Each reason comes from real feedback or a
            known limit.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {["Now", "Next", "Later"].map((stage) => (
              <div key={stage} className="rounded-lg border border-zinc-200 bg-white p-4">
                <h3 className="font-semibold text-zinc-900">{stage}</h3>
                <ul className="mt-3 space-y-4 text-sm">
                  {ROADMAP.filter((item) => item.stage === stage).map((item) => (
                    <li key={item.title}>
                      <p className="font-medium text-zinc-900">{item.title}</p>
                      <p className="mt-1 text-zinc-600">{item.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Feedback form">
          <h2 className="text-2xl font-semibold text-zinc-900">5. Tell me what you think</h2>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Use initials only. Please do not write your name, email or phone number.
          </p>
          <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 sm:grid-cols-2">
            <Field label="Your initials" error={errors.tester}>
              <input
                className={inputClass}
                value={form.tester}
                maxLength={20}
                onChange={(e) => setField("tester", e.target.value)}
                placeholder="For example: A.P."
              />
            </Field>
            <Field label="Did you finish the 7 steps?" error={errors.finished}>
              <select className={inputClass} value={form.finished} onChange={(e) => setField("finished", e.target.value)}>
                <option value="">Choose…</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </Field>
            <Field label="How useful was it? (1 = not useful, 5 = very useful)" error={errors.usefulness}>
              <select className={inputClass} value={form.usefulness} onChange={(e) => setField("usefulness", e.target.value)}>
                <option value="">Choose…</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </Field>
            <Field label="Did it help you decide what to study first?" error={errors.helped}>
              <select className={inputClass} value={form.helped} onChange={(e) => setField("helped", e.target.value)}>
                <option value="">Choose…</option>
                <option value="yes">Yes</option>
                <option value="some">A little</option>
                <option value="no">No</option>
              </select>
            </Field>
            <Field label="Would you use it for a real exam? (optional)" error={errors.wouldUse}>
              <select className={inputClass} value={form.wouldUse} onChange={(e) => setField("wouldUse", e.target.value)}>
                <option value="">Choose…</option>
                <option value="yes">Yes</option>
                <option value="maybe">Maybe</option>
                <option value="no">No</option>
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Comment (optional)" error={errors.comment}>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.comment}
                  onChange={(e) => setField("comment", e.target.value)}
                  placeholder="What was confusing or missing?"
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {saving ? "Sending…" : "Send feedback"}
              </button>
              {status ? (
                <p className={`mt-3 text-sm ${status.type === "ok" ? "text-emerald-700" : "text-red-700"}`} role="status">
                  {status.text}
                </p>
              ) : null}
              {!isSupabaseConfigured ? (
                <p className="mt-3 text-sm text-amber-800">Supabase is not configured yet.</p>
              ) : null}
            </div>
          </form>
        </section>

        <section aria-label="Testing evidence">
          <h2 className="text-2xl font-semibold text-zinc-900">6. Testing evidence</h2>
          <div className="mt-4 grid gap-3 rounded-lg border border-zinc-200 bg-white p-5 sm:grid-cols-3">
            <div>
              <p className="text-sm text-zinc-500">External testers so far (goal: 5)</p>
              <p className="mt-1 text-3xl font-semibold text-zinc-900">{loadError ? "–" : summary.total}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Finished the 7 steps</p>
              <p className="mt-1 text-3xl font-semibold text-zinc-900">{loadError ? "–" : summary.finished}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Average usefulness</p>
              <p className="mt-1 text-3xl font-semibold text-zinc-900">
                {summary.avgUsefulness === null ? "No data yet" : `${summary.avgUsefulness}/5`}
              </p>
            </div>
          </div>
          {loadError ? (
            <p className="mt-3 text-sm text-amber-800">Could not read the feedback: {loadError}</p>
          ) : null}
          <p className="mt-3 text-sm text-zinc-600">
            See every saved record, the testing summary and the ratings on the{" "}
            <a href="/dashboard" className="font-medium text-indigo-600 hover:text-indigo-800">dashboard</a>.
          </p>
        </section>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  DASHBOARD_TABLES,
  getDashboardData,
  isSupabaseConfigured,
  listChatSessions,
  listVentureFeedback,
} from "../../lib/supabaseClient.js";
import { summarizeFeedback } from "../../lib/ventureEngine.js";
import { TEST_SUMMARY } from "../../lib/ventureData.js";

const TABLE_INFO = {
  core_outputs: { label: "Core outputs", week: "Week 1", href: "/core" },
  research_outputs: { label: "Research entries", week: "Week 2", href: "/research" },
  pricing_scenarios: { label: "Pricing scenarios", week: "Week 3", href: "/pricing" },
  marketing_assets: { label: "Marketing assets", week: "Week 4", href: "/marketing" },
  ab_votes: { label: "A/B votes", week: "Week 4", href: "/marketing" },
  chat_sessions: { label: "Chat sessions", week: "Week 5", href: "/chat" },
  venture_feedback: { label: "Tester feedback", week: "Week 6", href: "/demo" },
};

function cut(text, n = 80) {
  const value = String(text ?? "").replace(/\s+/g, " ").trim();
  return value.length > n ? `${value.slice(0, n - 1)}…` : value;
}

// One short line per record, built only from the saved fields.
function describeRow(table, row) {
  switch (table) {
    case "core_outputs":
      return cut(row.title || row.input_text || "Untitled output");
    case "research_outputs":
      return cut(`${row.title || "Untitled"} (${row.method || "no method"})`);
    case "pricing_scenarios":
      return cut(`${row.name} — ${row.scenario}`);
    case "marketing_assets":
      return cut(`${row.asset_type}: ${row.title}`);
    case "ab_votes":
      return `${row.test_id}: variant ${row.variant}`;
    case "chat_sessions":
      return cut(`${row.summary}${row.rating ? ` (rating: ${row.rating})` : ""}`);
    case "venture_feedback":
      return `${row.tester}: usefulness ${row.usefulness}/5, helped: ${row.helped}${row.finished ? "" : ", did not finish"}`;
    default:
      return "";
  }
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "";
  }
}

async function loadAll() {
  const [dash, chat, feedback] = await Promise.all([
    getDashboardData(),
    listChatSessions(500),
    listVentureFeedback(500),
  ]);
  return { dash, chat, feedback };
}

export default function DashboardPage() {
  const [state, setState] = useState({ loading: true, data: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadAll().then((result) => {
      if (!cancelled) setState({ loading: false, data: result });
    });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  function refresh() {
    setState((prev) => ({ ...prev, loading: true }));
    setReloadKey((k) => k + 1);
  }

  const { loading, data } = state;
  const dash = data?.dash;
  const tables = dash?.data;
  const chatRows = data?.chat?.data || [];
  const feedbackRows = data?.feedback?.data || [];
  const feedbackSummary = summarizeFeedback(feedbackRows);
  const chatUp = chatRows.filter((r) => r.rating === "up").length;
  const chatDown = chatRows.filter((r) => r.rating === "down").length;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
        Dashboard
      </span>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Venture dashboard</h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Everything the site has saved in Supabase, in one place: a count and the
            latest records of each module. Nothing here is invented. If a number is
            zero, nothing has been saved yet.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {!isSupabaseConfigured || dash?.error ? (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {dash?.error?.message || "Supabase is not configured yet."}
        </p>
      ) : null}

      <section className="mt-8" aria-label="Record counts">
        <h2 className="text-xl font-semibold text-zinc-900">Saved records</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DASHBOARD_TABLES.map((table) => {
            const info = TABLE_INFO[table];
            const entry = tables?.[table];
            return (
              <div key={table} className="rounded-lg border border-zinc-200 bg-white p-4">
                <p className="text-xs font-medium text-zinc-500">{info.week}</p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">{info.label}</p>
                <p className="mt-2 text-3xl font-semibold text-zinc-900">
                  {loading && !entry ? "…" : entry?.count ?? "–"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10" aria-label="Latest records">
        <h2 className="text-xl font-semibold text-zinc-900">Latest records</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {DASHBOARD_TABLES.map((table) => {
            const info = TABLE_INFO[table];
            const entry = tables?.[table];
            return (
              <div key={table} className="rounded-lg border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-900">{info.label}</h3>
                  <a href={info.href} className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                    Open page
                  </a>
                </div>
                {entry?.error ? (
                  <p className="mt-3 text-sm text-red-700">
                    Could not read this table: {entry.error}. Run the SQL file for {info.week} if the table does not exist yet.
                  </p>
                ) : !entry ? (
                  <p className="mt-3 text-sm text-zinc-500">{loading ? "Loading…" : "No data."}</p>
                ) : entry.rows.length === 0 ? (
                  <p className="mt-3 text-sm text-zinc-500">No records yet.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {entry.rows.map((row, i) => (
                      <li key={row.id ?? i} className="text-sm text-zinc-700">
                        <span>{describeRow(table, row)}</span>
                        <span className="block text-xs text-zinc-400">{formatDate(row.created_at)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10" aria-label="Ratings and feedback">
        <h2 className="text-xl font-semibold text-zinc-900">Ratings and tester feedback</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-zinc-900">Chat ratings (Week 5)</h3>
            <p className="mt-2 text-sm text-zinc-700">
              Thumbs up: <strong>{chatUp}</strong> · Thumbs down: <strong>{chatDown}</strong> · Sessions:{" "}
              <strong>{chatRows.length}</strong>
            </p>
            <p className="mt-1 text-xs text-zinc-500">Includes my own test sessions.</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-zinc-900">Demo feedback (Week 6)</h3>
            {feedbackSummary.total === 0 ? (
              <p className="mt-2 text-sm text-zinc-500">No data yet.</p>
            ) : (
              <p className="mt-2 text-sm text-zinc-700">
                Testers: <strong>{feedbackSummary.total}</strong> · Finished:{" "}
                <strong>{feedbackSummary.finished}</strong> · Average usefulness:{" "}
                <strong>{feedbackSummary.avgUsefulness}/5</strong> · Said it helped:{" "}
                <strong>{feedbackSummary.helpedYes}</strong> yes, <strong>{feedbackSummary.helpedSome}</strong> a
                little, <strong>{feedbackSummary.helpedNo}</strong> no
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-10" aria-label="Testing summary">
        <h2 className="text-xl font-semibold text-zinc-900">Testing summary</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Real numbers from my weekly packets. Where I do not have the number here, it says to see
          the packet.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Week</th>
                <th className="px-4 py-3">What was tested</th>
                <th className="px-4 py-3">Real people</th>
                <th className="px-4 py-3">Software checks</th>
                <th className="px-4 py-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {TEST_SUMMARY.map((row) => (
                <tr key={row.week}>
                  <td className="px-4 py-3 font-medium text-zinc-900">{row.week}</td>
                  <td className="px-4 py-3">{row.what}</td>
                  <td className="px-4 py-3">{row.people ?? "See the packet"}</td>
                  <td className="px-4 py-3">{row.checks ?? "See the packet"}</td>
                  <td className="px-4 py-3">{row.result}</td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-3 font-medium text-zinc-900">Week 6</td>
                <td className="px-4 py-3">Full demo walkthrough and full-site regression</td>
                <td className="px-4 py-3">
                  {feedbackSummary.total} external tester{feedbackSummary.total === 1 ? "" : "s"} so far (goal: 5)
                </td>
                <td className="px-4 py-3">Regression test on the live site</td>
                <td className="px-4 py-3">
                  {feedbackSummary.total === 0
                    ? "No data yet."
                    : `${feedbackSummary.finished} of ${feedbackSummary.total} finished the 7 steps; average usefulness ${feedbackSummary.avgUsefulness}/5.`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

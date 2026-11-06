"use client";

import { useEffect, useState } from "react";
import { saveVote, getVoteCounts } from "@/lib/supabaseClient";
import { abResult } from "@/lib/marketingEngine";
import { AB_MIN_VOTES } from "@/lib/brandData";

// One A/B test. Shows version A and B, lets a visitor vote once per browser
// (soft limit saved in localStorage), saves the vote in Supabase and shows
// the real counts and percent. No fake numbers: with 0 votes it shows 0.
export default function AbTester({ test }) {
  const storageKey = `studyforge-voted-${test.id}`;
  const [counts, setCounts] = useState({ A: 0, B: 0 });
  const [myVote, setMyVote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // { type: "ok" | "error", text }

  async function refresh() {
    const { data, error } = await getVoteCounts(test.id);
    setCounts(data);
    if (error) setMessage({ type: "error", text: error.message });
  }

  useEffect(() => {
    let active = true;
    getVoteCounts(test.id).then(({ data, error }) => {
      if (!active) return;
      setCounts(data);
      if (error) setMessage({ type: "error", text: error.message });
      let voted = null;
      try {
        voted = window.localStorage.getItem(storageKey);
      } catch {
        voted = null; // storage blocked: the page still works
      }
      setMyVote(voted);
    });
    return () => {
      active = false;
    };
  }, [test.id, storageKey]);

  async function handleVote(variant) {
    if (myVote || busy) return;
    setBusy(true);
    setMessage(null);
    const { error } = await saveVote({ testId: test.id, variant });
    if (error) {
      setMessage({ type: "error", text: `Could not save your vote: ${error.message}` });
      setBusy(false);
      return;
    }
    try {
      window.localStorage.setItem(storageKey, variant);
    } catch {
      // ignore: the vote is already saved in Supabase
    }
    setMyVote(variant);
    setMessage({ type: "ok", text: "Thanks! Your vote was saved." });
    await refresh();
    setBusy(false);
  }

  const result = abResult(counts);

  return (
    <article className="rounded-xl border border-zinc-200 p-6">
      <h3 className="text-lg font-semibold text-zinc-900">{test.title}</h3>
      <p className="mt-1 text-sm text-zinc-600">{test.question}</p>

      <div className="mt-4 space-y-4">
        {["A", "B"].map((variant) => {
          const pct = variant === "A" ? result.pctA : result.pctB;
          const votes = variant === "A" ? result.a : result.b;
          return (
            <div key={variant}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-zinc-900">
                  <span className="font-semibold">{variant}.</span> {test[variant]}
                </p>
                <button
                  type="button"
                  onClick={() => handleVote(variant)}
                  disabled={Boolean(myVote) || busy}
                  className="shrink-0 rounded-md bg-zinc-900 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
                >
                  {myVote === variant ? "Your vote" : "Vote"}
                </button>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-zinc-100">
                <div
                  className="h-2 rounded-full bg-indigo-600"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-600">
                {votes} {votes === 1 ? "vote" : "votes"} &middot; {pct}%
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm font-medium text-zinc-800">
        Total: {result.total} &middot; {result.message}
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Rule: a winner needs at least {AB_MIN_VOTES} votes and 60% for one version.
        One vote per browser.
      </p>
      {message && (
        <p
          className={`mt-3 text-sm ${message.type === "ok" ? "text-emerald-700" : "text-red-700"}`}
          role={message.type === "ok" ? "status" : "alert"}
        >
          {message.text}
        </p>
      )}
    </article>
  );
}

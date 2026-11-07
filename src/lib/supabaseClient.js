// src/lib/supabaseClient.js
//
// Thin wrapper around the Supabase JS client.
//
// This app reads its Supabase credentials from environment variables so the
// real keys never live in the source code. Until those variables are set
// (locally in .env.local, and in Vercel > Project Settings > Environment
// Variables), `supabase` will be `null` and any feature that needs the
// database should treat that as "not configured yet" instead of crashing.
//
// See README.md for the exact steps to create a Supabase project and wire
// up these values.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = Boolean(supabase);

// ---------------------------------------------------------------------------
// core_outputs — Week 1: Generative Core Agent
//
// Table created via sql/core_outputs.sql. Both helpers below are safe no-ops
// (return a clear "not configured" result) when Supabase isn't wired up yet,
// so the /core page still works locally even before the table exists.
// ---------------------------------------------------------------------------

export async function saveCoreOutput({ title, inputText, output }) {
  if (!supabase) {
    return { data: null, error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("core_outputs")
    .insert([{ title, input_text: inputText, output_json: output }])
    .select()
    .single();
  return { data, error };
}

export async function listCoreOutputs(limit = 10) {
  if (!supabase) {
    return { data: [], error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("core_outputs")
    .select("id, title, input_text, output_json, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return { data: data || [], error };
}

// ---------------------------------------------------------------------------
// research_outputs — Week 2: Research + Benchmarking Dashboard
//
// Table created via sql/research_outputs.sql. Stores the research/validation
// entries a student logs on /research (e.g. "talked to a classmate about
// messy notes"). The 5 global examples + 8 competitors shown on /research
// are static reference data (src/lib/researchData.js), not stored here.
// Same "not configured yet" safe no-op pattern as the core_outputs helpers.
// ---------------------------------------------------------------------------

export async function saveResearchOutput({ title, method, summary, validatesHypothesis }) {
  if (!supabase) {
    return { data: null, error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("research_outputs")
    .insert([
      {
        title,
        method,
        summary,
        validates_hypothesis: validatesHypothesis,
      },
    ])
    .select()
    .single();
  return { data, error };
}

export async function listResearchOutputs(limit = 10) {
  if (!supabase) {
    return { data: [], error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("research_outputs")
    .select("id, title, method, summary, validates_hypothesis, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return { data: data || [], error };
}

// ---------------------------------------------------------------------------
// pricing_scenarios — Week 3: Product Architecture + Pricing Simulator
//
// Table created via sql/pricing_scenarios.sql. Stores the pricing scenarios
// a student saves on /pricing (inputs + calculated monthly/annual revenue).
// Same "not configured yet" safe no-op pattern as the helpers above.
// ---------------------------------------------------------------------------

export async function saveScenario({ name, scenario, inputs, monthlyRevenue, annualRevenue }) {
  if (!supabase) {
    return { data: null, error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("pricing_scenarios")
    .insert([
      {
        name,
        scenario,
        inputs_json: inputs,
        monthly_revenue: monthlyRevenue,
        annual_revenue: annualRevenue,
      },
    ])
    .select()
    .single();
  return { data, error };
}

export async function listScenarios(limit = 10) {
  if (!supabase) {
    return { data: [], error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("pricing_scenarios")
    .select("id, name, scenario, inputs_json, monthly_revenue, annual_revenue, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return { data: data || [], error };
}

// ---------------------------------------------------------------------------
// marketing_assets + ab_votes — Week 4: Marketing Engine + Content System
//
// Tables created via sql/marketing.sql. marketing_assets stores the pieces a
// student saves on /marketing. ab_votes stores one row per real vote in the
// two A/B tests (test_id "headline" or "cta", variant "A" or "B").
// Same "not configured yet" safe no-op pattern as the helpers above.
// ---------------------------------------------------------------------------

export async function saveMarketingAsset({ assetType, title, content }) {
  if (!supabase) {
    return { data: null, error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("marketing_assets")
    .insert([{ asset_type: assetType, title, content }])
    .select()
    .single();
  return { data, error };
}

export async function listMarketingAssets(limit = 10) {
  if (!supabase) {
    return { data: [], error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("marketing_assets")
    .select("id, asset_type, title, content, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return { data: data || [], error };
}

export async function saveVote({ testId, variant }) {
  if (!supabase) {
    return { data: null, error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("ab_votes")
    .insert([{ test_id: testId, variant }])
    .select()
    .single();
  return { data, error };
}

// Returns { A: number, B: number } for one test. Counts rows in the browser
// after reading them, which is fine for the small number of votes here.
export async function getVoteCounts(testId) {
  if (!supabase) {
    return { data: { A: 0, B: 0 }, error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("ab_votes")
    .select("variant")
    .eq("test_id", testId);
  const counts = { A: 0, B: 0 };
  (data || []).forEach((row) => {
    if (row.variant === "A" || row.variant === "B") counts[row.variant] += 1;
  });
  return { data: counts, error };
}

// ---------------------------------------------------------------------------
// chat_sessions — Week 5: Public Chatbot / Guided Assistant
//
// Table created via sql/chat.sql. One row per finished /chat session, plus the
// thumbs up / down rating and optional comment added afterwards.
// Same "not configured yet" safe no-op pattern as the helpers above.
// ---------------------------------------------------------------------------

export async function saveChatSession({ answers, outcome, summary }) {
  if (!supabase) {
    return { data: null, error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert([{ answers, outcome, summary }])
    .select()
    .single();
  return { data, error };
}

// A session can be rated once: the update only matches rows with no rating.
export async function rateChatSession(id, rating, comment) {
  if (!supabase) {
    return { data: null, error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("chat_sessions")
    .update({ rating, comment: comment ? comment : null })
    .eq("id", id)
    .is("rating", null)
    .select()
    .single();
  return { data, error };
}

export async function listChatSessions(limit = 10) {
  if (!supabase) {
    return { data: [], error: { message: "Supabase is not configured yet." } };
  }
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id, answers, outcome, rating, comment, summary, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  return { data: data || [], error };
}

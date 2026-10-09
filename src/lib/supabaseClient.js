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

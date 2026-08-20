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

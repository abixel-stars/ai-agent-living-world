import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase Auth scaffold (spec section 2 and 16).
 *
 * The client is created ONLY when both env vars are present. No credentials
 * exist for this project yet, so in Phase 1 `supabase` is null and the login
 * screen offers the clearly labeled demo mode. Never put secrets in code:
 * set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a local .env file
 * (see .env.example). The anon key is a publishable key, not a secret, and
 * real security comes from Supabase RLS in Phase 3.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null =
  isSupabaseConfigured && url && anonKey ? createClient(url, anonKey) : null

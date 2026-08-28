import { createClient } from "@supabase/supabase-js";

// Server-only client. Uses the service role key so it can write to the
// waitlist table directly, bypassing RLS (which intentionally has no public
// insert policy; see supabase/schema.sql). Never import this from a
// client component.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

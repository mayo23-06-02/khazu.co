import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-free anonymous client for public, cacheable reads.
 *
 * The cookie-bound client in `server.ts` opts any caller out of static
 * rendering (Next treats `cookies()` as a request-time API), which breaks
 * routes like the sitemap that should be generated and cached. Active
 * listings are readable by `anon` under RLS, so no session is needed here.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

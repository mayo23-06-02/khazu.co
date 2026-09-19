import { createClient } from "@/lib/supabase/server";

/**
 * True if the caller is still under `max` hits for `key` within the
 * trailing `windowSeconds` (and records this call as a hit). Backed by the
 * `check_rate_limit` Postgres function (supabase/rate_limits.sql), which is
 * atomic under concurrent calls via an advisory lock.
 *
 * Fails open (returns true) if the RPC itself errors — e.g. the migration
 * hasn't been run yet — so a missing rate-limit table never blocks the
 * underlying feature, it just skips throttling until it's installed.
 */
export async function checkRateLimit(
  key: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_key: key,
      p_max: max,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      console.warn("checkRateLimit error (failing open):", error.message);
      return true;
    }

    return Boolean(data);
  } catch (err) {
    console.warn("checkRateLimit failed (failing open):", err);
    return true;
  }
}

/** Best-effort client IP from standard proxy headers, for use as a rate-limit key. */
export async function getClientIp(): Promise<string> {
  const { headers } = await import("next/headers");
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

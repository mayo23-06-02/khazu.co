/**
 * Defense-in-depth CSRF check for plain Route Handlers (unlike Next.js
 * Server Actions, these get no built-in Origin verification). Compares the
 * request's Origin — falling back to Referer — against the host the request
 * actually came in on (from the Host/X-Forwarded-Host header the platform
 * sets on every request), rejecting anything else.
 *
 * Deliberately NOT compared against a configured site URL (e.g.
 * NEXT_PUBLIC_SITE_URL / lib/seo/site.ts): that value can drift from the
 * domain the app is actually served on (a new Vercel deployment URL, a
 * staging domain, a misconfigured env var) — when it does, this check would
 * silently reject every legitimate same-origin request. Deriving "same
 * origin" from the request's own Host header instead makes the check
 * correct on any domain the request is genuinely arriving on.
 */
export function assertSameOrigin(req: Request): { ok: true } | { ok: false; status: number; error: string } {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  const actualOrigin = origin ?? (referer ? new URL(referer).origin : null);

  // Browsers always send Origin (and usually Referer) on cross-site
  // fetch/XHR/form submissions, so a mismatch there is a real cross-site
  // request. No Origin/Referer at all means a non-browser client (which
  // isn't riding on the victim's cookies the way a CSRF attack needs), so
  // we don't block those rather than risk breaking legitimate API clients.
  // Likewise, no Host header at all means we have nothing to compare
  // against — fail open rather than break every request in that case.
  if (actualOrigin && host && new URL(actualOrigin).host !== host) {
    return { ok: false, status: 403, error: "Cross-origin request rejected" };
  }

  return { ok: true };
}

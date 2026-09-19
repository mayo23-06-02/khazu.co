import { siteUrl } from "@/lib/seo/site";

/**
 * Defense-in-depth CSRF check for plain Route Handlers (unlike Next.js
 * Server Actions, these get no built-in Origin verification). Compares the
 * request's Origin — falling back to Referer — against the site's own
 * origin, rejecting anything else.
 */
export function assertSameOrigin(req: Request): { ok: true } | { ok: false; status: number; error: string } {
  const expectedOrigin = new URL(siteUrl).origin;
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  const actualOrigin = origin ?? (referer ? new URL(referer).origin : null);

  // Browsers always send Origin (and usually Referer) on cross-site
  // fetch/XHR/form submissions, so a mismatch there is a real cross-site
  // request. No Origin/Referer at all means a non-browser client (which
  // isn't riding on the victim's cookies the way a CSRF attack needs), so
  // we don't block those rather than risk breaking legitimate API clients.
  if (actualOrigin && actualOrigin !== expectedOrigin) {
    return { ok: false, status: 403, error: "Cross-origin request rejected" };
  }

  return { ok: true };
}

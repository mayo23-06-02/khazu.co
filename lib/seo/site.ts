/**
 * Central SEO config. Every canonical URL, sitemap entry and Open Graph tag
 * derives from `siteUrl`, so a domain change is a one-line edit (or a
 * NEXT_PUBLIC_SITE_URL override per environment).
 */

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://khazu.co.sz"
).replace(/\/$/, "");

export const siteName = "Khazu";

export const siteDescription =
  "Buy and sell cars in Eswatini. Browse used and new vehicles from trusted dealers and private sellers, or list your own car in minutes.";

/** Absolute URL for a site-relative path — required by Open Graph and sitemaps. */
export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Meta descriptions are truncated by search engines around 160 characters.
 * Trim on a word boundary so we never emit a half-word followed by an ellipsis.
 */
export function truncateDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

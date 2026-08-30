import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site";
import { createPublicClient } from "@/lib/supabase/public";

// Listings change often; regenerate hourly rather than on every request.
export const revalidate = 3600;

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/listings", changeFrequency: "hourly", priority: 0.9 },
  { path: "/deals", changeFrequency: "hourly", priority: 0.9 },
  { path: "/stock-cars", changeFrequency: "daily", priority: 0.8 },
  { path: "/dealers", changeFrequency: "weekly", priority: 0.7 },
  { path: "/sell", changeFrequency: "monthly", priority: 0.7 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.6 },
];

/**
 * Read listings with the cookie-free client: the session-bound one would
 * force this route to be request-time only, defeating `revalidate`.
 */
async function getListingEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("listings")
      .select("id, updated_at, created_at")
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(5000); // sitemap spec caps a single file at 50k URLs

    if (error) {
      console.error("sitemap listings:", error.message);
      return [];
    }

    return (data ?? []).map((listing) => ({
      url: absoluteUrl(`/deals/${listing.id}`),
      lastModified: new Date(listing.updated_at || listing.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (e) {
    // A Supabase outage or missing env must not take the whole sitemap
    // down — degrade to the static routes instead of throwing.
    console.error("sitemap listings:", e);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...staticEntries, ...await getListingEntries()];
}

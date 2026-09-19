import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/types/listing";
import type { MarketplaceListing, SellerSnippet } from "./types";

export type { MarketplaceListing, SellerSnippet } from "./types";
export { formatSzl, formatMileage, sellerDisplayName } from "./format";

const LISTING_SELECT = "*";

const SELLER_SNIPPET_COLUMNS =
  "id, full_name, phone, city, address, business_name, is_dealer, avatar_url, role";

/**
 * Seller info for listings is read from the `seller_public_profiles` view
 * (not the `profiles` table directly) — the view exposes only non-sensitive
 * columns to anon/authenticated, since `profiles` itself only allows a user
 * to read their own row (see supabase/fix_profiles_public_exposure.sql).
 */
async function attachSellerProfiles(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rows: Record<string, unknown>[],
): Promise<MarketplaceListing[]> {
  const sellerIds = Array.from(
    new Set(rows.map((r) => r.seller_id as string).filter(Boolean)),
  );

  let profilesById = new Map<string, SellerSnippet>();
  if (sellerIds.length > 0) {
    const { data: profiles, error } = await supabase
      .from("seller_public_profiles")
      .select(SELLER_SNIPPET_COLUMNS)
      .in("id", sellerIds);

    if (error) {
      console.error("attachSellerProfiles:", error.message);
    } else {
      profilesById = new Map(
        (profiles ?? []).map((p) => [p.id as string, p as SellerSnippet]),
      );
    }
  }

  return rows.map((row) => ({
    ...(row as unknown as Listing),
    profiles: profilesById.get(row.seller_id as string) ?? null,
  }));
}

export async function getActiveListings(): Promise<MarketplaceListing[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("status", "active")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getActiveListings:", error.message);
      return [];
    }

    return attachSellerProfiles(
      supabase,
      (data ?? []) as unknown as Record<string, unknown>[],
    );
  } catch (e) {
    console.error("getActiveListings failed:", e);
    return [];
  }
}

export async function getSponsoredDealerListings(
  limit = 24,
): Promise<MarketplaceListing[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("status", "active")
      .eq("is_featured", true)
      .eq("seller_type", "dealer")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("getSponsoredDealerListings:", error.message);
      return [];
    }

    return attachSellerProfiles(
      supabase,
      (data ?? []) as unknown as Record<string, unknown>[],
    );
  } catch (e) {
    console.error("getSponsoredDealerListings failed:", e);
    return [];
  }
}

/** Count only — used for marketing copy ("Search N cars") instead of a made-up number. */
export async function getActiveListingsCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "active");

    if (error) {
      console.error("getActiveListingsCount:", error.message);
      return 0;
    }

    return count ?? 0;
  } catch (e) {
    console.error("getActiveListingsCount failed:", e);
    return 0;
  }
}

export async function getRecentListings(
  limit = 12,
): Promise<MarketplaceListing[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("getRecentListings:", error.message);
      return [];
    }

    return attachSellerProfiles(
      supabase,
      (data ?? []) as unknown as Record<string, unknown>[],
    );
  } catch (e) {
    console.error("getRecentListings failed:", e);
    return [];
  }
}

/**
 * "Top rated" — there's no star-rating field on a listing, so this proxies
 * with the most-liked active listings as the closest signal we track.
 */
export async function getTopRatedListings(
  limit = 12,
): Promise<MarketplaceListing[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("status", "active")
      .order("likes_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("getTopRatedListings:", error.message);
      return [];
    }

    return attachSellerProfiles(
      supabase,
      (data ?? []) as unknown as Record<string, unknown>[],
    );
  } catch (e) {
    console.error("getTopRatedListings failed:", e);
    return [];
  }
}

/**
 * "Trending" — most-viewed among listings posted in the last 30 days, so a
 * popular but stale listing from months ago doesn't crowd out what's hot now.
 */
export async function getTrendingListings(
  limit = 12,
): Promise<MarketplaceListing[]> {
  try {
    const supabase = await createClient();
    const since = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("status", "active")
      .gte("created_at", since)
      .order("views_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("getTrendingListings:", error.message);
      return [];
    }

    return attachSellerProfiles(
      supabase,
      (data ?? []) as unknown as Record<string, unknown>[],
    );
  } catch (e) {
    console.error("getTrendingListings failed:", e);
    return [];
  }
}

export async function getListingById(
  id: string,
): Promise<MarketplaceListing | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("getListingById:", error.message);
      return null;
    }
    if (!data) return null;

    const [listing] = await attachSellerProfiles(supabase, [
      data as unknown as Record<string, unknown>,
    ]);
    if (listing.status !== "active") return null;
    return listing;
  } catch (e) {
    console.error("getListingById failed:", e);
    return null;
  }
}

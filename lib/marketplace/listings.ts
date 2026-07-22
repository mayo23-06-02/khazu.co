import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/types/listing";
import type { MarketplaceListing, SellerSnippet } from "./types";

export type { MarketplaceListing, SellerSnippet } from "./types";
export { formatSzl, formatMileage, sellerDisplayName } from "./format";

const LISTING_SELECT = `
  *,
  profiles:seller_id (
    full_name,
    phone,
    city,
    address,
    business_name,
    is_dealer,
    avatar_url,
    role
  )
`;

function normalizeProfile(
  raw: SellerSnippet | SellerSnippet[] | null | undefined,
): SellerSnippet | null {
  if (!raw) return null;
  return Array.isArray(raw) ? raw[0] ?? null : raw;
}

function normalizeRow(row: Record<string, unknown>): MarketplaceListing {
  const profiles = normalizeProfile(
    row.profiles as SellerSnippet | SellerSnippet[] | null,
  );
  return { ...(row as unknown as Listing), profiles };
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

    return (data ?? []).map((row) =>
      normalizeRow(row as unknown as Record<string, unknown>),
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

    return (data ?? []).map((row) =>
      normalizeRow(row as unknown as Record<string, unknown>),
    );
  } catch (e) {
    console.error("getSponsoredDealerListings failed:", e);
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

    const listing = normalizeRow(data as unknown as Record<string, unknown>);
    if (listing.status !== "active") return null;
    return listing;
  } catch (e) {
    console.error("getListingById failed:", e);
    return null;
  }
}

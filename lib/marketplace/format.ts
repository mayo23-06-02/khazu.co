import type { MarketplaceListing } from "./types";

export function formatSzl(price: number | string | null | undefined): string {
  const n = Number(price) || 0;
  return `SZL ${new Intl.NumberFormat("en-SZ").format(Math.round(n))}`;
}

export function formatMileage(km: number | null | undefined): string {
  if (km == null) return "—";
  return `${new Intl.NumberFormat("en-SZ").format(km)} km`;
}

export function sellerDisplayName(listing: {
  seller_type?: string;
  profiles?: {
    business_name?: string | null;
    full_name?: string | null;
  } | null;
}): string {
  const p = listing.profiles;
  if (p?.business_name) return p.business_name;
  if (p?.full_name) return p.full_name;
  return listing.seller_type === "dealer" ? "Dealer" : "Private seller";
}

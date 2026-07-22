import type { Listing } from "@/types/listing";

export type SellerSnippet = {
  full_name: string | null;
  phone: string | null;
  city: string | null;
  address: string | null;
  business_name: string | null;
  is_dealer: boolean | null;
  avatar_url: string | null;
  role: string | null;
};

export type MarketplaceListing = Listing & {
  profiles?: SellerSnippet | null;
};

import { createClient } from "@/lib/supabase/server";

export interface DealerDirectoryEntry {
  id: string;
  business_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  address: string | null;
  bio: string | null;
  phone: string | null;
  website: string | null;
  years_in_operation: number | null;
  is_registered_business: boolean;
  activeListings: number;
}

export async function getDealerDirectory(): Promise<DealerDirectoryEntry[]> {
  try {
    const supabase = await createClient();
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select(
        "id, business_name, full_name, avatar_url, city, address, bio, phone, website, years_in_operation, is_registered_business",
      )
      .eq("is_dealer", true)
      .order("business_name", { ascending: true });

    if (error) {
      console.error("getDealerDirectory:", error.message);
      return [];
    }

    const dealerIds = (profiles ?? []).map((p) => p.id as string);
    const counts: Record<string, number> = {};

    if (dealerIds.length > 0) {
      const { data: listings, error: listingsError } = await supabase
        .from("listings")
        .select("seller_id")
        .eq("status", "active")
        .in("seller_id", dealerIds);

      if (listingsError) {
        console.error("getDealerDirectory listings:", listingsError.message);
      } else {
        for (const row of listings ?? []) {
          const id = row.seller_id as string;
          counts[id] = (counts[id] ?? 0) + 1;
        }
      }
    }

    return (profiles ?? []).map((p) => ({
      ...(p as Omit<DealerDirectoryEntry, "activeListings">),
      activeListings: counts[p.id as string] ?? 0,
    }));
  } catch (e) {
    console.error("getDealerDirectory failed:", e);
    return [];
  }
}

/** Count only — used for marketing copy ("From N dealers") instead of a made-up number. */
export async function getDealerCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_dealer", true);

    if (error) {
      console.error("getDealerCount:", error.message);
      return 0;
    }

    return count ?? 0;
  } catch (e) {
    console.error("getDealerCount failed:", e);
    return 0;
  }
}

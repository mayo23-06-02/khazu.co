import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/types/listing";

export async function getSellerListings(userId: string): Promise<Listing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("seller_id", userId)
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getSellerListings:", error.message);
    return [];
  }
  return (data ?? []) as Listing[];
}

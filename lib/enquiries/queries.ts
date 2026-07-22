import { createClient } from "@/lib/supabase/server";
import type { EnquiryWithListing } from "@/types/enquiry";

export async function getEnquiriesForSeller(
  userId: string,
): Promise<EnquiryWithListing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*, listings:listing_id(make, model, year, price, images)")
    .eq("seller_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getEnquiriesForSeller:", error.message);
    return [];
  }

  return (data ?? []) as unknown as EnquiryWithListing[];
}

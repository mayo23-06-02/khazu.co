"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export type SubmitEnquiryResult = {
  success: boolean;
  error?: string;
};

export type SubmitEnquiryInput = {
  listingId: string;
  name: string;
  phone: string;
  message: string;
};

// Public-facing (buyer may be anonymous) — uses the admin client since a
// browsing buyer has no session to satisfy listings' owner-only RLS reads.
export async function submitEnquiry(
  input: SubmitEnquiryInput,
): Promise<SubmitEnquiryResult> {
  try {
    const name = input.name.trim();
    const phone = input.phone.trim();
    const message = input.message.trim();

    if (!input.listingId || !name || !phone || !message) {
      return { success: false, error: "Please fill in all fields." };
    }
    if (!/^\d{7,8}$/.test(phone)) {
      return { success: false, error: "Enter a valid phone number." };
    }

    const admin = createAdminClient();

    const { data: listing, error: listingError } = await admin
      .from("listings")
      .select("id, seller_id, status")
      .eq("id", input.listingId)
      .maybeSingle();

    if (listingError || !listing || listing.status !== "active") {
      return { success: false, error: "This listing is no longer available." };
    }

    const { error } = await admin.from("enquiries").insert({
      listing_id: listing.id,
      seller_id: listing.seller_id,
      name,
      phone,
      message,
    });

    if (error) {
      const missing =
        error.message.includes("schema cache") ||
        error.message.includes("Could not find the table");
      return {
        success: false,
        error: missing
          ? "Enquiries table missing. Run supabase/enquiries.sql in the Supabase SQL Editor."
          : error.message,
      };
    }

    // Non-fatal: keeps the existing contacts_count / daily-stats counters
    // (driven by listing_events) in sync with enquiries too.
    try {
      await admin.from("listing_events").insert({
        listing_id: listing.id,
        seller_id: listing.seller_id,
        event_type: "contact",
        message: "enquiry",
      });
    } catch {
      /* ignore */
    }

    revalidatePath("/dashboard/dealer/leads");
    revalidatePath("/dashboard/personal/messages");

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send enquiry",
    };
  }
}

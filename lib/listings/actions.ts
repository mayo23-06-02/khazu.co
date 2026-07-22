"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ListingEventType, SellerType } from "@/types/listing";

export type ListingActionResult = {
  success: boolean;
  error?: string;
  listingId?: string;
};

export type CreateListingInput = {
  reg_number?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  drive_type?: string;
  engine_size?: string;
  power_kw?: number | null;
  torque_nm?: number | null;
  doors?: number | null;
  seats?: number | null;
  colour?: string;
  condition?: string;
  features?: string[];
  description?: string;
  price: number;
  negotiable?: boolean;
  accepts_installments?: boolean;
  deposit_amount?: number | null;
  installment_months?: number | null;
  images?: string[];
  seller_type?: SellerType;
  status?: "draft" | "active";
};

export async function createListing(
  input: CreateListingInput,
): Promise<ListingActionResult & { code?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be signed in to list a car." };
    }

    // Payment / trial gate — free trial = 1 listing once; next needs paid plan
    const { assertCanCreateListing } = await import(
      "@/lib/subscriptions/entitlement"
    );
    const gate = await assertCanCreateListing();
    if (!gate.ok) {
      return {
        success: false,
        error: gate.error || "Payment required before posting a vehicle.",
        code: "PAYMENT_REQUIRED",
      };
    }

    if (!input.make?.trim() || !input.model?.trim()) {
      return { success: false, error: "Make and model are required." };
    }
    if (!input.year || input.price == null || Number.isNaN(Number(input.price))) {
      return { success: false, error: "Year and price are required." };
    }

    const sellerType: SellerType =
      input.seller_type === "dealer" ? "dealer" : "individual";

    const { data, error } = await supabase
      .from("listings")
      .insert({
        seller_id: user.id,
        seller_type: sellerType,
        reg_number: input.reg_number || null,
        make: input.make.trim(),
        model: input.model.trim(),
        year: Number(input.year),
        mileage: Number(input.mileage) || 0,
        body_type: input.body_type || null,
        fuel_type: input.fuel_type || null,
        transmission: input.transmission || null,
        drive_type: input.drive_type || null,
        engine_size: input.engine_size || null,
        power_kw: input.power_kw ?? null,
        torque_nm: input.torque_nm ?? null,
        doors: input.doors ?? null,
        seats: input.seats ?? null,
        colour: input.colour || null,
        condition: input.condition || null,
        features: input.features ?? [],
        description: input.description || null,
        price: Number(input.price),
        negotiable: input.negotiable ?? true,
        accepts_installments: input.accepts_installments ?? false,
        deposit_amount: input.deposit_amount ?? null,
        installment_months: input.installment_months ?? null,
        images: input.images ?? [],
        status: input.status ?? "active",
      })
      .select("id")
      .single();

    if (error) {
      const missing =
        error.message.includes("schema cache") ||
        error.message.includes("Could not find the table");
      return {
        success: false,
        error: missing
          ? "Listings table missing. Run supabase/personal_dashboard.sql in the Supabase SQL Editor."
          : error.message,
      };
    }

    revalidatePath("/dashboard/personal");
    revalidatePath("/dashboard/personal/listings");
    revalidatePath("/dashboard/personal/subscription");
    revalidatePath("/dashboard/dealer");
    revalidatePath("/dashboard/dealer/listings");
    revalidatePath("/dashboard/dealer/subscription");
    revalidatePath("/listings");

    return { success: true, listingId: data.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create listing",
    };
  }
}

export type UpdateListingInput = {
  reg_number?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  drive_type?: string;
  engine_size?: string;
  power_kw?: number | null;
  torque_nm?: number | null;
  doors?: number | null;
  seats?: number | null;
  colour?: string;
  condition?: string;
  features?: string[];
  description?: string;
  price: number;
  negotiable?: boolean;
  accepts_installments?: boolean;
  deposit_amount?: number | null;
  installment_months?: number | null;
};

export async function updateListing(
  listingId: string,
  input: UpdateListingInput,
): Promise<ListingActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    if (!input.make?.trim() || !input.model?.trim()) {
      return { success: false, error: "Make and model are required." };
    }
    if (!input.year || input.price == null || Number.isNaN(Number(input.price))) {
      return { success: false, error: "Year and price are required." };
    }

    const { data: existing, error: existingError } = await supabase
      .from("listings")
      .select("id, price")
      .eq("id", listingId)
      .eq("seller_id", user.id)
      .maybeSingle();

    if (existingError) return { success: false, error: existingError.message };
    if (!existing) return { success: false, error: "Listing not found" };

    const newPrice = Number(input.price);
    // A price drop keeps the prior price so the marketplace can show a
    // "-X%" badge with the old price struck through; raising the price
    // (or leaving it unchanged) clears the badge.
    const previousPrice =
      newPrice < Number(existing.price) ? Number(existing.price) : null;

    const { error } = await supabase
      .from("listings")
      .update({
        reg_number: input.reg_number || null,
        make: input.make.trim(),
        model: input.model.trim(),
        year: Number(input.year),
        mileage: Number(input.mileage) || 0,
        body_type: input.body_type || null,
        fuel_type: input.fuel_type || null,
        transmission: input.transmission || null,
        drive_type: input.drive_type || null,
        engine_size: input.engine_size || null,
        power_kw: input.power_kw ?? null,
        torque_nm: input.torque_nm ?? null,
        doors: input.doors ?? null,
        seats: input.seats ?? null,
        colour: input.colour || null,
        condition: input.condition || null,
        features: input.features ?? [],
        description: input.description || null,
        price: newPrice,
        previous_price: previousPrice,
        negotiable: input.negotiable ?? true,
        accepts_installments: input.accepts_installments ?? false,
        deposit_amount: input.deposit_amount ?? null,
        installment_months: input.installment_months ?? null,
      })
      .eq("id", listingId)
      .eq("seller_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/personal");
    revalidatePath("/dashboard/personal/listings");
    revalidatePath("/dashboard/dealer");
    revalidatePath("/dashboard/dealer/listings");
    revalidatePath("/listings");
    revalidatePath(`/deals/${listingId}`);

    return { success: true, listingId };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update listing",
    };
  }
}

export async function archiveListing(
  listingId: string,
): Promise<ListingActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("listings")
      .update({ status: "archived" })
      .eq("id", listingId)
      .eq("seller_id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/personal");
    revalidatePath("/dashboard/personal/listings");
    return { success: true, listingId };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to archive listing",
    };
  }
}

export async function recordListingEvent(input: {
  listingId: string;
  eventType: ListingEventType;
  message?: string;
}): Promise<ListingActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, seller_id, status")
      .eq("id", input.listingId)
      .maybeSingle();

    if (listingError || !listing) {
      return { success: false, error: "Listing not found" };
    }

    const { error } = await supabase.from("listing_events").insert({
      listing_id: listing.id,
      seller_id: listing.seller_id,
      actor_id: user?.id ?? null,
      event_type: input.eventType,
      message: input.message ?? null,
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/personal");
    return { success: true, listingId: listing.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to record event",
    };
  }
}

export async function createMockBoost(listingId: string): Promise<ListingActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: listing } = await supabase
      .from("listings")
      .select("id, seller_id")
      .eq("id", listingId)
      .eq("seller_id", user.id)
      .maybeSingle();

    if (!listing) return { success: false, error: "Listing not found" };

    const starts = new Date();
    const ends = new Date();
    ends.setDate(ends.getDate() + 14);

    const startsAt = starts.toISOString().slice(0, 10);
    const endsAt = ends.toISOString().slice(0, 10);

    const { error } = await supabase.from("listing_boosts").insert({
      listing_id: listing.id,
      seller_id: user.id,
      amount_szl: 25,
      starts_at: startsAt,
      ends_at: endsAt,
      status: "active",
    });

    if (error) return { success: false, error: error.message };

    await supabase.from("listing_events").insert({
      listing_id: listing.id,
      seller_id: user.id,
      actor_id: user.id,
      event_type: "boost_started",
      message: "SZL 25 for 14-day featured placement",
    });

    await supabase
      .from("listings")
      .update({ is_featured: true })
      .eq("id", listing.id);

    revalidatePath("/dashboard/personal");
    revalidatePath("/dashboard/personal/listings");
    return { success: true, listingId: listing.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create boost",
    };
  }
}

export async function updateProfile(input: {
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  bio?: string;
}): Promise<ListingActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: input.full_name.trim(),
        phone: input.phone?.trim() || null,
        address: input.address?.trim() || null,
        city: input.city?.trim() || null,
        bio: input.bio?.trim() || null,
      })
      .eq("id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/dashboard/personal");
    revalidatePath("/dashboard/personal/profile");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update profile",
    };
  }
}

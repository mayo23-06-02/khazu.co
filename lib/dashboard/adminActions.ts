"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export type AdminActionResult = { success: boolean; error?: string };

export async function approveListing(listingId: string): Promise<AdminActionResult> {
  await requireAdmin("/dashboard/admin/listings");
  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update({ moderation_status: "approved", moderation_notes: null })
    .eq("id", listingId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/admin/listings");
  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function rejectListing(
  listingId: string,
  notes: string,
): Promise<AdminActionResult> {
  await requireAdmin("/dashboard/admin/listings");
  const supabase = await createClient();
  const { error } = await supabase
    .from("listings")
    .update({ moderation_status: "rejected", moderation_notes: notes || null })
    .eq("id", listingId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/admin/listings");
  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function suspendUser(userId: string): Promise<AdminActionResult> {
  await requireAdmin("/dashboard/admin/users");
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ account_status: "suspended" })
    .eq("id", userId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function reactivateUser(userId: string): Promise<AdminActionResult> {
  await requireAdmin("/dashboard/admin/users");
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ account_status: "active" })
    .eq("id", userId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function resolveFraudFlag(
  flagId: string,
  status: "dismissed" | "actioned",
): Promise<AdminActionResult> {
  await requireAdmin("/dashboard/admin/fraud");
  const supabase = await createClient();
  const { error } = await supabase
    .from("fraud_flags")
    .update({ status, resolved_at: new Date().toISOString() })
    .eq("id", flagId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/admin/fraud");
  revalidatePath("/dashboard/admin");
  return { success: true };
}

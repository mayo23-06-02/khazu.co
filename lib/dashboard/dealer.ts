import { createClient } from "@/lib/supabase/server";
import type { DealerDashboardData } from "@/types/dashboard";
import { getPersonalDashboardData } from "./personal";
import { pctChange } from "./format";

export async function getDealerDashboardData(
  userId: string,
): Promise<DealerDashboardData> {
  const supabase = await createClient();

  const [base, listingsRes, enquiriesRes] = await Promise.all([
    getPersonalDashboardData(userId),
    supabase
      .from("listings")
      .select("status, updated_at")
      .eq("seller_id", userId),
    supabase.from("enquiries").select("id, created_at").eq("seller_id", userId),
  ]);

  const listings = listingsRes.data ?? [];
  const enquiries = enquiriesRes.data ?? [];

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // "Sold" has no dedicated timestamp column, so we treat updated_at at the
  // point status flips to "sold" as a reasonable proxy for the sale date.
  const soldListings = listings.filter((l) => l.status === "sold");
  const soldThisMonth = soldListings.filter(
    (l) => new Date(l.updated_at) >= startOfMonth,
  ).length;
  const soldPrevMonth = soldListings.filter((l) => {
    const d = new Date(l.updated_at);
    return d >= startOfPrevMonth && d < startOfMonth;
  }).length;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const leads30 = enquiries.filter(
    (e) => new Date(e.created_at) >= thirtyDaysAgo,
  ).length;
  const leadsPrev30 = enquiries.filter((e) => {
    const d = new Date(e.created_at);
    return d >= sixtyDaysAgo && d < thirtyDaysAgo;
  }).length;

  const totalLeads = enquiries.length;
  const conversionRatePct =
    totalLeads > 0
      ? Math.round((soldListings.length / totalLeads) * 1000) / 10
      : 0;

  return {
    ...base,
    soldThisMonth,
    soldTrendPct: pctChange(soldThisMonth, soldPrevMonth),
    totalLeads,
    leadsTrendPct: pctChange(leads30, leadsPrev30),
    conversionRatePct,
  };
}

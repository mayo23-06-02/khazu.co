import { createClient } from "@/lib/supabase/server";
import { pctChange } from "./format";
import type {
  AdminDashboardData,
  AdminFraudFlagRow,
  AdminListingRow,
  AdminPaymentRow,
  AdminReportRow,
  AdminUserRow,
  PaginatedResult,
} from "@/types/dashboard";

const PAGE_SIZE_DEFAULT = 20;

type SellerProfile = { full_name: string | null; business_name: string | null };

function paginationRange(page: number, pageSize: number) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { from, to };
}

function sellerName(profile: SellerProfile | undefined) {
  return profile?.business_name || profile?.full_name || "Unknown seller";
}

/** Fetches profiles for a set of ids and returns a lookup map, avoiding
 * PostgREST FK-embed syntax (this codebase joins in JS elsewhere too). */
async function profileLookup(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ids: (string | null | undefined)[],
): Promise<Record<string, SellerProfile>> {
  const uniqueIds = Array.from(new Set(ids.filter((id): id is string => !!id)));
  if (uniqueIds.length === 0) return {};
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, business_name")
    .in("id", uniqueIds);
  const map: Record<string, SellerProfile> = {};
  for (const row of data ?? []) {
    map[row.id] = { full_name: row.full_name, business_name: row.business_name };
  }
  return map;
}

export async function getAdminOverviewData(): Promise<AdminDashboardData> {
  const supabase = await createClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [usersRes, listingsRes, pendingListingsRes, subsRes, fraudRes, fraudPatternRes] =
    await Promise.all([
      supabase.from("profiles").select("id, role, created_at"),
      supabase.from("listings").select("id, moderation_status"),
      supabase
        .from("listings")
        .select(
          "id, make, model, year, price, images, status, moderation_status, moderation_notes, created_at, seller_id",
        )
        .eq("moderation_status", "pending")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("subscriptions")
        .select("price_szl, status, created_at")
        .in("status", ["active", "trialing"]),
      supabase.from("fraud_flags").select("id, status").eq("status", "open"),
      supabase.from("fraud_flags").select("pattern").eq("status", "open"),
    ]);

  const users = usersRes.data ?? [];
  const listings = listingsRes.data ?? [];
  const subs = subsRes.data ?? [];
  const pendingListingsRaw = pendingListingsRes.data ?? [];

  const totalUsersThisMonth = users.filter(
    (u) => new Date(u.created_at) >= startOfMonth,
  ).length;
  const totalUsersPrevMonth = users.filter((u) => {
    const d = new Date(u.created_at);
    return d >= startOfPrevMonth && d < startOfMonth;
  }).length;

  const revenueThisMonth = subs
    .filter((s) => new Date(s.created_at) >= startOfMonth)
    .reduce((sum, s) => sum + Number(s.price_szl), 0);
  const revenuePrevMonth = subs
    .filter((s) => {
      const d = new Date(s.created_at);
      return d >= startOfPrevMonth && d < startOfMonth;
    })
    .reduce((sum, s) => sum + Number(s.price_szl), 0);

  // Last 6 months of revenue for the trend chart.
  const revenueSeries: { name: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const value = subs
      .filter((s) => {
        const d = new Date(s.created_at);
        return d >= monthStart && d < monthEnd;
      })
      .reduce((sum, s) => sum + Number(s.price_szl), 0);
    revenueSeries.push({
      name: monthStart.toLocaleDateString("en-GB", { month: "short" }),
      value,
    });
  }

  const patternCounts = new Map<string, number>();
  for (const row of fraudPatternRes.data ?? []) {
    patternCounts.set(row.pattern, (patternCounts.get(row.pattern) ?? 0) + 1);
  }

  const profiles = await profileLookup(
    supabase,
    pendingListingsRaw.map((l) => l.seller_id),
  );

  const pendingListings: AdminListingRow[] = pendingListingsRaw.map((l) => ({
    id: l.id,
    make: l.make,
    model: l.model,
    year: l.year,
    price: Number(l.price),
    image: l.images?.[0] ?? null,
    status: l.status,
    moderationStatus: l.moderation_status,
    moderationNotes: l.moderation_notes,
    sellerName: sellerName(profiles[l.seller_id]),
    createdAt: l.created_at,
  }));

  return {
    totalUsers: users.length,
    totalUsersTrendPct: pctChange(totalUsersThisMonth, totalUsersPrevMonth),
    totalDealers: users.filter((u) => u.role === "dealer").length,
    totalListings: listings.length,
    pendingModeration: listings.filter((l) => l.moderation_status === "pending")
      .length,
    monthlyRevenueSzl: revenueThisMonth,
    revenueTrendPct: pctChange(revenueThisMonth, revenuePrevMonth),
    openFraudFlags: (fraudRes.data ?? []).length,
    revenueSeries,
    pendingListings,
    fraudPatterns: Array.from(patternCounts.entries()).map(([pattern, count]) => ({
      pattern,
      count,
    })),
  };
}

export async function getAdminUsers({
  page = 1,
  pageSize = PAGE_SIZE_DEFAULT,
  search = "",
  roleFilter,
  statusFilter,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  roleFilter?: string;
  statusFilter?: "active" | "suspended";
}): Promise<PaginatedResult<AdminUserRow>> {
  const supabase = await createClient();
  const { from, to } = paginationRange(page, pageSize);

  let query = supabase
    .from("profiles")
    .select("id, full_name, business_name, role, account_status, created_at", {
      count: "exact",
    });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,business_name.ilike.%${search}%`);
  }
  if (roleFilter) query = query.eq("role", roleFilter);
  if (statusFilter) query = query.eq("account_status", statusFilter);

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const rows: AdminUserRow[] = (data ?? []).map((u) => ({
    id: u.id,
    fullName: u.full_name || "Unnamed user",
    businessName: u.business_name,
    role: u.role,
    accountStatus: u.account_status,
    createdAt: u.created_at,
  }));

  const totalCount = count ?? rows.length;
  return { rows, page, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)), totalCount };
}

export async function getAdminListings({
  page = 1,
  pageSize = PAGE_SIZE_DEFAULT,
  search = "",
  moderationFilter,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  moderationFilter?: "pending" | "approved" | "rejected";
}): Promise<PaginatedResult<AdminListingRow>> {
  const supabase = await createClient();
  const { from, to } = paginationRange(page, pageSize);

  let query = supabase
    .from("listings")
    .select(
      "id, make, model, year, price, images, status, moderation_status, moderation_notes, created_at, seller_id",
      { count: "exact" },
    );

  if (search) {
    query = query.or(`make.ilike.%${search}%,model.ilike.%${search}%`);
  }
  if (moderationFilter) query = query.eq("moderation_status", moderationFilter);

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const listings = data ?? [];
  const profiles = await profileLookup(supabase, listings.map((l) => l.seller_id));

  const rows: AdminListingRow[] = listings.map((l) => ({
    id: l.id,
    make: l.make,
    model: l.model,
    year: l.year,
    price: Number(l.price),
    image: l.images?.[0] ?? null,
    status: l.status,
    moderationStatus: l.moderation_status,
    moderationNotes: l.moderation_notes,
    sellerName: sellerName(profiles[l.seller_id]),
    createdAt: l.created_at,
  }));

  const totalCount = count ?? rows.length;
  return { rows, page, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)), totalCount };
}

export async function getAdminPayments({
  page = 1,
  pageSize = PAGE_SIZE_DEFAULT,
  statusFilter,
}: {
  page?: number;
  pageSize?: number;
  statusFilter?: string;
}): Promise<PaginatedResult<AdminPaymentRow>> {
  const supabase = await createClient();
  const { from, to } = paginationRange(page, pageSize);

  let query = supabase
    .from("subscriptions")
    .select("id, user_id, plan_name, price_szl, status, created_at", {
      count: "exact",
    });

  if (statusFilter) query = query.eq("status", statusFilter);

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const subs = data ?? [];
  const profiles = await profileLookup(supabase, subs.map((s) => s.user_id));

  const rows: AdminPaymentRow[] = subs.map((s) => ({
    id: s.id,
    userName: sellerName(profiles[s.user_id]),
    planName: s.plan_name,
    priceSzl: Number(s.price_szl),
    status: s.status,
    createdAt: s.created_at,
  }));

  const totalCount = count ?? rows.length;
  return { rows, page, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)), totalCount };
}

export async function getAdminFraudFlags({
  page = 1,
  pageSize = PAGE_SIZE_DEFAULT,
  statusFilter,
}: {
  page?: number;
  pageSize?: number;
  statusFilter?: "open" | "dismissed" | "actioned";
}): Promise<PaginatedResult<AdminFraudFlagRow>> {
  const supabase = await createClient();
  const { from, to } = paginationRange(page, pageSize);

  let query = supabase
    .from("fraud_flags")
    .select("id, pattern, risk_score, status, listing_id, user_id, created_at", {
      count: "exact",
    });

  if (statusFilter) query = query.eq("status", statusFilter);

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const flags = data ?? [];
  const listingIds = Array.from(
    new Set(flags.map((f) => f.listing_id).filter((id): id is string => !!id)),
  );
  const [listingsRes, profiles] = await Promise.all([
    listingIds.length
      ? supabase.from("listings").select("id, make, model").in("id", listingIds)
      : Promise.resolve({ data: [] as { id: string; make: string; model: string }[] }),
    profileLookup(supabase, flags.map((f) => f.user_id)),
  ]);
  const listingLabels: Record<string, string> = {};
  for (const l of listingsRes.data ?? []) {
    listingLabels[l.id] = `${l.make} ${l.model}`;
  }

  const rows: AdminFraudFlagRow[] = flags.map((f) => ({
    id: f.id,
    pattern: f.pattern,
    riskScore: f.risk_score,
    status: f.status,
    listingId: f.listing_id,
    listingLabel: f.listing_id ? listingLabels[f.listing_id] ?? null : null,
    userId: f.user_id,
    userName: f.user_id ? sellerName(profiles[f.user_id]) : null,
    createdAt: f.created_at,
  }));

  const totalCount = count ?? rows.length;
  return { rows, page, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)), totalCount };
}

export async function getAdminReports(): Promise<AdminReportRow[]> {
  const supabase = await createClient();
  const [listingsRes, usersRes, subsRes] = await Promise.all([
    supabase.from("listings").select("created_at"),
    supabase.from("profiles").select("created_at"),
    supabase.from("subscriptions").select("price_szl, created_at"),
  ]);

  const listings = listingsRes.data ?? [];
  const users = usersRes.data ?? [];
  const subs = subsRes.data ?? [];

  const rows: AdminReportRow[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const inMonth = (iso: string) => {
      const d = new Date(iso);
      return d >= monthStart && d < monthEnd;
    };
    rows.push({
      label: monthStart.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }),
      listings: listings.filter((l) => inMonth(l.created_at)).length,
      newUsers: users.filter((u) => inMonth(u.created_at)).length,
      revenueSzl: subs
        .filter((s) => inMonth(s.created_at))
        .reduce((sum, s) => sum + Number(s.price_szl), 0),
    });
  }
  return rows;
}

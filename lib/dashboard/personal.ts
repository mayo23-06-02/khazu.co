import { createClient } from "@/lib/supabase/server";
import type {
  CalendarReminder,
  DashboardActivityItem,
  DashboardStats,
  EngagementPoint,
  PersonalDashboardData,
} from "@/types/dashboard";
import type {
  Listing,
  ListingBoost,
  ListingDailyStat,
  ListingEvent,
} from "@/types/listing";
import {
  firstNameFromFullName,
  formatRelativeTime,
  lastNDays,
  listingLabel,
  pctChange,
  shortDayLabel,
} from "./format";

export { getSellerListings } from "@/lib/listings/queries";

const CHART_DAYS = 14;

function emptyStats(): DashboardStats {
  return {
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalContacts: 0,
    avgViewsPerListing: 0,
    viewsTrendPct: null,
    contactsTrendPct: null,
    listingsTrendPct: null,
  };
}

function buildSeries(
  days: string[],
  rows: Pick<ListingDailyStat, "day" | "views" | "likes" | "comments">[],
): EngagementPoint[] {
  const byDay = new Map<string, { views: number; likes: number; comments: number }>();
  for (const d of days) byDay.set(d, { views: 0, likes: 0, comments: 0 });
  for (const r of rows) {
    const key = r.day;
    const cur = byDay.get(key) ?? { views: 0, likes: 0, comments: 0 };
    cur.views += r.views ?? 0;
    cur.likes += r.likes ?? 0;
    cur.comments += r.comments ?? 0;
    byDay.set(key, cur);
  }
  return days.map((day) => {
    const v = byDay.get(day)!;
    return {
      day,
      name: shortDayLabel(day),
      views: v.views,
      likes: v.likes,
      comments: v.comments,
    };
  });
}

function mapEventToActivity(
  event: ListingEvent & {
    listings?: { make: string; model: string; year: number } | null;
  },
): DashboardActivityItem | null {
  const vehicle = event.listings
    ? listingLabel(event.listings.year, event.listings.make, event.listings.model)
    : "your listing";

  switch (event.event_type) {
    case "like":
      return {
        id: event.id,
        type: "like",
        text: `Someone liked your ${vehicle}`,
        time: formatRelativeTime(event.created_at),
        createdAt: event.created_at,
      };
    case "comment":
      return {
        id: event.id,
        type: "comment",
        text: event.message
          ? `Comment on your ${vehicle}: “${event.message}”`
          : `New comment on your ${vehicle}`,
        time: formatRelativeTime(event.created_at),
        createdAt: event.created_at,
      };
    case "contact":
      return {
        id: event.id,
        type: "notification",
        text: `New lead / contact on your ${vehicle}`,
        time: formatRelativeTime(event.created_at),
        createdAt: event.created_at,
      };
    case "boost_started":
      return {
        id: event.id,
        type: "notification",
        text: `Boost started on your ${vehicle}`,
        time: formatRelativeTime(event.created_at),
        createdAt: event.created_at,
      };
    case "boost_ended":
      return {
        id: event.id,
        type: "reminder",
        text: `Boost ended on your ${vehicle}`,
        time: formatRelativeTime(event.created_at),
        createdAt: event.created_at,
      };
    default:
      return null;
  }
}

export async function getPersonalDashboardData(
  userId: string,
): Promise<PersonalDashboardData> {
  const supabase = await createClient();

  const [
    profileRes,
    listingsRes,
    statsRowsRes,
    eventsRes,
    boostsRes,
    subsRes,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "full_name, trial_ends_at, scheduled_plan_id, scheduled_charge_at, subscription_ends_at",
      )
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("listings")
      .select("*")
      .eq("seller_id", userId)
      .neq("status", "archived")
      .order("created_at", { ascending: false }),
    supabase
      .from("listing_daily_stats")
      .select("listing_id, seller_id, day, views, likes, comments, contacts")
      .eq("seller_id", userId)
      .gte("day", lastNDays(60)[0]),
    supabase
      .from("listing_events")
      .select(
        "id, listing_id, seller_id, actor_id, event_type, message, metadata, created_at, listings(make, model, year)",
      )
      .eq("seller_id", userId)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("listing_boosts")
      .select("*")
      .eq("seller_id", userId)
      .order("starts_at", { ascending: false }),
    supabase
      .from("subscriptions")
      .select("id, plan_name, status, ends_at, starts_at, payment_metadata, price_szl")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const listings = (listingsRes.data ?? []) as Listing[];
  const dailyRows = (statsRowsRes.data ?? []) as ListingDailyStat[];
  const boosts = (boostsRes.data ?? []) as ListingBoost[];

  type EventRow = ListingEvent & {
    listings?:
      | { make: string; model: string; year: number }
      | { make: string; model: string; year: number }[]
      | null;
  };

  const eventsRaw = (eventsRes.data ?? []) as unknown as EventRow[];
  const events = eventsRaw.map((e) => {
    const rel = e.listings;
    const vehicle = Array.isArray(rel) ? rel[0] : rel;
    return { ...e, listings: vehicle ?? null };
  });

  const fullName = profileRes.data?.full_name ?? "";
  const firstName = firstNameFromFullName(fullName);
  const trialEndsAt = profileRes.data?.trial_ends_at as string | null | undefined;
  const scheduledChargeAt = profileRes.data?.scheduled_charge_at as
    | string
    | null
    | undefined;
  const scheduledPlanId = profileRes.data?.scheduled_plan_id as
    | string
    | null
    | undefined;
  const subscriptionEndsAt = profileRes.data?.subscription_ends_at as
    | string
    | null
    | undefined;
  const subs = subsRes.error ? [] : (subsRes.data ?? []);

  const activeListings = listings.filter((l) => l.status === "active");
  const totalViews = listings.reduce((s, l) => s + (l.views_count ?? 0), 0);
  const totalContacts = listings.reduce(
    (s, l) => s + (l.contacts_count ?? 0),
    0,
  );

  // 30d vs previous 30d from daily stats
  const days30 = lastNDays(30);
  const prev30Start = lastNDays(60)[0];
  const prev30End = days30[0];

  let views30 = 0;
  let viewsPrev = 0;
  let contacts30 = 0;
  let contactsPrev = 0;
  for (const r of dailyRows) {
    if (days30.includes(r.day)) {
      views30 += r.views;
      contacts30 += r.contacts;
    } else if (r.day >= prev30Start && r.day < prev30End) {
      viewsPrev += r.views;
      contactsPrev += r.contacts;
    }
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const listingsCreated30 = listings.filter(
    (l) => new Date(l.created_at) >= thirtyDaysAgo,
  ).length;
  const listingsCreatedPrev = listings.filter((l) => {
    const c = new Date(l.created_at);
    const sixty = new Date();
    sixty.setDate(sixty.getDate() - 60);
    return c >= sixty && c < thirtyDaysAgo;
  }).length;

  const stats: DashboardStats = {
    totalListings: listings.length,
    activeListings: activeListings.length,
    totalViews: views30 || totalViews,
    totalContacts: contacts30 || totalContacts,
    avgViewsPerListing:
      activeListings.length > 0
        ? Math.round((views30 || totalViews) / activeListings.length)
        : 0,
    viewsTrendPct: pctChange(views30, viewsPrev),
    contactsTrendPct: pctChange(contacts30, contactsPrev),
    listingsTrendPct: pctChange(listingsCreated30, listingsCreatedPrev),
  };

  const chartDays = lastNDays(CHART_DAYS);
  const engagementSeries = buildSeries(chartDays, dailyRows);

  const listingOptions = listings.map((l) => ({
    id: l.id,
    label: listingLabel(l.year, l.make, l.model),
  }));

  const engagementByListing: Record<string, EngagementPoint[]> = {};
  for (const l of listings) {
    engagementByListing[l.id] = buildSeries(
      chartDays,
      dailyRows.filter((r) => r.listing_id === l.id),
    );
  }

  const activities: DashboardActivityItem[] = [];

  // Boost expiry + payment reminders in activity feed
  const now = new Date();
  for (const b of boosts) {
    if (b.status !== "active") continue;
    const ends = new Date(b.ends_at + "T23:59:59");
    const daysLeft = Math.ceil(
      (ends.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysLeft >= 0 && daysLeft <= 3) {
      const listing = listings.find((l) => l.id === b.listing_id);
      const vehicle = listing
        ? listingLabel(listing.year, listing.make, listing.model)
        : "your listing";
      activities.push({
        id: `boost-reminder-${b.id}`,
        type: "reminder",
        text:
          daysLeft === 0
            ? `Reminder: Boost on ${vehicle} expires today. Renew to keep featured placement!`
            : `Reminder: Boost on ${vehicle} expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`,
        time: daysLeft === 0 ? "Today" : `In ${daysLeft} days`,
        createdAt: b.ends_at,
        isUpcoming: true,
      });
    }
  }

  if (trialEndsAt && new Date(trialEndsAt) > now) {
    const daysLeft = Math.ceil(
      (new Date(trialEndsAt).getTime() - now.getTime()) / 86400000,
    );
    activities.push({
      id: "trial-end-reminder",
      type: "reminder",
      text:
        daysLeft <= 1
          ? "Your free trial ends tomorrow — schedule a paid plan so listing stays live."
          : `Free trial ends in ${daysLeft} days (${new Date(trialEndsAt).toLocaleDateString()}).`,
      time: daysLeft <= 1 ? "Soon" : `In ${daysLeft} days`,
      createdAt: trialEndsAt,
      isUpcoming: true,
    });
  }

  if (scheduledChargeAt && scheduledPlanId) {
    activities.push({
      id: "payment-scheduled",
      type: "notification",
      text: `MoMo payment scheduled for ${scheduledPlanId} on ${new Date(scheduledChargeAt).toLocaleDateString()}.`,
      time: formatRelativeTime(scheduledChargeAt),
      createdAt: scheduledChargeAt,
      isUpcoming: true,
    });
  }

  for (const e of events) {
    const item = mapEventToActivity(e);
    if (item) activities.push(item);
  }

  activities.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const dailyEngagement: PersonalDashboardData["dailyEngagement"] = {};
  for (const r of dailyRows) {
    const cur = dailyEngagement[r.day] ?? {
      visitors: 0,
      likes: 0,
      comments: 0,
    };
    cur.visitors += r.views;
    cur.likes += r.likes;
    cur.comments += r.comments;
    dailyEngagement[r.day] = cur;
  }

  // Calendar reminders: trial, payments, boosts, visitor peaks
  const calendarReminders: CalendarReminder[] = [];

  if (trialEndsAt) {
    const d = trialEndsAt.slice(0, 10);
    calendarReminders.push({
      date: d,
      type: "trial_end",
      label: "Trial ends",
      desc: "Free trial ends — paid plan / MoMo charge if scheduled",
    });
  }

  if (scheduledChargeAt) {
    calendarReminders.push({
      date: scheduledChargeAt.slice(0, 10),
      type: "payment",
      label: "Payment due",
      desc: `MoMo charge for ${scheduledPlanId || "your plan"}`,
    });
  }

  if (subscriptionEndsAt) {
    calendarReminders.push({
      date: subscriptionEndsAt.slice(0, 10),
      type: "payment",
      label: "Renewal",
      desc: "Subscription period ends — renew to keep listings live",
    });
  }

  for (const s of subs) {
    const meta = (s.payment_metadata || {}) as {
      deferred?: boolean;
      charge_after?: string;
    };
    if (meta.deferred && meta.charge_after) {
      calendarReminders.push({
        date: meta.charge_after.slice(0, 10),
        type: "payment",
        label: "MoMo charge",
        desc: `${s.plan_name} — E${Number(s.price_szl)}`,
      });
    }
    if (s.ends_at && (s.status === "active" || s.status === "trialing")) {
      calendarReminders.push({
        date: s.ends_at.slice(0, 10),
        type: "payment",
        label: s.status === "trialing" ? "Trial ends" : "Plan ends",
        desc: s.plan_name,
      });
    }
  }

  for (const b of boosts) {
    if (b.status !== "active") continue;
    calendarReminders.push({
      date: b.starts_at.slice(0, 10),
      type: "boost",
      label: "Boost start",
      desc: `Featured placement (E${b.amount_szl})`,
    });
    calendarReminders.push({
      date: b.ends_at.slice(0, 10),
      type: "boost",
      label: "Boost ends",
      desc: "Featured placement expires",
    });
  }

  // Mark days with visitor activity
  for (const [day, eng] of Object.entries(dailyEngagement)) {
    if (eng.visitors > 0) {
      calendarReminders.push({
        date: day,
        type: "visitor",
        label: "Visitors",
        desc: `${eng.visitors} views · ${eng.likes} likes · ${eng.comments} comments`,
      });
    }
  }

  if (listingsRes.error && process.env.NODE_ENV === "development") {
    console.warn("listings query:", listingsRes.error.message);
  }

  return {
    firstName,
    fullName,
    stats: listingsRes.error ? emptyStats() : stats,
    engagementSeries,
    listingOptions,
    engagementByListing,
    activities: activities.slice(0, 20),
    boosts,
    dailyEngagement,
    calendarReminders,
    recentListings: listings.slice(0, 5),
    trialEndsAt: trialEndsAt ?? null,
    scheduledChargeAt: scheduledChargeAt ?? null,
  };
}

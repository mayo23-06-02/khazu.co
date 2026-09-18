import type { Listing, ListingBoost } from "./listing";

export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalContacts: number;
  avgViewsPerListing: number;
  viewsTrendPct: number | null;
  contactsTrendPct: number | null;
  listingsTrendPct: number | null;
}

export interface EngagementPoint {
  name: string;
  day: string;
  views: number;
  likes: number;
  comments: number;
}

export interface ListingOption {
  id: string;
  label: string;
}

export type ActivityUiType = "like" | "comment" | "notification" | "reminder";

export interface DashboardActivityItem {
  id: string;
  type: ActivityUiType;
  text: string;
  time: string;
  createdAt: string;
  isUpcoming?: boolean;
}

export interface CalendarEngagementDay {
  visitors: number;
  likes: number;
  comments: number;
}

/** Markers for the dashboard calendar (payment, trial, visitors, etc.) */
export interface CalendarReminder {
  date: string; // YYYY-MM-DD
  type: "payment" | "trial_end" | "boost" | "visitor" | "activity";
  label: string;
  desc: string;
}

export interface PersonalDashboardData {
  firstName: string;
  fullName: string;
  stats: DashboardStats;
  engagementSeries: EngagementPoint[];
  listingOptions: ListingOption[];
  engagementByListing: Record<string, EngagementPoint[]>;
  activities: DashboardActivityItem[];
  boosts: ListingBoost[];
  dailyEngagement: Record<string, CalendarEngagementDay>;
  calendarReminders: CalendarReminder[];
  recentListings: Listing[];
  trialEndsAt?: string | null;
  scheduledChargeAt?: string | null;
}

export interface DealerDashboardData extends PersonalDashboardData {
  soldThisMonth: number;
  soldTrendPct: number | null;
  totalLeads: number;
  leadsTrendPct: number | null;
  conversionRatePct: number;
}

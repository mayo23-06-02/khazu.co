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

export interface AdminDashboardData {
  totalUsers: number;
  totalUsersTrendPct: number | null;
  totalDealers: number;
  totalListings: number;
  pendingModeration: number;
  monthlyRevenueSzl: number;
  revenueTrendPct: number | null;
  openFraudFlags: number;
  revenueSeries: { name: string; value: number }[];
  pendingListings: AdminListingRow[];
  fraudPatterns: { pattern: string; count: number }[];
}

export interface AdminUserRow {
  id: string;
  fullName: string;
  businessName: string | null;
  role: string;
  accountStatus: "active" | "suspended";
  createdAt: string;
}

export interface AdminListingRow {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  image: string | null;
  status: string;
  moderationStatus: "pending" | "approved" | "rejected";
  moderationNotes: string | null;
  sellerName: string;
  createdAt: string;
}

export interface AdminPaymentRow {
  id: string;
  userName: string;
  planName: string;
  priceSzl: number;
  status: string;
  createdAt: string;
}

export interface AdminFraudFlagRow {
  id: string;
  pattern: string;
  riskScore: number;
  status: "open" | "dismissed" | "actioned";
  listingId: string | null;
  listingLabel: string | null;
  userId: string | null;
  userName: string | null;
  createdAt: string;
}

export interface AdminReportRow {
  label: string;
  listings: number;
  newUsers: number;
  revenueSzl: number;
}

export interface PaginatedResult<T> {
  rows: T[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export type PlanRole = "individual" | "dealer";

export type PlanId =
  | "individual_trial"
  | "individual_14"
  | "individual_28"
  | "dealer_starter"
  | "dealer_growth"
  | "dealer_premium";

export type AddonId =
  | "banner_home_listings"
  | "listing_boost_7"
  | "listing_boost_14";

export interface SubscriptionPlan {
  id: PlanId;
  role: PlanRole;
  name: string;
  priceSzl: number;
  periodLabel: string;
  periodDays: number;
  listingLimit: number;
  includedSponsorships: number;
  tagline: string;
  features: string[];
  popular?: boolean;
  isTrial?: boolean;
  ctaLabel?: string;
}

export interface SponsorshipAddon {
  id: AddonId;
  name: string;
  description: string;
  priceSzl: number;
  durationDays: number;
  /** If true, only dealers can select this addon */
  dealerOnly?: boolean;
  note?: string;
  badge?: string;
}

export const INDIVIDUAL_PLANS: SubscriptionPlan[] = [
  {
    id: "individual_trial",
    role: "individual",
    name: "Free Trial",
    priceSzl: 0,
    periodLabel: "45 days",
    periodDays: 45,
    listingLimit: 1,
    includedSponsorships: 0,
    tagline: "Try Khazu risk-free",
    isTrial: true,
    features: [
      "1 free active listing",
      "45-day trial window",
      "Buyer enquiries via WhatsApp",
      "Basic listing analytics",
      "No MoMo charge to start",
    ],
    ctaLabel: "Start free trial",
  },
  {
    id: "individual_14",
    role: "individual",
    name: "14-Day Pass",
    priceSzl: 45,
    periodLabel: "14 days",
    periodDays: 14,
    listingLimit: 1,
    includedSponsorships: 0,
    tagline: "One listing for 14 days",
    popular: true,
    features: [
      "1 active listing",
      "Live for 14 days",
      "Listing boost eligible",
      "Priority in “new today” feed",
      "Email & in-app support",
    ],
  },
  {
    id: "individual_28",
    role: "individual",
    name: "28-Day Pass",
    priceSzl: 80,
    periodLabel: "28 days",
    periodDays: 28,
    listingLimit: 1,
    includedSponsorships: 0,
    tagline: "One listing for 28 days — better value",
    features: [
      "1 active listing",
      "Live for 28 days",
      "Better value vs 14-day pass",
      "Featured badge eligible",
      "Standard support",
    ],
  },
];

export const DEALER_PLANS: SubscriptionPlan[] = [
  {
    id: "dealer_starter",
    role: "dealer",
    name: "Starter",
    priceSzl: 475,
    periodLabel: "per month",
    periodDays: 30,
    listingLimit: 18,
    includedSponsorships: 3,
    tagline: "Launch your dealership online",
    features: [
      "18 active inventory slots",
      "3 sponsored ad placements / month",
      "Verified dealer badge",
      "Lead inbox & contact tracking",
      "Basic analytics dashboard",
      "WhatsApp enquiry buttons",
      "Email support (48h)",
    ],
  },
  {
    id: "dealer_growth",
    role: "dealer",
    name: "Growth",
    priceSzl: 750,
    periodLabel: "per month",
    periodDays: 30,
    listingLimit: 25,
    includedSponsorships: 10,
    tagline: "Scale stock & dominate search",
    popular: true,
    features: [
      "25 active inventory slots",
      "10 sponsored ads / month",
      "Everything in Starter",
      "Top-of-search boost credits",
      "Advanced analytics & trends",
      "Dealer spotlight eligibility",
      "Priority support (24h)",
      "Bulk listing tools",
    ],
  },
  {
    id: "dealer_premium",
    role: "dealer",
    name: "Premium",
    priceSzl: 1250,
    periodLabel: "per month",
    periodDays: 30,
    listingLimit: 35,
    includedSponsorships: 15,
    tagline: "Own the Khazu homepage",
    features: [
      "35 active inventory slots",
      "15 sponsored ads / month",
      "Everything in Growth",
      "Homepage spotlight rotation",
      "Dedicated account manager",
      "API access (inventory sync)",
      "Custom dealer storefront",
      "Priority placement on deals page",
      "Same-day support (business hours)",
    ],
  },
];

export const SPONSORSHIP_ADDONS: SponsorshipAddon[] = [
  {
    id: "banner_home_listings",
    name: "Banner Ads",
    description:
      "Premium banner on Home + Listings pages. Recommended creative ratio 12:5.",
    priceSzl: 500,
    durationDays: 14,
    dealerOnly: true,
    badge: "Dealerships only",
    note: "12:5 image ratio recommended",
  },
  {
    id: "listing_boost_7",
    name: "Listing Sponsorship — 7 days",
    description:
      "Top position in search results + visibility on Home & Listings.",
    priceSzl: 29,
    durationDays: 7,
  },
  {
    id: "listing_boost_14",
    name: "Listing Sponsorship — 14 days",
    description:
      "Top position in search results + visibility on Home & Listings.",
    priceSzl: 50,
    durationDays: 14,
    badge: "Best value",
  },
];

export function plansForRole(role: PlanRole): SubscriptionPlan[] {
  return role === "dealer" ? DEALER_PLANS : INDIVIDUAL_PLANS;
}

export function getPlanById(id: PlanId): SubscriptionPlan | undefined {
  return [...INDIVIDUAL_PLANS, ...DEALER_PLANS].find((p) => p.id === id);
}

export function getAddonById(id: AddonId): SponsorshipAddon | undefined {
  return SPONSORSHIP_ADDONS.find((a) => a.id === id);
}

export function formatEmalangeni(amount: number): string {
  if (amount === 0) return "Free";
  return `E${amount.toLocaleString("en-SZ")}`;
}

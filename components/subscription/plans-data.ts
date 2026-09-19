export type PlanRole = "individual" | "dealer";

export type PlanId =
  | "individual_trial"
  | "individual_14"
  | "individual_28"
  | "dealer_trial"
  | "dealer_starter"
  | "dealer_growth"
  | "dealer_premium"
  | "dealer_unlimited";

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
  /** Sentinel large number when `unlimited` is true — never render it directly, check `unlimited` first. */
  listingLimit: number;
  includedSponsorships: number;
  tagline: string;
  features: string[];
  popular?: boolean;
  isTrial?: boolean;
  /** True for the top dealer tier — no listing cap. */
  unlimited?: boolean;
  ctaLabel?: string;
}

export interface SponsorshipAddon {
  id: AddonId;
  name: string;
  description: string;
  /** Price for individual sellers. */
  priceSzl: number;
  /** Discounted dealer price, when different from `priceSzl`. */
  dealerPriceSzl?: number;
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
    periodLabel: "14 days",
    periodDays: 14,
    listingLimit: 1,
    includedSponsorships: 0,
    tagline: "Try Khazu risk-free",
    isTrial: true,
    features: [
      "1 free active listing",
      "14-day trial window",
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
    priceSzl: 75,
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
    id: "dealer_trial",
    role: "dealer",
    name: "Free Trial",
    priceSzl: 0,
    periodLabel: "28 days",
    periodDays: 28,
    listingLimit: 5,
    includedSponsorships: 0,
    tagline: "Try Khazu risk-free",
    isTrial: true,
    features: [
      "Up to 5 active listings",
      "28-day trial window",
      "Lead inbox & contact tracking",
      "Basic analytics dashboard",
      "No MoMo charge to start",
    ],
    ctaLabel: "Start free trial",
  },
  {
    id: "dealer_starter",
    role: "dealer",
    name: "Starter",
    priceSzl: 375,
    periodLabel: "per month",
    periodDays: 30,
    listingLimit: 15,
    includedSponsorships: 3,
    tagline: "Launch your dealership online",
    features: [
      "15 active inventory slots",
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
    priceSzl: 550,
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
    priceSzl: 725,
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
  {
    id: "dealer_unlimited",
    role: "dealer",
    name: "Unlimited",
    priceSzl: 1250,
    periodLabel: "per month",
    periodDays: 30,
    listingLimit: 100000,
    unlimited: true,
    includedSponsorships: 25,
    tagline: "For high-volume dealerships",
    features: [
      "Unlimited inventory slots",
      "25 sponsored ads / month",
      "Everything in Premium",
      "Dedicated account manager",
      "Priority same-day support",
    ],
  },
];

export const SPONSORSHIP_ADDONS: SponsorshipAddon[] = [
  {
    id: "banner_home_listings",
    name: "Banner Ads",
    description:
      "Premium banner on Home + Listings pages. Recommended creative ratio 12:5.",
    priceSzl: 200,
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
    priceSzl: 25,
    dealerPriceSzl: 20,
    durationDays: 7,
  },
  {
    id: "listing_boost_14",
    name: "Listing Sponsorship — 14 days",
    description:
      "Top position in search results + visibility on Home & Listings.",
    priceSzl: 45,
    dealerPriceSzl: 35,
    durationDays: 14,
    badge: "Best value",
  },
];

/** Resolves an addon's price for the given role (dealers get a discounted rate where set). */
export function getAddonPrice(addon: SponsorshipAddon, role: PlanRole): number {
  return role === "dealer" && addon.dealerPriceSzl != null
    ? addon.dealerPriceSzl
    : addon.priceSzl;
}

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

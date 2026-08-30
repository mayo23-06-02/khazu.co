import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/site";

// `page.tsx` here is a client component, which cannot export metadata —
// so the route's SEO tags live in this server layout instead.
export const metadata: Metadata = {
  title: "Pricing & Listing Plans",
  description:
    "Khazu pricing for private sellers and dealerships. Start with a free trial listing, then choose a plan that fits how much you sell.",
  alternates: { canonical: absoluteUrl("/pricing") },
  openGraph: {
    title: "Pricing & Listing Plans | Khazu",
    description:
      "Start with a free trial listing, then choose a plan that fits how much you sell.",
    url: absoluteUrl("/pricing"),
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/site";

// `page.tsx` here is a client component, which cannot export metadata —
// so the route's SEO tags live in this server layout instead.
export const metadata: Metadata = {
  title: "Sell Your Car in Eswatini",
  description:
    "List your car on Khazu in minutes. Get a free valuation, upload photos and reach buyers across Eswatini — your first listing is free.",
  alternates: { canonical: absoluteUrl("/sell") },
  openGraph: {
    title: "Sell Your Car in Eswatini | Khazu",
    description:
      "List your car in minutes, get a free valuation and reach buyers across Eswatini. Your first listing is free.",
    url: absoluteUrl("/sell"),
  },
};

export default function SellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

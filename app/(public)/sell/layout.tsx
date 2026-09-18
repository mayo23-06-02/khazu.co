import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/site";

// `page.tsx` here is a client component, which cannot export metadata —
// so the route's SEO tags live in this server layout instead.
export const metadata: Metadata = {
  title: "Sell Your Car in Eswatini",
  description:
    "List your car on Khazu for free in minutes. Set your own price, upload photos and reach buyers and dealers across Eswatini.",
  alternates: { canonical: absoluteUrl("/sell") },
  openGraph: {
    title: "Sell Your Car in Eswatini | Khazu",
    description:
      "List your car for free in minutes, set your own price, and reach buyers and dealers across Eswatini.",
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

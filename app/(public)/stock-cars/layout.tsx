import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/site";

// `page.tsx` here is a client component, which cannot export metadata —
// so the route's SEO tags live in this server layout instead.
export const metadata: Metadata = {
  title: "New & Stock Cars",
  description:
    "Browse new and ex-demo stock cars available in Eswatini. Compare makes, models, specifications and prices on Khazu.",
  alternates: { canonical: absoluteUrl("/stock-cars") },
  openGraph: {
    title: "New & Stock Cars | Khazu",
    description:
      "Browse new and ex-demo stock cars available in Eswatini. Compare makes, models, specs and prices.",
    url: absoluteUrl("/stock-cars"),
  },
};

export default function StockCarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

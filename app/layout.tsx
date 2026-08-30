import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import "./globals.css";
import { siteDescription, siteName, siteUrl } from "@/lib/seo/site";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  // Resolves every relative canonical/OG URL below against the real domain.
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Buy and Sell Cars in Eswatini`,
    // Pages set a bare title; the suffix is appended here so it stays consistent.
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "cars for sale Eswatini",
    "used cars Eswatini",
    "buy car Eswatini",
    "sell my car Eswatini",
    "car dealers Eswatini",
    "Mbabane cars",
    "Manzini cars",
    "Khazu",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_SZ",
    url: siteUrl,
    siteName,
    title: `${siteName} — Buy and Sell Cars in Eswatini`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Buy and Sell Cars in Eswatini`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    // Stops iOS Safari from restyling prices and reg numbers as phone links.
    telephone: false,
  },
};

// Render edge-to-edge on notched phones (iOS Safari, Android Chrome):
// `viewport-fit=cover` lets the page fill the whole screen and extend under
// the status bar / home indicator, combined with env(safe-area-inset-*) in CSS.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7f7" },
    { media: "(prefers-color-scheme: dark)", color: "#06110d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${outfit.variable} font-body antialiased bg-white text-gray-800`}
      >
        {children}
      </body>
    </html>
  );
}

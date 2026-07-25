import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import "./globals.css";

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
  title: "Khazu Design System",
  description: "A premium UI component library for car marketplaces.",
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

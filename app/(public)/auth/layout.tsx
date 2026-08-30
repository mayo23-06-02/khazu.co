import type { Metadata } from "next";

// Sign-in and registration screens hold no content worth indexing, and
// keeping them out of search results avoids competing with the real pages.
export const metadata: Metadata = {
  // `register/page.tsx` sets its own title; this covers the login screen.
  title: "Sign In",
  robots: { index: false, follow: true },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

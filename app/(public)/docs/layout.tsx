import type { Metadata } from "next";

// Internal component library — useful to the team, noise in search results.
export const metadata: Metadata = {
  title: "Component Library",
  robots: { index: false, follow: false },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

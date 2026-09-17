import type { Metadata } from "next";
import { Foundations } from "./Foundations";
import { Gallery } from "./Gallery";
import { SideNav } from "./SideNav";

export const metadata: Metadata = {
  title: "Design System — Khazu",
  description: "Living reference for every Khazu UI component and design token.",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return (
    <div className="min-h-dvh bg-surface-alt">
      <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur safe-area-pt">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <div className="min-w-0">
            <h1 className="font-display text-base font-bold tracking-tight text-ink sm:text-lg">
              Khazu Design System
            </h1>
            <p className="truncate text-2xs text-muted">
              Tokens and components · see design.md
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary-subtle px-2 py-0.5 text-2xs font-semibold text-primary">
            v1
          </span>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-5 sm:px-6">
        <SideNav />
        <main className="flex min-w-0 flex-1 flex-col gap-10 pb-16">
          <Foundations />
          <Gallery />
        </main>
      </div>
    </div>
  );
}

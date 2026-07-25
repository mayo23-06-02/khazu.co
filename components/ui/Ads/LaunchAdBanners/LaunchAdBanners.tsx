"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FaCar, FaBuilding, FaTag } from "react-icons/fa6";

interface LaunchAdBannersProps {
  className?: string;
}

interface AdCardProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  accent: "primary" | "danger" | "cream";
  price?: { current: string; was: string; suffix?: string };
  className?: string;
}

const accentStyles = {
  primary: {
    ring: "hover:border-primary/60",
    badge: "bg-primary/15 text-primary",
    button: "bg-primary text-dark hover:bg-primary-light",
    glow: "bg-primary",
  },
  danger: {
    ring: "hover:border-danger/60",
    badge: "bg-danger/15 text-danger",
    button: "bg-danger text-white hover:bg-danger/90",
    glow: "bg-danger",
  },
  cream: {
    ring: "hover:border-cream/60",
    badge: "bg-cream/20 text-cream",
    button: "bg-cream text-dark hover:bg-cream-dark",
    glow: "bg-cream",
  },
} as const;

function AdCard({
  icon,
  eyebrow,
  title,
  description,
  cta,
  href,
  accent,
  price,
  className = "",
}: AdCardProps) {
  const styles = accentStyles[accent];
  return (
    <div
      className={twMerge(
        clsx(
          "relative flex shrink-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a] p-6 transition-colors",
          styles.ring,
          className,
        ),
      )}
    >
      <span className="absolute top-3 right-3 rounded border border-white/10 bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/60 backdrop-blur-sm">
        Advertisement
      </span>

      <div
        className={twMerge(
          clsx(
            "mb-4 flex h-11 w-11 items-center justify-center rounded-md text-lg",
            styles.badge,
          ),
        )}
      >
        {icon}
      </div>

      <span className="mb-1 text-[11px] font-bold uppercase tracking-widest text-white/40">
        {eyebrow}
      </span>
      <h3 className="font-display text-xl font-bold leading-snug text-white sm:text-2xl">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-white/60">
        {description}
      </p>

      {price && (
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-3xl font-black text-white">
            {price.current}
          </span>
          <span className="text-base font-medium text-white/40 line-through">
            {price.was}
          </span>
          {price.suffix && (
            <span className="text-xs font-medium text-white/40">{price.suffix}</span>
          )}
        </div>
      )}

      <Link href={href} className="mt-5">
        <span
          className={twMerge(
            clsx(
              "inline-flex w-full items-center justify-center rounded-md px-6 py-3 text-sm font-bold transition-all active:scale-95",
              styles.button,
            ),
          )}
        >
          {cta}
        </span>
      </Link>
    </div>
  );
}

export function LaunchAdBanners({ className = "" }: LaunchAdBannersProps) {
  return (
    <section className={twMerge(clsx("bg-[#0d0d0d] pb-12 md:pb-16", className))}>
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <div
          className={twMerge(
            clsx(
              "flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory",
              "sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0",
            ),
          )}
        >
          <AdCard
            className="w-[85%] snap-start sm:w-auto"
            accent="primary"
            icon={<FaCar />}
            eyebrow="Private Sellers"
            title="Want to sell your car?"
            description="List it in minutes and reach thousands of buyers across Eswatini before we even go live."
            cta="Sell My Car"
            href="/sell/upload"
          />

          <AdCard
            className="w-[85%] snap-start sm:w-auto"
            accent="danger"
            icon={<FaTag />}
            eyebrow="Launch Offer &middot; Private Sellers"
            title="Free for 14 days"
            description="List your car free for your first 14 days, then keep going for as little as"
            price={{ current: "E29", was: "E45", suffix: "/ listing" }}
            cta="Start Selling"
            href="/pricing"
          />

          <AdCard
            className="w-[85%] snap-start sm:w-auto"
            accent="cream"
            icon={<FaBuilding />}
            eyebrow="Car Dealerships"
            title="Are you a car dealership?"
            description="List your entire stock for free for your first 60 days on Khazu — no limits, no catches."
            cta="Register Your Dealership"
            href="/pricing"
          />
        </div>
      </div>
    </section>
  );
}

"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";

/** One documented component: a title, an optional note, and the live preview. */
export function Spec({
  name,
  note,
  children,
  className = "",
}: {
  name: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-white">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-3 py-2">
        <code className="text-2xs font-semibold text-ink">{name}</code>
        {note && <span className="text-2xs text-muted">{note}</span>}
      </div>
      <div className={clsx("p-3", className)}>{children}</div>
    </div>
  );
}

/** A labelled section that the sidebar links to. */
export function Group({
  id,
  title,
  count,
  children,
}: {
  id: string;
  title: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-3 flex items-baseline gap-2">
        <h2 className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
          {title}
        </h2>
        {count !== undefined && (
          <span className="text-2xs font-semibold text-muted">{count}</span>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

/** Horizontal strip for showing variants side by side. */
export function Row({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={clsx("flex flex-wrap items-center gap-2", className)}>{children}</div>;
}

/** Vertical stack for form controls. */
export function Col({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={clsx("flex flex-col gap-2.5", className)}>{children}</div>;
}

/** Tiny caption used inside a Spec to separate sub-examples. */
export function Label({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wider text-muted">{children}</p>
  );
}

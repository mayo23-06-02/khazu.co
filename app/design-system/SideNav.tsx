"use client";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "foundations", label: "Foundations" },
  { id: "buttons", label: "Buttons" },
  { id: "typography", label: "Typography" },
  { id: "inputs", label: "Inputs" },
  { id: "badges", label: "Badges" },
  { id: "layout", label: "Layout" },
  { id: "navigation", label: "Navigation" },
  { id: "feedback", label: "Feedback" },
  { id: "overlays", label: "Overlays" },
  { id: "tables", label: "Tables" },
  { id: "filters", label: "Filters" },
  { id: "cards", label: "Domain cards" },
  { id: "misc", label: "Messaging & shared" },
];

export function SideNav() {
  const [active, setActive] = useState("foundations");

  // Highlight whichever section is nearest the top of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Design system sections"
      className="sticky top-16 hidden h-[calc(100dvh-5rem)] w-44 shrink-0 overflow-y-auto lg:block"
    >
      <ul className="flex flex-col gap-0.5">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`block rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                active === s.id
                  ? "bg-primary-subtle text-primary"
                  : "text-muted hover:bg-surface-sunken hover:text-ink"
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

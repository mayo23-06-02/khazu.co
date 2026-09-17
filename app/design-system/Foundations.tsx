"use client";
import { Spec, Group, Row, Label } from "./kit";

// Swatches resolve tokens through CSS variables rather than interpolated class
// names — Tailwind only generates classes it can see as complete literals.
const v = (token: string) => ({ backgroundColor: `var(--color-${token})` });

const brandRamp = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

const semantic = [
  { token: "primary", note: "Brand accent, CTAs" },
  { token: "primary-hover", note: "Hover" },
  { token: "primary-active", note: "Pressed" },
  { token: "primary-subtle", note: "Tinted background" },
  { token: "dark", note: "Ink / dark surfaces" },
  { token: "muted", note: "Secondary text" },
  { token: "surface-alt", note: "Page background" },
  { token: "surface-sunken", note: "Inset background" },
  { token: "cream", note: "Warm accent" },
];

const status = ["success", "danger", "warning", "info"];

const typeScale = [
  { cls: "text-2xs", label: "2xs · 11px" },
  { cls: "text-xs", label: "xs · 12px" },
  { cls: "text-sm", label: "sm · 13px" },
  { cls: "text-base", label: "base · 14px" },
  { cls: "text-lg", label: "lg · 16px" },
  { cls: "text-xl", label: "xl · 18px" },
  { cls: "text-2xl", label: "2xl · 22px" },
  { cls: "text-3xl", label: "3xl · 26px" },
  { cls: "text-4xl", label: "4xl · 32px" },
];

const radii = [
  { cls: "rounded-sm", label: "sm · 6" },
  { cls: "rounded-md", label: "md · 8" },
  { cls: "rounded-lg", label: "lg · 10" },
  { cls: "rounded-xl", label: "xl · 12" },
  { cls: "rounded-2xl", label: "2xl · 16" },
  { cls: "rounded-full", label: "full" },
];

const shadows = [
  { cls: "shadow-xs", label: "xs" },
  { cls: "shadow-sm", label: "sm" },
  { cls: "shadow-md", label: "md" },
  { cls: "shadow-lg", label: "lg" },
  { cls: "shadow-xl", label: "xl" },
  { cls: "shadow-brand", label: "brand" },
];

export function Foundations() {
  return (
    <Group id="foundations" title="Foundations">
      <Spec name="Brand ramp" note="--color-brand-*">
        <div className="grid grid-cols-5 gap-1">
          {brandRamp.map((step) => (
            <div key={step} className="flex flex-col gap-1">
              <div
                className="h-9 rounded-md border border-line"
                style={v(`brand-${step}`)}
              />
              <span className="text-[9px] text-muted">{step}</span>
            </div>
          ))}
        </div>
      </Spec>

      <Spec name="Semantic colours" note="use these, not hex">
        <div className="flex flex-col gap-1.5">
          {semantic.map((s) => (
            <div key={s.token} className="flex items-center gap-2">
              <span
                className="size-5 shrink-0 rounded-md border border-line"
                style={v(s.token)}
              />
              <code className="text-2xs font-semibold text-ink">{s.token}</code>
              <span className="ml-auto truncate text-2xs text-muted">{s.note}</span>
            </div>
          ))}
        </div>
      </Spec>

      <Spec name="Status colours" note="solid + -light pair">
        <div className="flex flex-col gap-1.5">
          {status.map((s) => (
            <div key={s} className="flex items-center gap-2">
              <span className="size-5 shrink-0 rounded-md" style={v(s)} />
              <span className="size-5 shrink-0 rounded-md" style={v(`${s}-light`)} />
              <code className="text-2xs font-semibold text-ink">{s}</code>
            </div>
          ))}
        </div>
      </Spec>

      <Spec name="Type scale" note="compact by default">
        <div className="flex flex-col gap-1">
          {typeScale.map((t) => (
            <div key={t.cls} className="flex items-baseline justify-between gap-3">
              <span className={`${t.cls} truncate text-ink`}>Khazu</span>
              <code className="shrink-0 text-[9px] text-muted">{t.label}</code>
            </div>
          ))}
        </div>
      </Spec>

      <Spec name="Font families">
        <div className="flex flex-col gap-2.5">
          <div>
            <Label>font-display · Bricolage</Label>
            <p className="font-display text-xl font-bold tracking-tight">Find your next car</p>
          </div>
          <div>
            <Label>font-sans · Outfit</Label>
            <p className="font-sans text-sm">Body copy runs in Outfit at 14px.</p>
          </div>
        </div>
      </Spec>

      <Spec name="Radius" note="controls use xl">
        <div className="grid grid-cols-3 gap-2">
          {radii.map((r) => (
            <div key={r.cls} className="flex flex-col items-center gap-1">
              <div
                className={`h-9 w-full border border-line-strong bg-surface-sunken ${r.cls}`}
              />
              <span className="text-[9px] text-muted">{r.label}</span>
            </div>
          ))}
        </div>
      </Spec>

      <Spec name="Elevation">
        <div className="grid grid-cols-3 gap-3 py-1">
          {shadows.map((s) => (
            <div key={s.cls} className="flex flex-col items-center gap-1.5">
              <div className={`h-10 w-full rounded-xl bg-white ${s.cls}`} />
              <span className="text-[9px] text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </Spec>

      <Spec name="Control heights" note="buttons + inputs align">
        <Row>
          <span className="flex h-8 items-center rounded-xl bg-surface-sunken px-3 text-xs">sm · 32</span>
          <span className="flex h-9 items-center rounded-xl bg-surface-sunken px-3 text-xs">md · 36</span>
          <span className="flex h-10 items-center rounded-xl bg-surface-sunken px-3 text-xs">lg · 40</span>
        </Row>
      </Spec>

      <Spec name="Focus ring" note="keyboard only">
        <Row>
          <button
            type="button"
            className="rounded-xl border border-line-strong px-3 py-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Tab to me
          </button>
          <span className="text-2xs text-muted">2px primary, 2px offset</span>
        </Row>
      </Spec>
    </Group>
  );
}

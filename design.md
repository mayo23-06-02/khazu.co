# Khazu Design System

The living reference for Khazu's UI. Tokens live in `app/globals.css`; every
component is rendered at **`/design-system`**. If this document and the code
ever disagree, the code — specifically `app/globals.css` and
`components/ui/**/buttonStyles.ts` / `inputStyles.ts` — wins; update this file
to match.

## Why this exists

The app is on **Tailwind v4** (`tailwindcss@4`), which does *not* read a
`tailwind.config.ts` — it only reads `@theme` blocks inside CSS. The repo
previously shipped a v3-style config that was silently dead: **479 utility
classes** (`bg-primary`, `text-dark`, `font-display`, `bg-danger`, …) across
101 files resolved to nothing. Buttons, headings and alerts using those
classes rendered with no color, no font, no radius. Ninety-two of these plus
115 malformed arbitrary-value classes (`bg[#CD2C58]` missing the dash) have
been fixed. **Every token below is real and generates a utility — verify new
ones the same way**: add the class to `app/design-system` and look at it, or
grep the built CSS for the `--variable` declaration.

## Tokens

All tokens are declared in `app/globals.css` inside `@theme static { … }`.
`static` is required — Tailwind v4 tree-shakes `@theme` variables that no
generated utility references, which silently breaks anything that reads a
token from an inline `style` or hand-written CSS instead of a class.

### Color

| Token | Use |
|---|---|
| `primary` / `primary-hover` / `primary-active` | Brand crimson `#CD2C58`. CTAs, links, active states. |
| `primary-subtle` | Tinted background for badges/pills on the brand color. |
| `brand-50` … `brand-900` | Full ramp, for anything the semantic names don't cover. |
| `dark` / `ink` | Near-black text and dark surfaces (`#1A1A1A`). |
| `muted` | Secondary text — captions, hints, timestamps. |
| `surface` / `surface-alt` / `surface-sunken` | White / page background / inset background (inputs, skeleton). |
| `line` / `line-strong` | Hairline borders — subtle and default-strength. |
| `success` / `warning` / `danger` / `info` (+ `-light` pair) | Status colors. Pair the solid with its `-light` background — never invent a new status hue. |
| `cream` / `cream-dark` | Warm accent, used sparingly (hero backgrounds). |

**Never hardcode hex.** `#CD2C58` alone appears 192 times in the pre-cleanup
codebase as a literal. Use `primary`; use `brand-{step}` for a shade off the
ramp. If a component still has a raw hex, that's a bug — replace it.

### Typography

Two font families, both loaded as CSS variables in `app/layout.tsx`:

- `font-display` → Bricolage Grotesque. Headings only.
- `font-sans` (default body font) → Outfit.

Type scale is **compact by design** — the pre-cleanup scale rendered
noticeably oversized (e.g. buttons at `text-lg`/`px-14 py-6`). Steps:

`2xs` 11px · `xs` 12px · `sm` 13px · `base` 14px · `lg` 16px · `xl` 18px ·
`2xl` 22px · `3xl` 26px · `4xl` 32px · `5xl` 40px · `6xl` 48px

Body copy defaults to `text-base` (14px). Don't reach for `lg`/`xl` for
paragraph text — that's what made the old UI feel scaled up.

### Radius

**Buttons and text inputs both use `rounded-xs` (4px)** — the smallest step
on the scale, so controls read as barely-softened squares rather than pills.
Set once in `buttonStyles.ts`'s `buttonBase` and `inputStyles.ts`'s
`controlBase` — never override radius on an individual button or input;
change the shared constant instead so every consumer stays in sync.

| Token | Value | Use |
|---|---|---|
| **`rounded-xs`** | **4px** | **Buttons and text inputs/selects/textareas — the shared control radius.** |
| `rounded-sm` | 6px | Small chips, checkboxes. |
| `rounded-md` / `lg` | 8 / 10px | Misc small surfaces (dropdowns, tooltips). |
| `rounded-xl` / `2xl` / `3xl` | 12 / 16 / 20px | Cards, modals, large surfaces — hero panels, bottom sheets. |
| `rounded-full` | — | Pills, badges, avatars, icon-only round buttons (`IconButton round`), toggle switches. |

### Elevation

`shadow-xs` through `shadow-2xl`, tinted with ink rather than pure black, plus
`shadow-brand` (a crimson-tinted shadow for CTAs that need to pop off a
colored section).

### Motion

`transition-colors duration-200 ease-out` is the standard interactive
transition — used by every button, input and nav item. Respect
`prefers-reduced-motion` (already handled globally in `globals.css`).

## Component conventions

### Sizing

Buttons and form inputs share one height scale so a button next to an input
lines up:

| Size | Height |
|---|---|
| `xs` | 28px (buttons only) |
| `sm` | 32px |
| `md` | 36px (default) |
| `lg` | 40px |
| `xl` | 44px (buttons only) |

Defined once in `components/ui/Buttons/buttonStyles.ts` and
`components/ui/Inputs/inputStyles.ts` — every Button/Input variant imports
from there. **Don't hardcode `px-*`/`py-*`/`h-*` on a new button or input.**
Add a size to the shared map instead, so every consumer updates together.

**iOS zoom-on-focus**: `controlSizes`/`textareaSizes` render at `text-[16px]`
below `sm:` and only drop to the compact `text-xs`/`text-sm` from `sm:` up.
This isn't decorative — iOS Safari auto-zooms the page when a focused input's
font-size is under 16px, which visibly breaks the layout. Note our
`text-base` token is 14px (part of this compact scale, not the Tailwind
default 16px), so this needed an explicit `text-[16px]`, not `text-base`.
Any new input variant must keep this pattern; don't drop below 16px on
mobile even if the desktop size looks fine.

### Button variants

`primary` · `secondary` · `outline` · `ghost` · `subtle` · `inverse` · `danger`

Use **`inverse`** (not `outline` with manually overridden text color) for a
bordered button placed on a dark or brand-colored background. `outline` is
`bg-white`, so overriding just the text to white on a dark section produces
invisible white-on-white text — this exact bug existed on the homepage hero
and the pricing page CTA before this pass.

### Forms

Every text-like input (`InputText`, `InputEmail`, `InputPassword`,
`InputPhone`, `InputNumber`, `Select`, `Textarea`) shares `label` / `error` /
`hint` / `size` / `fullWidth` props and renders the same border, radius,
focus ring and error text. Add a new input type by composing
`controlBase`/`controlSizes`/`tone()` from `inputStyles.ts`, not by
reinventing the border/focus classes.

### Accessibility baked into the primitives

- `IconButton` **requires** a `label` prop (used for both `aria-label` and a
  native tooltip via `title`) — an icon alone tells a screen reader nothing.
- `Modal` traps Escape-to-close, locks body scroll while open, and focuses
  the panel; always pass a `title` or `aria-label`.
- Every control has a visible `:focus-visible` ring (`outline: 2px solid
  var(--color-primary)`), set once globally — don't suppress it with
  `outline-none` on a one-off component.
- Status-only color is always paired with text or an icon (see
  `StatusBadge`, `RatingStars`) — never color alone.

### Responsiveness

- `Container` handles side padding and max-width; page sections use it rather
  than hardcoding `px-4 md:px-8`.
- `Grid` takes `cols`/`sm`/`md`/`lg` and defaults to a sensible mobile-first
  stack — pass explicit breakpoints only when the default 1→2→N step is
  wrong for that grid.
- Every component in `/design-system` is checked at 390px (phone) and
  1440px (desktop) with no horizontal overflow — do the same for new ones.
- Modals render as a bottom sheet on phones (`rounded-t-2xl`, full width) and
  a centered dialog with `rounded-2xl` from `sm:` up.

## Adding a component

1. Check `/design-system` first — 140+ components already exist across
   Layout, Typography, Buttons, Inputs, Badges, Navigation, Tables, Feedback,
   Modals, Filters, Cards, Messaging, Finance, Admin and Shared. Compose
   before you create.
2. If genuinely new, put it in the matching folder under `components/ui/`
   and export it from `components/ui/index.ts`.
3. Use only the tokens in this file — no new hex colors, no one-off radius or
   shadow values.
4. Add a `Spec` block for it in `app/design-system/Gallery.tsx` (or a new
   category in `Foundations.tsx` for a token addition) so it's documented and
   visually testable in the same PR.
5. Run the app and actually look at the component at both 390px and 1440px
   before calling it done — several of the bugs fixed in this pass (literal
   `${variable}` text, a `fixed` loading overlay covering the whole page,
   white text on a white button) only showed up by rendering the page, not by
   reading the code.

## Known gaps / next steps

- Domain cards (`CarCard`, `DealerCard`, `ListingCard`, etc.) are functional
  and tokenized but haven't had a dedicated visual-density pass — some still
  carry slightly generous padding inherited from the old scale.
- No dark theme yet; all tokens are defined for light mode only.

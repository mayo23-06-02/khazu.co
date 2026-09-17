// Single source of truth for every button-like control (Button, ButtonLink,
// IconButton, and the convenience wrappers). Importing these maps is what keeps
// a "primary" button identical no matter which component renders it.

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "subtle"
  | "inverse"
  | "danger";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export const buttonBase =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-semibold " +
  "rounded-xs border border-transparent cursor-pointer select-none " +
  "transition-colors duration-200 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
  "disabled:opacity-50 disabled:pointer-events-none";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active",
  secondary: "bg-dark text-white hover:bg-dark-light active:bg-dark",
  outline:
    "border-line-strong bg-white text-ink hover:bg-surface-sunken active:bg-surface-sunken",
  ghost: "bg-transparent text-ink hover:bg-surface-sunken active:bg-surface-sunken",
  subtle: "bg-primary-subtle text-primary hover:bg-brand-100 active:bg-brand-200",
  // For placing on dark or brand-coloured surfaces, where `outline` would put
  // white text on its own white background.
  inverse:
    "border-white/60 bg-transparent text-white hover:bg-white/15 active:bg-white/25 focus-visible:outline-white",
  danger: "bg-danger text-white hover:bg-danger/90 active:bg-danger",
};

// Heights are fixed so a button always lines up with an input of the same size.
export const buttonSizes: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-2xs",
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
  xl: "h-11 px-6 text-base",
};

// Square counterparts for icon-only controls.
export const iconButtonSizes: Record<ButtonSize, string> = {
  xs: "h-7 w-7 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-9 w-9 text-base",
  lg: "h-10 w-10 text-lg",
  xl: "h-11 w-11 text-lg",
};

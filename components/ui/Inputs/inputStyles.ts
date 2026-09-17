// Single source of truth for form controls. Heights mirror buttonStyles so an
// input and a button of the same size line up on one row.

export type ControlSize = "sm" | "md" | "lg";

export const fieldWrap = "flex flex-col gap-1.5";

export const labelClass = "text-xs font-semibold text-ink";

export const hintClass = "text-2xs text-muted";

export const errorClass = "text-2xs font-medium text-danger";

export const controlBase =
  "w-full bg-white text-ink rounded-xl border transition-colors duration-200 ease-out " +
  "placeholder:text-muted placeholder:font-normal " +
  "focus:outline-none focus:ring-2 " +
  "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-muted";

export const controlTone = {
  normal: "border-line-strong focus:border-primary focus:ring-primary/20",
  error: "border-danger focus:border-danger focus:ring-danger/20",
};

export const controlSizes: Record<ControlSize, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-3.5 text-sm",
};

/** Multi-line controls need padding rather than a fixed height. */
export const textareaSizes: Record<ControlSize, string> = {
  sm: "px-2.5 py-2 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-3.5 py-2.5 text-sm",
};

export function tone(hasError?: unknown) {
  return hasError ? controlTone.error : controlTone.normal;
}

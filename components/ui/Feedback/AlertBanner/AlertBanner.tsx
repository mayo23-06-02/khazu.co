"use client";
import { ReactNode } from "react";
import { MdInfoOutline, MdWarningAmber, MdErrorOutline, MdCheckCircleOutline, MdClose } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type AlertVariant = "info" | "warning" | "danger" | "success";

interface AlertBannerProps {
  children: ReactNode;
  title?: string;
  variant?: AlertVariant;
  onDismiss?: () => void;
  className?: string;
}

const styles: Record<AlertVariant, { wrap: string; icon: typeof MdInfoOutline }> = {
  info: { wrap: "bg-info-light text-info border-info/20", icon: MdInfoOutline },
  warning: { wrap: "bg-warning-light text-warning border-warning/20", icon: MdWarningAmber },
  danger: { wrap: "bg-danger-light text-danger border-danger/20", icon: MdErrorOutline },
  success: { wrap: "bg-success-light text-success border-success/20", icon: MdCheckCircleOutline },
};

export function AlertBanner({
  children,
  title,
  variant = "info",
  onDismiss,
  className = "",
}: AlertBannerProps) {
  const { wrap, icon: Icon } = styles[variant];
  return (
    <div
      role="alert"
      className={twMerge(
        clsx("flex items-start gap-2.5 rounded-xl border px-3 py-2.5", wrap, className),
      )}
    >
      <Icon aria-hidden="true" className="mt-px size-4 shrink-0" />
      <div className="min-w-0 flex-1">
        {title && <p className="text-xs font-semibold">{title}</p>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
        >
          <MdClose className="size-4" />
        </button>
      )}
    </div>
  );
}

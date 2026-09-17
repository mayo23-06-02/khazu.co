"use client";
import { ReactNode } from "react";
import { MdInfoOutline, MdWarningAmber, MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type AlertVariant = "info" | "warning" | "danger" | "success";

interface InlineAlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
}

const styles: Record<AlertVariant, { text: string; icon: typeof MdInfoOutline }> = {
  info: { text: "text-info", icon: MdInfoOutline },
  warning: { text: "text-warning", icon: MdWarningAmber },
  danger: { text: "text-danger", icon: MdErrorOutline },
  success: { text: "text-success", icon: MdCheckCircleOutline },
};

export function InlineAlert({ children, variant = "info", className = "" }: InlineAlertProps) {
  const { text, icon: Icon } = styles[variant];
  return (
    <p className={twMerge(clsx("flex items-center gap-1.5 text-2xs font-medium", text, className))}>
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}

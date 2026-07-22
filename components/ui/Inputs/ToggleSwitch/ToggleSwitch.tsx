"use client";
import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ToggleSwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({ label, className = "", ...props }, ref) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
        <div
          className={twMerge(
            clsx(
              "h-6 w-11 rounded-full bg-[#1a1a1a]/40 transition-colors peer-checked:bg[#CD2C58] peer-focus:ring-2 peer-focus:ring[#CD2C58]/30",
              className,
            ),
          )}
        >
          <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
        </div>
      </div>
      {label && <span className="text-sm text-gray-800/80">{label}</span>}
    </label>
  ),
);
ToggleSwitch.displayName = "ToggleSwitch";

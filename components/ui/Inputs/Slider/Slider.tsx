"use client";
import { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { labelClass } from "../inputStyles";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  label?: string;
  /** Render the current value next to the label. */
  formatValue?: (value: number) => string;
  className?: string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 0,
  onChange,
  label,
  formatValue,
  className = "",
}: SliderProps) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const current = isControlled ? controlledValue : internal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const pct = max === min ? 0 : ((current - min) / (max - min)) * 100;

  return (
    <div className={twMerge(clsx("flex w-full flex-col gap-1.5", className))}>
      {(label || formatValue) && (
        <div className="flex items-center justify-between">
          {label && <span className={labelClass}>{label}</span>}
          {formatValue && (
            <span className="text-xs font-semibold text-primary">{formatValue(current)}</span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={handleChange}
        aria-label={label}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-sunken accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        style={{
          background: `linear-gradient(to right, var(--color-primary) ${pct}%, var(--color-surface-sunken) ${pct}%)`,
        }}
      />
    </div>
  );
}

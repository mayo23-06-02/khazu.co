"use client";
import { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  label?: string;
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
  className = "",
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const percentage = ((value - min) / (max - min)) * 100;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setInternalValue(v);
    onChange?.(v);
  };
  return (
    <div className={twMerge(clsx("flex flex-col gap-1", className))}>
      {label && (
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-800">{label}</span>
          <span className="text-sm text-gray-800/60">{value}</span>
        </div>
      )}
      <div className="relative h-6 flex items-center">
        <div className="absolute h-1.5 w-full bg-dark/10 rounded-full" />
        <div
          className="absolute h-1.5 bg[#CD2C58] rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute w-full h-6 opacity-0 cursor-pointer"
        />
        <div
          className="absolute h-4 w-4 bg-white border-2 border[#CD2C58] rounded-full shadow-sm pointer-events-none"
          style={{ left: `${percentage}%`, transform: "translateX(-50%)" }}
        />
      </div>
    </div>
  );
}

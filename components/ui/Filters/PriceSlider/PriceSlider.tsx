"use client";
import { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface PriceSliderProps {
  min?: number;
  max?: number;
  step?: number;
  valueMin?: number;
  valueMax?: number;
  onChange?: (min: number, max: number) => void;
  className?: string;
}

export function PriceSlider({
  min = 0,
  max = 500000,
  step = 5000,
  valueMin,
  valueMax,
  onChange,
  className = "",
}: PriceSliderProps) {
  const [minVal, setMinVal] = useState(valueMin || min);
  const [maxVal, setMaxVal] = useState(valueMax || max);
  const handleChange = (type: "min" | "max", val: number) => {
    if (type === "min") {
      setMinVal(Math.min(val, maxVal - step));
      onChange?.(Math.min(val, maxVal - step), maxVal);
    } else {
      setMaxVal(Math.max(val, minVal + step));
      onChange?.(minVal, Math.max(val, minVal + step));
    }
  };
  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;
  return (
    <div className={twMerge(clsx("px-2", className))}>
      <div className="flex justify-between text-sm text-gray-800/60 mb-2">
        <span>SZL {minVal.toLocaleString()}</span>
        <span>SZL {maxVal.toLocaleString()}</span>
      </div>
      <div className="relative h-1 bg-dark/10 rounded-full">
        <div
          className="absolute h-1 bg-[#CD2C58] rounded-full"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={(e) => handleChange("min", parseInt(e.target.value))}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={(e) => handleChange("max", parseInt(e.target.value))}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
        />
        <div
          className="absolute w-3 h-3 bg-white border-2 border-[#CD2C58] rounded-full -top-1 pointer-events-none"
          style={{ left: `${minPercent}%`, transform: "translateX(-50%)" }}
        />
        <div
          className="absolute w-3 h-3 bg-white border-2 border-[#CD2C58] rounded-full -top-1 pointer-events-none"
          style={{ left: `${maxPercent}%`, transform: "translateX(-50%)" }}
        />
      </div>
    </div>
  );
}

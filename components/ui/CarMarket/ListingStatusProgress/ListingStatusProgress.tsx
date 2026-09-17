"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Step {
  label: string;
  status: "pending" | "active" | "completed" | "error";
}

interface ListingStatusProgressProps {
  steps: Step[];
  className?: string;
}

export function ListingStatusProgress({
  steps,
  className = "",
}: ListingStatusProgressProps) {
  return (
    <div className={twMerge(clsx("flex items-center gap-1", className))}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={twMerge(
              clsx(
                "w-3 h-3 rounded-full border-2 transition-colors",
                step.status === "completed" && "bg-[#CD2C58] border-[#CD2C58]",
                step.status === "active" &&
                  "bg-white border-[#CD2C58] animate-pulse",
                step.status === "error" && "bg-danger border-danger",
                step.status === "pending" && "bg-white border-black/10",
              ),
            )}
            title={step.label}
          />
          {index < steps.length - 1 && (
            <div
              className={twMerge(
                clsx(
                  "w-8 h-0.5 mx-1 transition-colors",
                  steps[index].status === "completed"
                    ? "bg-[#CD2C58]"
                    : "bg-dark/10",
                ),
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

"use client";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-lg shadow-sm border border-black/5 p-6 text-center",
          className,
        ),
      )}
    >
      <div className="text[#CD2C58] text-4xl mb-3">{icon}</div>
      <h3 className="font-display font-semibold text-lg text-gray-800">
        ${title}
      </h3>
      <p className="text-sm text-gray-800/60 mt-1">${description}</p>
    </div>
  );
}

"use client";

import type { Ref } from "react";

export function StepHeading({
  ref,
  title,
  subtitle,
}: {
  ref: Ref<HTMLHeadingElement>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4 lg:mb-6">
      <h3
        ref={ref}
        tabIndex={-1}
        className="text-xl font-black text-gray-900 focus:outline-none"
      >
        {title}
      </h3>
      <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
    </div>
  );
}

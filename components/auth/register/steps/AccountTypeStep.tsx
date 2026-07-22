"use client";

import type { Ref } from "react";
import { useFormContext } from "react-hook-form";
import { FaBuilding, FaUser } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import type { RegisterFormValues } from "../schema";
import { StepHeading } from "../StepHeading";

const ACCOUNT_TYPES = [
  {
    id: "individual" as const,
    label: "Individual",
    desc: "Sell your personal car as a private seller",
    icon: FaUser,
  },
  {
    id: "dealer" as const,
    label: "Dealer",
    desc: "List inventory as a registered dealership",
    icon: FaBuilding,
  },
];

export function AccountTypeStep({
  headingRef,
}: {
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();
  const accountType = watch("account_type");

  return (
    <div className="space-y-4 h-full">
      <StepHeading
        ref={headingRef}
        title="Account type"
        subtitle="How will you use Khazu?"
      />
      <div
        role="radiogroup"
        aria-label="Account type"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {ACCOUNT_TYPES.map((opt) => {
          const selected = accountType === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() =>
                setValue("account_type", opt.id, { shouldValidate: true })
              }
              className={twMerge(
                "rounded-md border-2 p-5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a72346]/50",
                selected
                  ? "border-[#a72346] bg-[#a72346]/5 shadow-md"
                  : "border-gray-200 hover:border-gray-300 bg-white",
              )}
            >
              <div
                className={twMerge(
                  "w-10 h-10 rounded-sm flex items-center justify-center mb-3",
                  selected
                    ? "bg-[#a72346] text-white"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                <Icon size={18} />
              </div>
              <p className="font-bold text-gray-900">{opt.label}</p>
              <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>
            </button>
          );
        })}
      </div>
      {errors.account_type && (
        <p className="text-sm text-danger" role="alert">
          {errors.account_type.message}
        </p>
      )}
    </div>
  );
}

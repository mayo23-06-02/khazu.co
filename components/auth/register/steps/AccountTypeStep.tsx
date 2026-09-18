"use client";

import type { Ref } from "react";
import { useFormContext } from "react-hook-form";
import { FaBuilding, FaCheckCircle, FaUser } from "react-icons/fa";
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
                "relative rounded-md border-2 p-5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                selected
                  ? "border-primary bg-primary-subtle shadow-md"
                  : "border-line hover:border-line-strong bg-white",
              )}
            >
              {selected && (
                <FaCheckCircle
                  className="absolute top-3 right-3 text-primary"
                  size={18}
                  aria-hidden="true"
                />
              )}
              <div
                className={twMerge(
                  "w-10 h-10 rounded-sm flex items-center justify-center mb-3",
                  selected
                    ? "bg-primary text-white"
                    : "bg-surface-sunken text-muted",
                )}
              >
                <Icon size={18} />
              </div>
              <p className="font-bold text-ink">{opt.label}</p>
              <p className="text-sm text-muted mt-1">{opt.desc}</p>
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

"use client";

import type { Ref } from "react";
import { useFormContext } from "react-hook-form";
import { ImageUpload, Select } from "@/components/ui";
import { CITY_OPTIONS } from "../constants";
import { CONTACT_METHODS, type RegisterFormValues } from "../schema";
import { StepHeading } from "../StepHeading";

export function IndividualDetailsStep({
  headingRef,
  onAvatarChange,
}: {
  headingRef: Ref<HTMLHeadingElement>;
  onAvatarChange: (file: File | null) => void;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  return (
    <div className="space-y-4">
      <StepHeading
        ref={headingRef}
        title="A few more details"
        subtitle="All optional — helps buyers find and reach you"
      />
      <ImageUpload
        label="Profile picture (optional)"
        maxCount={1}
        onImagesChange={(files) => onAvatarChange(files[0] ?? null)}
      />
      <Select
        label="Location (city / region)"
        aria-label="Location"
        fullWidth
        options={CITY_OPTIONS}
        error={errors.city?.message}
        {...register("city")}
      />
      <Select
        label="Preferred contact method"
        aria-label="Preferred contact method"
        fullWidth
        options={[{ value: "", label: "No preference" }, ...CONTACT_METHODS]}
        error={errors.preferred_contact_method?.message}
        {...register("preferred_contact_method")}
      />
    </div>
  );
}

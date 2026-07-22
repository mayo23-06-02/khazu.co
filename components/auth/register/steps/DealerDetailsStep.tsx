"use client";

import type { Ref } from "react";
import { useFormContext } from "react-hook-form";
import { ImageUpload, InputNumber, InputText, Select, Textarea } from "@/components/ui";
import { CITY_OPTIONS } from "../constants";
import type { RegisterFormValues } from "../schema";
import { StepHeading } from "../StepHeading";

export function DealerDetailsStep({
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
        title="Business details"
        subtitle="Tell buyers about your dealership"
      />
      <InputText
        label="Dealer / Business name"
        aria-label="Business name"
        placeholder="Khazu Motors"
        fullWidth
        error={errors.business_name?.message}
        {...register("business_name")}
      />
      <InputText
        label="Business registration number (optional)"
        aria-label="Business registration number"
        placeholder="e.g. 2024/12345"
        fullWidth
        error={errors.business_registration_number?.message}
        {...register("business_registration_number")}
      />
      <InputText
        label="Business address"
        aria-label="Business address"
        placeholder="Street, suburb"
        fullWidth
        error={errors.address?.message}
        {...register("address")}
      />
      <Select
        label="City / region"
        aria-label="City or region"
        fullWidth
        options={CITY_OPTIONS}
        error={errors.city?.message}
        {...register("city")}
      />
      <ImageUpload
        label="Dealer logo (optional)"
        maxCount={1}
        onImagesChange={(files) => onAvatarChange(files[0] ?? null)}
      />
      <InputText
        label="Website (optional)"
        aria-label="Website"
        type="url"
        placeholder="https://your-dealership.com"
        fullWidth
        error={errors.website?.message}
        {...register("website")}
      />
      <InputNumber
        label="Years in operation (optional)"
        aria-label="Years in operation"
        error={errors.years_in_operation?.message}
        {...register("years_in_operation")}
        min={0}
        max={150}
      />
      <Textarea
        label="Business description (optional)"
        aria-label="Business description"
        placeholder="A short intro about your dealership"
        rows={3}
        fullWidth
        error={errors.bio?.message}
        {...register("bio")}
      />
    </div>
  );
}

"use client";

import type { Ref } from "react";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui";
import { ReviewRow, ReviewSection } from "../ReviewParts";
import {
  CONTACT_METHODS,
  type RegisterFormValues,
  type RegisterStepId,
} from "../schema";
import { StepHeading } from "../StepHeading";

export function ReviewStep({
  headingRef,
  avatarFile,
  goToStep,
}: {
  headingRef: Ref<HTMLHeadingElement>;
  avatarFile: File | null;
  goToStep: (id: RegisterStepId) => void;
}) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();
  const values = watch();

  return (
    <div className="space-y-4">
      <StepHeading
        ref={headingRef}
        title="Review & submit"
        subtitle="Confirm everything looks right"
      />

      <ReviewSection title="Account type" onEdit={() => goToStep("type")}>
        <ReviewRow
          label="Account"
          value={values.account_type === "dealer" ? "Dealer" : "Individual"}
        />
      </ReviewSection>

      <ReviewSection title="Basic info" onEdit={() => goToStep("basic")}>
        <ReviewRow
          label="Name"
          value={`${values.first_name} ${values.last_name}`.trim()}
        />
        <ReviewRow label="Email" value={values.email} />
        <ReviewRow
          label="Phone"
          value={values.phone ? `+268${values.phone}` : ""}
        />
      </ReviewSection>

      <ReviewSection
        title={values.account_type === "dealer" ? "Business details" : "Profile"}
        onEdit={() => goToStep("specific")}
      >
        {values.account_type === "dealer" ? (
          <>
            <ReviewRow label="Business" value={values.business_name} />
            <ReviewRow
              label="Reg. number"
              value={values.business_registration_number}
            />
            <ReviewRow label="Address" value={values.address} />
            <ReviewRow label="City" value={values.city} />
            {values.website && (
              <ReviewRow label="Website" value={values.website} />
            )}
            {values.years_in_operation != null &&
              !Number.isNaN(values.years_in_operation) && (
                <ReviewRow
                  label="Years active"
                  value={String(values.years_in_operation)}
                />
              )}
            <ReviewRow
              label="Logo"
              value={avatarFile ? avatarFile.name : "—"}
            />
          </>
        ) : (
          <>
            <ReviewRow label="City" value={values.city} />
            <ReviewRow
              label="Contact via"
              value={
                CONTACT_METHODS.find(
                  (c) => c.value === values.preferred_contact_method,
                )?.label
              }
            />
            <ReviewRow
              label="Photo"
              value={avatarFile ? avatarFile.name : "—"}
            />
          </>
        )}
      </ReviewSection>

      <Checkbox
        label="I agree to the Terms & Conditions"
        aria-label="I agree to the Terms and Conditions"
        checked={values.terms_accepted}
        onChange={(e) =>
          setValue("terms_accepted", e.target.checked, {
            shouldValidate: true,
          })
        }
        error={errors.terms_accepted?.message}
      />
    </div>
  );
}

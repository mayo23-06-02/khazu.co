"use client";

import type { Ref } from "react";
import { useFormContext } from "react-hook-form";
import { InputEmail, InputPassword, InputPhone, InputText } from "@/components/ui";
import { PasswordStrengthMeter } from "../PasswordStrengthMeter";
import type { RegisterFormValues } from "../schema";
import { StepHeading } from "../StepHeading";

export function BasicInfoStep({
  headingRef,
}: {
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();
  const password = watch("password");

  return (
    <div className="space-y-4">
      <StepHeading
        ref={headingRef}
        title="Basic information"
        subtitle="Tell us a little about you"
      />
      <div className="grid grid-cols-2 gap-3 overflow-auto">
        <InputText
          label="First name"
          aria-label="First name"
          placeholder="Thandi"
          fullWidth
          error={errors.first_name?.message}
          {...register("first_name")}
        />
        <InputText
          label="Last name"
          aria-label="Last name"
          placeholder="Dlamini"
          fullWidth
          error={errors.last_name?.message}
          {...register("last_name")}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InputEmail
          label="Email"
          aria-label="Email address"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <InputPhone
          label="Phone"
          aria-label="Phone number"
          placeholder="76123456"
          hint={errors.phone ? undefined : "Eswatini number, no country code"}
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <InputPassword
        label="Password"
        aria-label="Password"
        fullWidth
        hint={!password && !errors.password ? "At least 6 characters" : undefined}
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordStrengthMeter password={password} />
      <InputPassword
        label="Confirm password"
        aria-label="Confirm password"
        fullWidth
        error={errors.confirm_password?.message}
        {...register("confirm_password")}
      />
    </div>
  );
}

import type { UseFormSetError } from "react-hook-form";
import {
  accountTypeSchema,
  basicInfoSchema,
  dealerDetailsSchema,
  individualDetailsSchema,
  termsSchema,
  type RegisterFormValues,
  type RegisterStepId,
} from "./schema";

type ZodIssue = { message: string; path: (string | number)[] };

/** Validates one wizard step, wiring field-level errors back into RHF. Returns the first error message, if any. */
export function validateRegisterStep(
  id: RegisterStepId,
  data: RegisterFormValues,
  setFieldError: UseFormSetError<RegisterFormValues>,
): string | null {
  try {
    if (id === "type") {
      accountTypeSchema.parse(data);
    } else if (id === "basic") {
      basicInfoSchema.parse(data);
    } else if (id === "specific") {
      (data.account_type === "dealer"
        ? dealerDetailsSchema
        : individualDetailsSchema
      ).parse(data);
    } else if (id === "review") {
      termsSchema.parse(data);
    }
    return null;
  } catch (e: unknown) {
    if (e && typeof e === "object" && "issues" in e) {
      const issues = (e as { issues: ZodIssue[] }).issues;
      for (const issue of issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          setFieldError(field as keyof RegisterFormValues, {
            message: issue.message,
          });
        }
      }
      return issues[0]?.message || "Please fix the highlighted fields.";
    }
    return "Please fix the highlighted fields.";
  }
}

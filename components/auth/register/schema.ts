import { z } from "zod";

export const REGISTER_STEPS = [
  { id: "type", label: "Account Type" },
  { id: "basic", label: "Basic Info" },
  { id: "specific", label: "Details" },
  { id: "review", label: "Review" },
] as const;

export type RegisterStepId = (typeof REGISTER_STEPS)[number]["id"];

export const CONTACT_METHODS = [
  { value: "phone", label: "Phone call" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

// Local subscriber number only — the +268 country code is a fixed prefix
// rendered by InputPhone and is not part of this field's value.
const eswatiniPhone = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .regex(/^\d{7,8}$/, "Enter a valid Eswatini number, e.g. 76123456");

// ── Step 1: Account type ────────────────────────────────────────────────
export const accountTypeSchema = z.object({
  account_type: z.enum(["individual", "dealer"], {
    message: "Select an account type to continue",
  }),
});

// ── Step 2: Basic information (shared) ──────────────────────────────────
export const basicInfoSchema = z
  .object({
    first_name: z.string().trim().min(1, "First name is required"),
    last_name: z.string().trim().min(1, "Last name is required"),
    email: z.string().trim().email("Enter a valid email address"),
    phone: eswatiniPhone,
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// ── Step 3: Account-specific details ────────────────────────────────────
export const individualDetailsSchema = z.object({
  city: z.string().optional(),
  preferred_contact_method: z
    .union([z.enum(["phone", "email", "whatsapp"]), z.literal("")])
    .optional(),
});

export const dealerDetailsSchema = z.object({
  business_name: z.string().trim().min(2, "Business name is required"),
  business_registration_number: z.string().trim().optional(),
  address: z.string().trim().min(3, "Business address is required"),
  city: z.string().trim().min(2, "Business location is required"),
  website: z
    .union([z.string().trim().url("Enter a valid URL"), z.literal("")])
    .optional(),
  bio: z.string().max(500, "Description must be under 500 characters").optional(),
  years_in_operation: z
    .union([z.coerce.number().int().min(0).max(150), z.nan()])
    .optional(),
});

// ── Step 4: Terms ────────────────────────────────────────────────────────
export const termsSchema = z.object({
  terms_accepted: z.literal(true, {
    message: "You must agree to the Terms & Conditions",
  }),
});

export const registerFormSchema = z
  .object({
    account_type: z.enum(["individual", "dealer"]),
    first_name: z.string().trim().min(1),
    last_name: z.string().trim().min(1),
    email: z.string().trim().email(),
    phone: eswatiniPhone,
    password: z.string().min(6),
    confirm_password: z.string(),
    city: z.string().optional(),
    preferred_contact_method: z
    .union([z.enum(["phone", "email", "whatsapp"]), z.literal("")])
    .optional(),
    business_name: z.string().optional(),
    business_registration_number: z.string().optional(),
    address: z.string().optional(),
    website: z.string().optional(),
    bio: z.string().optional(),
    years_in_operation: z.union([z.coerce.number(), z.nan()]).optional(),
    terms_accepted: z.boolean(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const defaultRegisterValues: RegisterFormValues = {
  account_type: "individual",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  confirm_password: "",
  city: "",
  preferred_contact_method: undefined,
  business_name: "",
  business_registration_number: "",
  address: "",
  website: "",
  bio: "",
  years_in_operation: undefined,
  terms_accepted: false,
};

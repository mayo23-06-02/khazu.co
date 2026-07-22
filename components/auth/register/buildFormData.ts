import type { RegisterFormValues } from "./schema";

/** Maps wizard form values onto the FormData contract `registerUser` expects. */
export function buildRegisterFormData(
  data: RegisterFormValues,
  avatarFile: File | null,
): FormData {
  const fd = new FormData();
  fd.set("full_name", `${data.first_name} ${data.last_name}`.trim());
  fd.set("email", data.email);
  fd.set("phone", `+268${data.phone}`);
  fd.set("password", data.password);
  fd.set("account_type", data.account_type);
  fd.set("city", data.city || "");

  if (data.account_type === "dealer") {
    fd.set("business_name", data.business_name || "");
    fd.set("is_registered_business", "true");
    fd.set(
      "business_registration_number",
      data.business_registration_number || "",
    );
    fd.set("address", data.address || "");
    fd.set("website", data.website || "");
    fd.set("bio", data.bio || "");
    fd.set(
      "years_in_operation",
      data.years_in_operation != null && !Number.isNaN(data.years_in_operation)
        ? String(data.years_in_operation)
        : "",
    );
  } else {
    fd.set("preferred_contact_method", data.preferred_contact_method || "");
  }

  if (avatarFile) fd.set("avatar", avatarFile);
  return fd;
}

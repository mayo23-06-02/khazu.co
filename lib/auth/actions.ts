"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDashboardPath, toDbRole } from "@/lib/auth/roles";
import type { DbRole } from "@/lib/auth/roles";
import { uploadMedia } from "@/lib/supabase/media";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit";
import { validateFile } from "@/lib/security/fileValidation";
import { siteUrl } from "@/lib/seo/site";

export type ActionResult = {
  success: boolean;
  error?: string;
  redirectTo?: string;
};

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

async function uploadBusinessDocuments(
  userId: string,
  formData: FormData,
): Promise<string[]> {
  const files = formData.getAll("business_documents").filter(
    (f): f is File => f instanceof File && f.size > 0,
  );

  if (files.length === 0) return [];

  const admin = createAdminClient();
  const urls: string[] = [];

  for (const file of files) {
    const path = `${userId}/${Date.now()}-${sanitizeFileName(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const validation = validateFile(
      buffer,
      ["jpeg", "png", "webp", "pdf"],
      10 * 1024 * 1024,
    );
    if (!validation.ok) {
      throw new Error(`Document upload failed: ${validation.error}`);
    }

    const { error } = await admin.storage
      .from("business-documents")
      .upload(path, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      throw new Error(`Document upload failed: ${error.message}`);
    }

    // Private bucket — store the storage path; signed URLs generated on demand
    const {
      data: { publicUrl },
    } = admin.storage.from("business-documents").getPublicUrl(path);

    // Prefer path for private buckets; publicUrl still useful if bucket is made public
    urls.push(publicUrl || path);
  }

  return urls;
}

async function uploadAvatar(
  userId: string,
  formData: FormData,
): Promise<string | null> {
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { url } = await uploadMedia(
    buffer,
    "avatars",
    userId,
    file.name,
    file.type || "application/octet-stream",
  );
  return url;
}

export type ContactAvailability = {
  emailTaken: boolean;
  phoneTaken: boolean;
};

/**
 * Pre-signup check so the register wizard can flag a taken email/phone
 * before the user fills out the rest of the form. Fails open (reports
 * nothing taken) if the RPCs aren't installed yet — see
 * supabase/register_contact_checks.sql — so a missing migration never
 * blocks signup, it just skips the early warning.
 */
export async function checkContactAvailability(
  email: string,
  phone: string,
): Promise<ContactAvailability> {
  const ip = await getClientIp();
  const allowed = await checkRateLimit(`contact_check:${ip}`, 20, 3600);
  if (!allowed) {
    return { emailTaken: false, phoneTaken: false };
  }

  const admin = createAdminClient();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim();

  const [emailResult, phoneResult] = await Promise.all([
    normalizedEmail
      ? admin.rpc("email_registered", { check_email: normalizedEmail })
      : Promise.resolve({ data: false, error: null }),
    normalizedPhone
      ? admin.rpc("phone_registered", { check_phone: normalizedPhone })
      : Promise.resolve({ data: false, error: null }),
  ]);

  if (emailResult.error) {
    console.warn("checkContactAvailability email_registered error:", emailResult.error.message);
  }
  if (phoneResult.error) {
    console.warn("checkContactAvailability phone_registered error:", phoneResult.error.message);
  }

  return {
    emailTaken: emailResult.error ? false : Boolean(emailResult.data),
    phoneTaken: phoneResult.error ? false : Boolean(phoneResult.data),
  };
}

export async function registerUser(formData: FormData): Promise<ActionResult> {
  try {
    const ip = await getClientIp();
    const allowed = await checkRateLimit(`register:${ip}`, 5, 3600);
    if (!allowed) {
      return {
        success: false,
        error: "Too many registration attempts. Please try again later.",
      };
    }

    const fullName = String(formData.get("full_name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const phone = String(formData.get("phone") || "").trim();
    const password = String(formData.get("password") || "");
    const accountType = String(formData.get("account_type") || "individual");
    const businessName = String(formData.get("business_name") || "").trim();
    const isRegisteredBusiness =
      String(formData.get("is_registered_business") || "false") === "true";
    const businessRegNumber = String(
      formData.get("business_registration_number") || "",
    ).trim();
    const address = String(formData.get("address") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const bio = String(formData.get("bio") || "").trim();
    const website = String(formData.get("website") || "").trim();
    const preferredContactMethod = String(
      formData.get("preferred_contact_method") || "",
    ).trim();
    const yearsInOperationRaw = String(
      formData.get("years_in_operation") || "",
    ).trim();
    const yearsInOperation = yearsInOperationRaw
      ? Number(yearsInOperationRaw)
      : null;

    if (!fullName || !email || !phone || !password) {
      return { success: false, error: "Please complete all required fields." };
    }
    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      };
    }

    const role: DbRole = toDbRole(
      accountType === "dealer" ? "dealer" : "individual",
    );
    const isDealer = role === "dealer";

    if (isDealer && !businessName) {
      return { success: false, error: "Business name is required for dealers." };
    }
    if (isDealer && isRegisteredBusiness && !businessRegNumber) {
      return {
        success: false,
        error: "Business registration number is required for registered businesses.",
      };
    }

    const supabase = await createClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role,
        },
      },
    });

    if (signUpError) {
      return { success: false, error: signUpError.message };
    }

    const userId = signUpData.user?.id;
    if (!userId) {
      return {
        success: false,
        error: "Registration succeeded but no user was returned. Check email confirmation settings.",
      };
    }

    // If email confirmation is required there may be no session yet —
    // use the service-role client to finish profile + uploads securely.
    let documentUrls: string[] = [];
    if (isDealer && isRegisteredBusiness) {
      documentUrls = await uploadBusinessDocuments(userId, formData);
    }

    let avatarUrl: string | null = null;
    try {
      avatarUrl = await uploadAvatar(userId, formData);
    } catch (avatarErr) {
      console.warn("Avatar/logo upload skipped:", avatarErr);
    }

    const admin = createAdminClient();
    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: userId,
        full_name: fullName,
        phone,
        role,
        avatar_url: avatarUrl,
        is_dealer: isDealer,
        business_name: isDealer ? businessName : null,
        is_registered_business: isDealer ? isRegisteredBusiness : false,
        business_registration_number:
          isDealer && isRegisteredBusiness ? businessRegNumber : null,
        business_documents: documentUrls,
        website: isDealer ? website || null : null,
        years_in_operation: isDealer ? yearsInOperation : null,
        preferred_contact_method: !isDealer
          ? preferredContactMethod || null
          : null,
        address: address || null,
        city: city || null,
        bio: bio || null,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      const missingTable =
        profileError.message.includes("schema cache") ||
        profileError.message.includes("Could not find the table") ||
        profileError.code === "PGRST205";

      return {
        success: false,
        error: missingTable
          ? "Database not set up yet: run supabase/schema.sql in the Supabase SQL Editor (Dashboard → SQL → New query), then try again. If you already registered once, delete that user under Authentication → Users first."
          : `Account created but profile failed: ${profileError.message}`,
      };
    }

    // Automatic 45-day free trial for every new account
    try {
      const { ensureUserTrial } = await import("@/lib/subscriptions/trial");
      await ensureUserTrial(admin, userId, role === "dealer" ? "dealer" : "individual");
    } catch (trialErr) {
      console.warn("Auto-trial setup skipped:", trialErr);
    }

    // If we have a session (email confirm off), go straight to dashboard.
    // Otherwise ask them to log in after confirming email.
    if (signUpData.session) {
      revalidatePath("/", "layout");
      return {
        success: true,
        redirectTo: getDashboardPath(role),
      };
    }

    return {
      success: true,
      redirectTo: `/auth/login?registered=1&email=${encodeURIComponent(email)}`,
    };
  } catch (err) {
    console.error("registerUser error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Registration failed",
    };
  }
}

export async function loginUser(formData: FormData): Promise<ActionResult> {
  try {
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const next = String(formData.get("next") || "");

    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }

    const ip = await getClientIp();
    const allowed = await checkRateLimit(`login:${ip}:${email}`, 5, 900);
    if (!allowed) {
      return {
        success: false,
        error: "Too many login attempts. Please try again in a few minutes.",
      };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const userId = data.user?.id;
    let role: DbRole = "individual";

    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      if (profile?.role) role = profile.role as DbRole;
    }

    revalidatePath("/", "layout");

    const redirectTo =
      next && next.startsWith("/") && !next.startsWith("//")
        ? next
        : getDashboardPath(role);

    return { success: true, redirectTo };
  } catch (err) {
    console.error("loginUser error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Login failed",
    };
  }
}

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return { success: false, error: "Email is required." };
  }

  const ip = await getClientIp();
  const allowed = await checkRateLimit(
    `password_reset:${ip}:${normalizedEmail}`,
    5,
    3600,
  );
  if (!allowed) {
    // Same generic success response as below — don't let rate-limit
    // rejection become another way to distinguish valid from invalid emails.
    return { success: true };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: `${siteUrl}/auth/reset-password`,
  });

  // Always report success — confirming/denying whether an email is
  // registered here would reintroduce the enumeration issue this and the
  // rate limit above are meant to close.
  return { success: true };
}

export async function updatePassword(newPassword: string): Promise<ActionResult> {
  if (newPassword.length < 6) {
    return {
      success: false,
      error: "Password must be at least 6 characters.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      error: "Reset link expired or invalid. Request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, redirectTo: "/auth/login" };
}

export async function logoutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}

export async function getSessionProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    profile,
  };
}

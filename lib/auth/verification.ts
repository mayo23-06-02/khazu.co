import crypto from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendVerificationEmail } from "@/lib/email/emailjs";

const CODE_LENGTH = 6;
const CODE_TTL_MINUTES = 30;

/**
 * Dev-only bypass: set SKIP_EMAIL_VERIFICATION=true to skip sending/checking
 * codes (avoids EmailJS sends while testing signup repeatedly). Must be
 * explicitly "true" — never bypassed implicitly by NODE_ENV — so a
 * misconfigured production build can't silently disable verification.
 */
export function verificationEnabled(): boolean {
  return process.env.SKIP_EMAIL_VERIFICATION !== "true";
}

function generateCode(): string {
  const max = 10 ** CODE_LENGTH;
  return crypto.randomInt(0, max).toString().padStart(CODE_LENGTH, "0");
}

function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

/** Issues a fresh OTP for `email`, stores its hash, and emails it via EmailJS. */
export async function issueVerificationCode(
  admin: SupabaseClient,
  email: string,
  userId: string | null,
) {
  const normalizedEmail = email.trim().toLowerCase();
  const code = generateCode();
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60_000);

  const { error } = await admin.from("email_verifications").insert({
    user_id: userId,
    email: normalizedEmail,
    code_hash: hashCode(code),
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new Error(`Could not create verification code: ${error.message}`);
  }

  await sendVerificationEmail(normalizedEmail, code);
}

export type VerifyCodeResult = { success: true } | { success: false; error: string };

/** Checks `code` against the latest unused, unexpired row for `email`. */
export async function verifyCode(
  admin: SupabaseClient,
  email: string,
  code: string,
): Promise<VerifyCodeResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const codeHash = hashCode(code.trim());

  const { data: row, error } = await admin
    .from("email_verifications")
    .select("id, expires_at, used_at, code_hash, user_id")
    .eq("email", normalizedEmail)
    .is("used_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }
  if (!row) {
    return { success: false, error: "No pending verification for this email." };
  }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { success: false, error: "This code has expired. Request a new one." };
  }
  if (row.code_hash !== codeHash) {
    return { success: false, error: "Incorrect code." };
  }

  const { error: updateError } = await admin
    .from("email_verifications")
    .update({ used_at: new Date().toISOString() })
    .eq("id", row.id);
  if (updateError) {
    return { success: false, error: updateError.message };
  }

  if (row.user_id) {
    await admin
      .from("profiles")
      .update({ email_verified_at: new Date().toISOString() })
      .eq("id", row.user_id);
  }

  return { success: true };
}

/** Invalidates any pending codes and issues + sends a new one. */
export async function reissueVerificationCode(
  admin: SupabaseClient,
  email: string,
) {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing } = await admin
    .from("email_verifications")
    .select("id, user_id")
    .eq("email", normalizedEmail)
    .is("used_at", null);

  if (existing && existing.length > 0) {
    await admin
      .from("email_verifications")
      .update({ used_at: new Date().toISOString() })
      .in("id", existing.map((row) => row.id));
  }

  const userId = existing?.[0]?.user_id ?? null;
  await issueVerificationCode(admin, normalizedEmail, userId);
}

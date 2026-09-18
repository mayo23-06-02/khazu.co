"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { Body, Button, InputText, Logo } from "@/components/ui";
import { verifyEmailCode, resendVerificationCode } from "@/lib/auth/actions";

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const next = searchParams.get("next") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResent(false);

    startTransition(async () => {
      const result = await verifyEmailCode(email, code);
      if (!result.success) {
        setError(result.error || "Verification failed");
        return;
      }
      const loginNext = next
        ? `&next=${encodeURIComponent(next)}`
        : "";
      router.push(
        `/auth/login?registered=1&email=${encodeURIComponent(email)}${loginNext}`,
      );
    });
  };

  const handleResend = () => {
    setError("");
    setResent(false);
    startResendTransition(async () => {
      const result = await resendVerificationCode(email);
      if (!result.success) {
        setError(result.error || "Could not resend code");
        return;
      }
      setResent(true);
    });
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-6 py-10 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#a72346] to-[#e05573]" />
          <div className="flex justify-center items-center pt-12">
            <Logo />
          </div>
          <div className="p-8">
            <div className="text-center mb-8">
              <FaEnvelopeOpenText className="text-[#a72346] mx-auto mb-3" size={28} />
              <h2 className="text-2xl font-black text-gray-900">
                Verify your email
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Enter the 6-digit code we sent to
                {email ? ` ${email}` : " your email"}.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputText
                label="Verification code"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                fullWidth
                required
                autoComplete="one-time-code"
              />

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  <span className="text-red-500 text-xs font-medium">
                    {error}
                  </span>
                </div>
              )}

              {resent && (
                <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
                  <span className="text-green-700 text-xs font-medium">
                    A new code has been sent.
                  </span>
                </div>
              )}

              <Button
                variant="primary"
                size="md"
                fullWidth
                type="submit"
                loading={isPending}
                className="bg-[#a72346] hover:bg-[#8e1c3a] text-white font-bold tracking-wide mt-2"
              >
                Verify
              </Button>
            </form>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-xs text-[#a72346] hover:underline font-semibold disabled:opacity-50"
              >
                {isResending ? "Sending…" : "Resend code"}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 text-center">
            <Body size="sm" className="text-gray-400">
              Wrong email?{" "}
              <Link
                href="/auth/register"
                className="text-[#a72346] hover:underline font-bold"
              >
                Start over
              </Link>
            </Body>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center bg-gray-50">
          <Body className="animate-pulse text-gray-400 font-bold">
            Loading…
          </Body>
        </div>
      }
    >
      <VerifyForm />
    </Suspense>
  );
}

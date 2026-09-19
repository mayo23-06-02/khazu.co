"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { FaEnvelope } from "react-icons/fa";
import { Body, Button, InputText, Logo } from "@/components/ui";
import { requestPasswordReset } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await requestPasswordReset(email);
      if (!result.success) {
        setError(result.error || "Something went wrong.");
        return;
      }
      setSent(true);
    });
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center p-6 py-10 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#a72346] to-[#e05573]" />
          <div className="flex justify-center items-center pt-12">
            <Logo />
          </div>
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-gray-900">
                Reset your password
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                We&apos;ll email you a link to set a new one.
              </p>
            </div>

            {sent ? (
              <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
                <FaEnvelope className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-green-700 text-xs font-medium">
                  If an account exists for {email}, a reset link is on its
                  way. Check your inbox.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputText
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  autoComplete="email"
                />

                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    <span className="text-red-500 text-xs font-medium">
                      {error}
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
                  Send reset link
                </Button>
              </form>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 text-center">
            <Body size="sm" className="text-gray-400">
              Remembered it?{" "}
              <Link
                href="/auth/login"
                className="text-[#a72346] hover:underline font-bold"
              >
                Back to sign in
              </Link>
            </Body>
          </div>
        </div>
      </div>
    </div>
  );
}

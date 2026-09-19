"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaKey } from "react-icons/fa";
import { Button, InputPassword, Logo } from "@/components/ui";
import { updatePassword } from "@/lib/auth/actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    startTransition(async () => {
      const result = await updatePassword(password);
      if (!result.success) {
        setError(result.error || "Something went wrong.");
        return;
      }
      router.push(result.redirectTo || "/auth/login");
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
                Set a new password
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Choose a new password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputPassword
                label="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                autoComplete="new-password"
              />
              <InputPassword
                label="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
                autoComplete="new-password"
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
                <FaKey className="mr-2" /> Update password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

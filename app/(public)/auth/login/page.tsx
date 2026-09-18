"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaSignInAlt } from "react-icons/fa";
import {
  Body,
  Button,
  InputPassword,
  InputText,
  Logo,
} from "@/components/ui";
import { loginUser } from "@/lib/auth/actions";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "";
  const registered = searchParams.get("registered") === "1";
  const prefillEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const fd = new FormData();
      fd.set("email", email);
      fd.set("password", password);
      if (next) fd.set("next", next);

      const result = await loginUser(fd);
      if (!result.success) {
        setError(result.error || "Login failed");
        return;
      }
      router.push(result.redirectTo || "/dashboard");
      router.refresh();
    });
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-primary p-6 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#a72346] to-[#e05573]" />
            <div className="flex justify-center items-center pt-12">
              <Logo />
              </div>
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-gray-900">
                  Sign In to Khazu
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Access your listings and dashboard
                </p>
              </div>

              {registered && (
                <div className="mb-4 flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
                  <FaCheckCircle className="text-green-500 shrink-0 mt-0.5" />
                  <span className="text-green-700 text-xs font-medium">
                    Account created. Sign in to continue
                    {prefillEmail ? ` as ${prefillEmail}` : ""}.
                  </span>
                </div>
              )}

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
                <InputPassword
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  autoComplete="current-password"
                />

                <div className="flex justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-[#a72346] hover:underline font-semibold"
                  >
                    Forgot password?
                  </Link>
                </div>

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
                  <FaSignInAlt className="mr-2" /> Sign In
                </Button>
              </form>

            
            </div>

            <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 text-center">
              <Body size="sm" className="text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-[#a72346] hover:underline font-bold"
                >
                  Create one here
                </Link>
              </Body>
            </div>
          </div>
        </div>
      </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center bg-primary">
          <Body className="animate-pulse text-white font-bold">
            Loading…
          </Body>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

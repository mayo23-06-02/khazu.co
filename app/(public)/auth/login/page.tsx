"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
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
    <div className="min-h-screen w-full flex relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/sell-bg.jpg"
          alt="Khazu background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-[#a72346]/35" />
      </div>

      <div className="hidden lg:flex flex-col justify-between w-1/2 relative z-10 p-12">
        <Logo variant="light" />
        <div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Welcome Back.
            <br />
            <span className="text-[#f87171]">Drive More Sales.</span>
          </h2>
          <p className="text-white/70 text-base max-w-xs">
            Sign in to manage your listings, view analytics, and connect with
            buyers across Eswatini.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Manage all your listings in one place",
              "Track views, likes & buyer inquiries",
              "Boost listings to reach more buyers",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-3 text-white/80 text-sm font-medium"
              >
                <FaCheckCircle className="text-[#f87171] shrink-0" size={15} />
                {t}
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} Khazu. All rights reserved.
        </p>
      </div>

      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 lg:hidden">
            <Logo variant="light" />
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#a72346] to-[#e05573]" />

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
                  size="lg"
                  fullWidth
                  type="submit"
                  loading={isPending}
                  className="bg-[#a72346] hover:bg-[#8e1c3a] text-white font-bold tracking-wide mt-2"
                >
                  <FaSignInAlt className="mr-2" /> Sign In
                </Button>
              </form>

              {/* OAuth placeholder */}
              <div className="mt-6">
                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute inset-x-0 h-px bg-gray-100" />
                  <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-gray-300">
                    Or continue with
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  disabled
                  className="opacity-60 cursor-not-allowed"
                >
                  Google (coming soon)
                </Button>
              </div>
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
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Body className="animate-pulse text-gray-400 font-bold">
            Loading…
          </Body>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

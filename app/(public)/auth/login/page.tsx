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
    <div className="min-h-dvh w-full flex relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/toyota-hilux-legend.png"
          alt="Khazu background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute w-screen h-dvh inset-0 bg-gradient-to-br from-black/65 via-black/25 to-[#a72346]/45" />
      </div>

      {/* Left: full-bleed Toyota Hilux Legend ad */}
      <div className="hidden lg:block w-full relative z-10 overflow-hidden lg:ml-14">
      
        
        {/* Top brand row */}
        <div className="absolute top-0 inset-x-0 p-10 flex items-center justify-between">
         
          <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.3em]">
            Sponsored
          </span>
        </div>

        {/* Bottom ad content */}
        <div className="absolute bottom-0 lg:mb-12 inset-x-0 p-10">
          <p className="text-[#f87171] text-xs font-bold uppercase tracking-[0.3em] mb-3">
            New-Generation Hilux
          </p>
          <h2 className="text-5xl font-black text-white leading-none mb-4">
            HILUX <span className="text-white/85">LEGEND</span>
          </h2>
          <p className="text-white/70 text- leading-6 max-w-md mb-6">
            Available exclusively with the 2.8-litre GD-6 engine and the option
            of a mild hybrid that adds a stop-start function. An array of safety
            and comfort features, and modern technology combine to make this
            New-Generation Hilux perfect for any worksite, farm, home, and
            anything in-between.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-md">
            <div className="rounded-md bg-white px-4 py-3 border-b-2 border-[#a72346] shadow-xl">
              <p className="text-[13px] font-black text-gray-900 leading-tight">
                2.8 GD-6 4X4 LEGEND MHEV 6AT
              </p>
              <p className="text-gray-500 text-xs font-semibold mt-1">
                From: R 999 900
              </p>
            </div>
            <div className="rounded-md bg-black  px-4 py-3 border border-white/15">
              <p className="text-[13px] font-black text-white leading-tight">
                2.8 GD-6 RB LEGEND MHEV 6AT
              </p>
              <p className="text-white/60 text-xs font-semibold mt-1">
                From: R 945 500
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 lg:hidden">
            <Logo variant="light" />
          </div>

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
    </div>
  );
}

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}

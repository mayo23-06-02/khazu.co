"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FaRocket } from "react-icons/fa6";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Image from "next/image";
import { FaCar } from "react-icons/fa";
import { Flex } from "../../Layout/Flex/Flex";
import { Heading1 } from "../../Typography/Heading1/Heading1";
import { Logo } from "../../Shared/Logo/Logo";
import { Button } from "../../Buttons/Button/Button";
import { Heading2 } from "../../Typography/Heading2/Heading2";

interface LaunchCountdownProps {
  className?: string;
}

// 20 August 2026, 06:00 SAST (UTC+2)
const LAUNCH_ISO = "2026-08-20T06:00:00+02:00";

const slideUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function splitDigits(value: number) {
  return value.toString().padStart(2, "0").split("");
}

function FlipDigit({ digit }: { digit: string }) {
  return (
    <span className="relative flex h-10 w-7 items-center justify-center overflow-hidden rounded-md bg-white/5 sm:h-16 sm:w-11 md:h-20 md:w-14">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-white sm:text-4xl md:text-5xl"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
      <span className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px bg-black/30" />
    </span>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div className="flex gap-0.5 sm:gap-1">
        {splitDigits(value).map((digit, idx) => (
          <FlipDigit key={idx} digit={digit} />
        ))}
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-widest text-white/50 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export function LaunchCountdown({ className = "" }: LaunchCountdownProps) {
  const target = useMemo(() => new Date(LAUNCH_ISO).getTime(), []);

  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(target);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(target - now, 0);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);

  const launched = mounted && diff <= 0;

  return (
    <section
      id="launch-countdown"
      className={twMerge(
        clsx(
          "relative isolate flex min-h-dvh w-full flex-col justify-center overflow-hidden bg-[#a72346] py-20 md:py-16",
          className,
        ),
      )}
    >
      {/* Decorative background layer — isolated so it can never clip real content */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-[50%] w-[55%] max-w-150   ">
          <Image
            src="/left.png"
            width={600}
            height={600}
            alt=""
            aria-hidden="true"
            className="h-auto w-full"
          />
        </div>

        <img
          src="/red-sun.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-auto w-full opacity-90"
        />

        <img
          src="/bg-tree.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-x-0 top-[45%] h-auto w-full scale-110"
        />

        <img
          src="/flake1.svg"
          alt=""
          aria-hidden="true"
          className="absolute left-0 top-[25%] hidden h-auto w-[10%] scale-110 sm:block"
        />
        <img
          src="/flake2.svg"
          alt=""
          aria-hidden="true"
          className="absolute left-[85%] top-[25%] hidden h-auto w-[10%] scale-110 sm:block"
        />

        {/* Ambient glow */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary blur-[120px]" />
          <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-danger blur-[120px]" />
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:gap-8 lg:px-8"
      >
        <motion.div variants={slideUp} className="flex-1">
          <div className="mb-4 md:mb-6">
            <Logo />
          </div>
          <div className="mb-4 md:mb-6">
            <Heading2 className="mb-3 text-xl font-display font-black leading-[1.1] tracking-tight text-gray-100 sm:text-3xl md:mb-4 md:text-4xl lg:text-6xl">
              Welcome to the <br /> all-new Khazu
            </Heading2>

            <p className="mb-4 max-w-xl text-sm font-light leading-relaxed text-gray-300 sm:text-lg md:mb-6 md:text-xl">
              From verified dealers to private sellers, we bring you the
              widest selection of quality vehicles across Eswatini — all
              in one trusted marketplace.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={slideUp}
          className="relative max-w-full flex-1 overflow-hidden rounded-lg lg:max-w-[30vw] xl:max-w-[20vw]"
        >
          <div className="relative aspect-16/10 lg:aspect-4/3">
            <Image
              src="/home-banner.png"
              alt="Interior of a car with passengers"
              width={800}
              height={500}
              className="h-auto w-full object-cover"
              priority
            />
            <div className="absolute bottom-2 right-2 rounded-lg bg-white/95 px-2 py-1 shadow-lg backdrop-blur sm:bottom-4 sm:right-4 sm:px-4 sm:py-2">
              <Flex gap="sm" items="center">
                <FaCar className="text-xs text-[#ff4c29] sm:text-sm" />
                <span className="text-xs font-medium text-gray-800 sm:text-sm">
                  Over 75k cars
                </span>
              </Flex>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto mt-10 w-full max-w-2xl px-4 text-center sm:px-6 "
      >
        <motion.p
          variants={slideUp}
          className="font-display text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl"
        >
          Khazu.co goes live in
        </motion.p>
        <motion.p variants={slideUp} className="mt-2 text-xs text-white/50 sm:text-sm md:text-base">
          20 August 2026 &middot; 06:00 SAST — mark your calendar
        </motion.p>

        <motion.div variants={slideUp} className="mt-6 md:mt-10">
          {launched ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <FaRocket className="text-primary" size={40} />
              <p className="font-display text-xl font-bold text-white sm:text-2xl md:text-3xl">
                We&apos;re live! Khazu.co has launched.
              </p>
              <Link href="/listings">
                <span className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-bold text-dark transition-transform active:scale-95 hover:bg-primary-light sm:text-base">
                  Start Browsing
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 sm:gap-4 md:gap-6">
              <TimeUnit value={days} label="Days" />
              <span className="mb-5 font-display text-lg font-bold text-white/20 sm:mb-6 sm:text-2xl md:text-3xl">
                :
              </span>
              <TimeUnit value={hours} label="Hours" />
              <span className="mb-5 font-display text-lg font-bold text-white/20 sm:mb-6 sm:text-2xl md:text-3xl">
                :
              </span>
              <TimeUnit value={minutes} label="Minutes" />
              <span className="mb-5 font-display text-lg font-bold text-white/20 sm:mb-6 sm:text-2xl md:text-3xl">
                :
              </span>
              <TimeUnit value={seconds} label="Seconds" />
            </div>
          )}
        </motion.div>

        {!launched && (
          <motion.div variants={slideUp} className="flex justify-center">
            <Link href="/login" className="mt-8 inline-block w-full sm:w-auto md:mt-12">
              <Button fullWidth variant="primary">
                Get Early Access & List your vehicle(s)
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

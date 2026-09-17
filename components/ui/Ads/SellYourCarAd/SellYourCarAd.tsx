"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Container } from "../../Layout/Container/Container";
import { Button } from "../../Buttons/Button/Button";
import { Heading1 } from "../../Typography/Heading1/Heading1";

import {
  FaStar,
  FaCar,
  FaVanShuttle,
  FaCarSide,
  FaGasPump,
  FaPiggyBank,
} from "react-icons/fa6";

interface SellYourCarAdProps {
  className?: string;
}

const categories = [
  { label: "New", icon: <FaStar size={14} />, href: "/listings?condition=new" },
  { label: "Used", icon: <FaCar size={14} />, href: "/listings?condition=used" },
  { label: "Vans", icon: <FaVanShuttle size={14} />, href: "/listings?type=Van" },
  { label: "SUVs", icon: <FaCarSide size={14} />, href: "/listings?type=SUV" },
  { label: "Petrol", icon: <FaGasPump size={14} />, href: "/listings?fuel=petrol" },
  { label: "Diesel", icon: <FaGasPump size={14} />, href: "/listings?fuel=Diesel" },
  {
    label: "Below SZL 150k",
    icon: <FaPiggyBank size={14} />,
    href: "/listings?maxPrice=150000",
  },
];

export function SellYourCarAd({ className = "" }: SellYourCarAdProps) {
  const [plate, setPlate] = useState("");
  return (
    <section className={`bg-surface py-8 ${className}`}>
      <Container>
        {/* Category Quick Links */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-2">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-sm whitespace-nowrap transition-colors"
            >
              <span className="text-gray-900 text-sm">{cat.icon}</span>
              <span className="text-xs font-medium text-gray-900">{cat.label}</span>
            </Link>
          ))}
        </div>
        <div className="bg-[#1a1a1a] rounded-lg overflow-hidden flex flex-col md:flex-row relative">
          {/* Left Content */}
          <div className="flex-1 p-4 md:p-12 flex flex-col justify-center items-start text-white relative z-10">
            <h2 className="text-4xl font-sans md:text-5xl font-black tracking-tight leading-none mb-4 uppercase font-display">
              SELL YOUR CAR.
              <br />
              NO HASSLE.
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-md mb-8 font-light">
              Get an instant online valuation in 60 seconds. Best prices in
              Eswatini, guaranteed.*
            </p>

            <div className="w-full flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Plate Number"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                className="w-full md:flex-1 min-w-0 h-14 md:h-15 rounded-md placeholder:gray-300 bg-white text-black uppercase font-black font-mono text-2xl sm:text-3xl md:text-4xl text-center"
              />
              <Link href={`/sell/upload?reg=${encodeURIComponent(plate)}`} className="w-full md:flex-1">
                <Button className="bg-white w-full text-black hover:bg-gray-100 rounded-md px-10 py-4 text-lg font-bold transition-all transform active:scale-95">
                  Sell My Car
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-[10px] text-white/40  font-medium">
              *Terms and conditions apply. Valuation based on market data.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative min-h-[300px] md:min-h-0">
            <Image
              src="/sell.jpg"
              alt="Sell your car at Khazu"
              fill
              className="object-cover"
            />

            {/* Advertisement Badge */}
            <div className="absolute top-4 right-4 z-20">
              <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold text-black px-2 py-0.5 rounded border border-black/10 uppercase">
                Advertisement
              </span>
            </div>
          </div>
        </div>

        {/* Browse by Budget Section */}
        <div className="mt-12 gap-y-6">
          <Heading1 className="mb-6">Browse by Budget</Heading1>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Under SZL 30k", image: "/E30.webp" },
              { label: "Under SZL 40k", image: "/E40.webp" },
              { label: "Under SZL 60k", image: "/E60.webp" },
              { label: "Under SZL 90k", image: "/E90.webp" },
              { label: "Under SZL 150k", image: "/E150.webp" },
              { label: "Open budget", image: "/open.webp" },
            ].map((budget, idx) => (
              <Link
                key={idx}
              href={`/listings?maxPrice=${budget.label.match(/\d+/)?.[0] || ""}`}
                className="group bg-[#cd2c58]/10 rounded-md h-56 p-4 flex flex-col relative overflow-hidden transition-all hover:bg-[#d1d1cc] "
              >
                <div className="absolute  inset-0">
                  <div className="relative bg-bw-full h-full overflow-hidden">
                    <Image
                      src={budget.image}
                      alt={budget.label}
                      fill
                      className={twMerge(
                        "object-contain object-bottom transition-all duration-700 group-hover:scale-[1.85]",
                        idx === 5
                          ? "object-center scale-[1.5] -translate-y-1/12"
                          : "translate-x-2/3 -translate-y-5/6 scale-[2.75]",
                      )}
                    />
                  </div>
                </div>
                <span className="mt-auto text-lg font-semibold text-gray-900 text-center relative z-10 tracking-tight">
                  {budget.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../Buttons/Button/Button";
import { Container } from "../../Layout/Container/Container";
import {
  FaStar,
  FaCar,
  FaVanShuttle,
  FaCarSide,
  FaGasPump,
  FaPiggyBank,
} from "react-icons/fa6";

const categories = [
  { label: "New", icon: <FaStar size={14} />, href: "/listings?condition=new" },
  {
    label: "Used",
    icon: <FaCar size={14} />,
    href: "/listings?condition=used",
  },
  {
    label: "Vans",
    icon: <FaVanShuttle size={14} />,
    href: "/listings?type=Van",
  },
  {
    label: "SUVs",
    icon: <FaCarSide size={14} />,
    href: "/listings?type=SUV",
  },
  {
    label: "Petrol",
    icon: <FaGasPump size={14} />,
    href: "/listings?fuel=petrol",
  },
  {
    label: "Diesel",
    icon: <FaGasPump size={14} />,
    href: "/listings?fuel=diesel",
  },
  {
    label: "Below SZL 150k",
    icon: <FaPiggyBank size={14} />,
    href: "/listings?maxPrice=150000",
  },
];

export function ListingsSellBanner({ className = "" }: { className?: string }) {
  const [plate, setPlate] = useState("");

  return (
    <section className={`bg-surface ${className}`}>
      {/* Category quick links (above fixed-height ad) */}
      <Container className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar py-4">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.href}
            className="flex items-center gap-2 px-5 py-3 bg-gray-200 hover:bg-gray-300 rounded-md whitespace-nowrap transition-colors"
          >
            <span className="text-gray-900 text-lg">{cat.icon}</span>
            <span className="text-sm text-gray-900">{cat.label}</span>
          </Link>
        ))}
      </Container>

      {/* Fixed-height sell ad — mirrors SellYourCarAd */}
      <Container className="pb-4">
        <div className="bg-[#1a1a1a] rounded-none sm:rounded-lg overflow-hidden flex flex-col md:flex-row relative w-full h-full">
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-center items-start text-white relative z-10 min-h-0">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-3 uppercase font-display">
              SELL YOUR CAR.
              <br />
              NO HASSLE.
            </h2>
            <p className="text-base md:text-lg text-white/80 max-w-md mb-6 font-light line-clamp-2">
              Get an instant online valuation in 60 seconds. Best prices in
              Eswatini, guaranteed.*
            </p>

            <div className="w-full max-w-xl flex flex-col lg:flex-row  gap-3">
              <input
                type="text"
                placeholder="Plate Number"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                className="w-full h-14 rounded-md placeholder:text-gray-400 bg-white text-black uppercase font-black font-mono text-xl md:text-3xl text-center"
              />
              <Link
                href={`/sell/upload?reg=${encodeURIComponent(plate)}`}
                className="w-full"
              >
                <Button className="bg-white w-full h-14 text-black hover:bg-gray-100 rounded-md px-6 text-base md:text-lg font-bold transition-all active:scale-95">
                  Sell My Car
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-[10px] text-white/40 font-medium">
              *Terms and conditions apply. Valuation based on market data.
            </p>
          </div>

          <div className="flex-1 relative min-h-[140px] md:min-h-0 hidden sm:block">
            <Image
              src="/sell.jpg"
              alt="Sell your car at Khazu"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4 z-20">
              <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold text-black px-2 py-0.5 rounded border border-black/10 uppercase">
                Advertisement
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

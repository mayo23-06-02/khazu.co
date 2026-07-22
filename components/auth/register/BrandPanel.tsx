"use client";

import { Logo } from "@/components/ui";

export function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:h-screen flex-col justify-between  bg-white  relative z-10 p-12">
      <Logo variant="light" />
      <div>
        <h2 className="text-4xl font-black text-white leading-tight mb-4">
          Sell Smarter.
          <br />
          <span className="text-[#f87171]">Move Faster.</span>
        </h2>
        <p className="text-white/70 text-base max-w-xs">
          Join sellers and dealerships across Eswatini who trust Khazu to
          connect them with serious buyers.
        </p>
      </div>
      <p className="text-white/30 text-xs">
        © {new Date().getFullYear()} Khazu. All rights reserved.
      </p>
    </div>
  );
}

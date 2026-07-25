"use client";

import { Logo } from "@/components/ui";

export function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:h-dvh flex-col w-full justify-center    relative z-10 p-12">
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
     
    </div>
  );
}

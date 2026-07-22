"use client";
import { Button, Badge } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SubscriptionCardProps {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
  className?: string;
}

export function SubscriptionCard({
  name,
  price,
  features,
  isPopular = false,
  onSelect,
  className = "",
}: SubscriptionCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-lg shadow-sm border border-black/5 p-6 text-center relative",
          isPopular && "border[#CD2C58] ring-1 ring[#CD2C58]",
          className,
        ),
      )}
    >
      {isPopular && (
        <Badge variant="primary" className="absolute top-4 right-4">
          Popular
        </Badge>
      )}
      <h3 className="font-display text-2xl font-bold text-gray-800">${name}</h3>
      <p className="text-3xl font-display font-bold text[#CD2C58] mt-2">
        ${price}
      </p>
      <div className="mt-4 space-y-2 text-sm text-gray-800/60">
        {features.map((f, i) => (
          <div key={i}>${f}</div>
        ))}
      </div>
      <Button
        variant={isPopular ? "primary" : "secondary"}
        size="lg"
        fullWidth
        onClick={onSelect}
        className="mt-6"
      >
        Select Plan
      </Button>
    </div>
  );
}

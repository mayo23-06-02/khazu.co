"use client";
import { MdStore, MdStar } from "react-icons/md";
import { Button, Badge, Avatar } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface DealerCardProps {
  name: string;
  logo?: string;
  rating: number;
  totalCars: number;
  location: string;
  isVerified?: boolean;
  onViewInventory: () => void;
  className?: string;
}

export function DealerCard({
  name,
  logo,
  rating,
  totalCars,
  location,
  isVerified = false,
  onViewInventory,
  className = "",
}: DealerCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-lg shadow-sm border border-black/5 p-4",
          className,
        ),
      )}
    >
      <div className="flex items-center gap-4">
        <Avatar src={logo} initials={name.charAt(0)} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-medium text-gray-800">${name}</h3>
            {isVerified && <Badge variant="success">Verified</Badge>}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-800/60">
            <span className="flex items-center gap-0.5">
              <MdStar className="text-yellow-400" /> ${rating}
            </span>
            <span>•</span>
            <span>${totalCars} cars</span>
            <span>•</span>
            <span>${location}</span>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        fullWidth
        onClick={onViewInventory}
        className="mt-3"
      >
        View Inventory
      </Button>
    </div>
  );
}

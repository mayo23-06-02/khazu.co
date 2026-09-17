"use client";
import { MdPhone, MdEmail } from "react-icons/md";
import { Button, Badge } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface LeadCardProps {
  name: string;
  car: string;
  message: string;
  phone?: string;
  email?: string;
  status?: "new" | "contacted" | "converted";
  onContact: () => void;
  className?: string;
}

export function LeadCard({
  name,
  car,
  message,
  phone,
  email,
  status = "new",
  onContact,
  className = "",
}: LeadCardProps) {
  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    converted: "bg-green-100 text-green-800",
  };
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-lg shadow-sm border border-black/5 p-4",
          className,
        ),
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-800">{name}</h3>
          <p className="text-sm text-gray-800/60">{car}</p>
        </div>
        <Badge variant="secondary" className={statusColors[status]}>
          {status}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-gray-800/70">{message}</p>
      <div className="mt-3 flex gap-2">
        {phone && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `tel:${phone}`)}
          >
            <MdPhone size={14} />
          </Button>
        )}
        {email && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `mailto:${email}`)}
          >
            <MdEmail size={14} />
          </Button>
        )}
        <Button variant="primary" size="sm" onClick={onContact}>
          Contact
        </Button>
      </div>
    </div>
  );
}

"use client";
import { MdEmail, MdPerson } from "react-icons/md";
import { Badge } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface MessageCardProps {
  sender: string;
  preview: string;
  timestamp: string;
  unread?: boolean;
  onClick: () => void;
  className?: string;
}

export function MessageCard({
  sender,
  preview,
  timestamp,
  unread = false,
  onClick,
  className = "",
}: MessageCardProps) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        clsx(
          "w-full text-left bg-white rounded-lg shadow-sm border border-black/5 p-4 transition-colors hover:bg-dark/5",
          className,
        ),
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MdPerson className="text-gray-800/40" />
          <span className="font-medium text-gray-800">{sender}</span>
          {unread && <Badge variant="primary">New</Badge>}
        </div>
        <span className="text-xs text-gray-800/50">{timestamp}</span>
      </div>
      <p className="mt-1 text-sm text-gray-800/60 truncate">{preview}</p>
    </button>
  );
}

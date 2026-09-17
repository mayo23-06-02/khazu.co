"use client";
import { MdStar } from "react-icons/md";
import { Avatar } from "@/components/ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ReviewCardProps {
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  className?: string;
}

export function ReviewCard({
  author,
  avatar,
  rating,
  comment,
  date,
  className = "",
}: ReviewCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-white rounded-lg shadow-sm border border-black/5 p-4",
          className,
        ),
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <Avatar src={avatar} initials={author.charAt(0)} />
        <div>
          <div className="font-medium text-gray-800">{author}</div>
          <div className="text-xs text-gray-800/50">{date}</div>
        </div>
        <div className="ml-auto flex items-center gap-0.5 text-yellow-400">
          {Array.from({ length: rating }).map((_, i) => (
            <MdStar key={i} size={14} />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-800/70">{comment}</p>
    </div>
  );
}

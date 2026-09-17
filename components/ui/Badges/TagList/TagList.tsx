"use client";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Badge } from "../Badge/Badge";

interface TagListProps {
  tags: string[];
  /** Cap the visible tags and summarise the rest as "+N". */
  max?: number;
  className?: string;
}

export function TagList({ tags, max, className = "" }: TagListProps) {
  const visible = max ? tags.slice(0, max) : tags;
  const overflow = max ? tags.length - visible.length : 0;
  return (
    <div className={twMerge(clsx("flex flex-wrap gap-1", className))}>
      {visible.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
      {overflow > 0 && <Badge variant="outline">+{overflow}</Badge>}
    </div>
  );
}

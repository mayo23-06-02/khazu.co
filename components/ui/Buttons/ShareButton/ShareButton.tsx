"use client";
import { MdShare } from "react-icons/md";
import { IconButton } from "../IconButton/IconButton";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
}

export function ShareButton({ title, text, url, className = "" }: ShareButtonProps) {
  const handleShare = () => {
    const target = url ?? (typeof window !== "undefined" ? window.location.href : "");
    if (!target) return;
    if (navigator.share) navigator.share({ title, text, url: target }).catch(() => {});
    else navigator.clipboard.writeText(target);
  };
  return (
    <IconButton label="Share" variant="outline" onClick={handleShare} className={className}>
      <MdShare />
    </IconButton>
  );
}

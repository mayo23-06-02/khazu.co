"use client";
import { useState } from "react";
import { MdContentCopy, MdCheck } from "react-icons/md";
import { IconButton } from "../IconButton/IconButton";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <IconButton
      label={copied ? "Copied" : "Copy to clipboard"}
      variant="outline"
      onClick={handleCopy}
      className={className}
    >
      {copied ? <MdCheck className="text-success" /> : <MdContentCopy />}
    </IconButton>
  );
}

"use client";
import { useState } from "react";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdLink,
} from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

export function RichTextEditor({
  value = "",
  onChange,
  label,
  error,
  className = "",
}: RichTextEditorProps) {
  const [content, setContent] = useState(value);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange?.(e.target.value);
  };
  return (
    <div className={twMerge(clsx("flex flex-col gap-1", className))}>
      {label && (
        <label className="text-sm font-medium text-gray-800">{label}</label>
      )}
      <div className="border border-black/20 rounded-lg overflow-hidden">
        <div className="flex gap-1 p-2 border-b border-black/10 bg-cream/30">
          <button
            type="button"
            className="p-1.5 rounded hover:bg-dark/5 transition-colors"
            aria-label="Bold"
          >
            <MdFormatBold size={14} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-dark/5 transition-colors"
            aria-label="Italic"
          >
            <MdFormatItalic size={14} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-dark/5 transition-colors"
            aria-label="Unordered list"
          >
            <MdFormatListBulleted size={14} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-dark/5 transition-colors"
            aria-label="Ordered list"
          >
            <MdFormatListNumbered size={14} />
          </button>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-dark/5 transition-colors"
            aria-label="Link"
          >
            <MdLink size={14} />
          </button>
        </div>
        <textarea
          value={content}
          onChange={handleChange}
          className="w-full p-3 min-h-[120px] focus:outline-none"
          placeholder="Write your content here..."
        />
      </div>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

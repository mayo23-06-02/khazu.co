"use client";
import { useRef, useState } from "react";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  label?: string;
  className?: string;
  error?: string;
}

export function FileUpload({
  onFilesChange,
  accept = "*/*",
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  label = "Upload files",
  className = "",
  error,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) => f.size <= maxSize);
    const updated = multiple ? [...files, ...valid] : valid.slice(0, 1);
    setFiles(updated);
    onFilesChange?.(updated);
  };
  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange?.(updated);
  };
  return (
    <div className={twMerge(clsx("flex flex-col gap-1", className))}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={twMerge(
          clsx(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-[#CD2C58] bg-[#CD2C58]/5"
              : "border-black/20 hover:border-black/40",
            error && "border-danger bg-danger/5",
          ),
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <MdCloudUpload size={32} className="text-gray-800/40" />
          <div className="text-sm text-gray-800/60">
            <span className="font-medium text-gray-800">{label}</span>
            <span className="block text-xs mt-1">
              Drag & drop or click to browse
            </span>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-2 space-y-1">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-dark/5 rounded px-2 py-1 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-gray-800/40 hover:text-danger transition-colors"
                aria-label="Remove file"
              >
                <MdClose size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

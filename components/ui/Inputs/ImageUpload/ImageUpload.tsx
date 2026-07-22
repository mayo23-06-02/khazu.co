"use client";
import { useRef, useState, useEffect } from "react";
import { MdImage, MdClose, MdVideocam } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ImageUploadProps {
  onImagesChange?: (files: File[]) => void;
  maxCount?: number;
  maxSize?: number;
  label?: string;
  className?: string;
  error?: string;
  preview?: boolean;
}

export function ImageUpload({
  onImagesChange,
  maxCount = 10,
  maxSize = 25 * 1024 * 1024, // Increased to 25MB to accommodate small videos
  label = "Upload photos & videos",
  className = "",
  error,
  preview = true,
}: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      previews.forEach((src) => URL.revokeObjectURL(src));
    };
  }, [previews]);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles)
      .filter((f) => f.size <= maxSize)
      .slice(0, maxCount - files.length);

    const newPreviews = valid.map((f) => URL.createObjectURL(f));
    const updatedFiles = [...files, ...valid];
    const updatedPreviews = [...previews, ...newPreviews];

    setPreviews(updatedPreviews);
    setFiles(updatedFiles);
    onImagesChange?.(updatedFiles);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onImagesChange?.(updatedFiles);
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;

    const newFiles = [...files];
    const [movedFile] = newFiles.splice(index, 1);
    newFiles.unshift(movedFile);

    const newPreviews = [...previews];
    const [movedPreview] = newPreviews.splice(index, 1);
    newPreviews.unshift(movedPreview);

    setFiles(newFiles);
    setPreviews(newPreviews);
    onImagesChange?.(newFiles);
  };

  return (
    <div className={twMerge(clsx("flex flex-col gap-3", className))}>
      <div
        onClick={() => inputRef.current?.click()}
        className={twMerge(
          clsx(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            error
              ? "border-danger bg-danger/5"
              : "border-black/20 hover:border-black/40 bg-gray-50/50 hover:bg-gray-50",
          ),
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2 text-gray-800/40 mb-2">
            <MdImage size={32} />
            <MdVideocam size={32} />
          </div>
          <span className="text-sm font-semibold text-gray-800/80">{label}</span>
          <span className="text-xs font-medium text-gray-800/50">
            {files.length} / {maxCount} files (Max {Math.round(maxSize / 1024 / 1024)}MB each)
          </span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            // Reset input value to allow uploading the same file again if removed
            if (e.target) e.target.value = '';
          }}
        />
      </div>

      {preview && previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
          {previews.map((src, index) => {
            const isVideo = files[index]?.type.startsWith("video/");
            const isCover = index === 0;

            return (
              <div
                key={src}
                className={clsx(
                  "relative aspect-[4/3] rounded-lg overflow-hidden bg-[#1a1a1a]/5 group shadow-sm transition-all",
                  isCover ? "ring-4 ring-primary ring-offset-2" : "border border-black/10 hover:border-primary/50"
                )}
              >
                {isVideo ? (
                  <video
                    src={src}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                ) : (
                  <img
                    src={src}
                    alt={`Upload preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Badges / Controls Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Cover Badge */}
                {isCover && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow uppercase tracking-wider">
                    Cover Photo
                  </div>
                )}

                {/* Video Icon */}
                {isVideo && (
                  <div className="absolute bottom-2 right-2 bg-[#1a1a1a]/60 text-white p-1.5 rounded-full backdrop-blur-sm">
                    <MdVideocam size={14} />
                  </div>
                )}

                {/* Set Cover Button */}
                {!isCover && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAsCover(index);
                    }}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 hover:bg-white transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    Set as Cover
                  </button>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute top-2 right-2 bg-[#1a1a1a]/50 text-white rounded-full p-1.5 hover:bg-danger transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                  aria-label="Remove file"
                >
                  <MdClose size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-danger font-medium flex items-center gap-1 mt-1" role="alert">
          <MdClose size={16} />
          {error}
        </p>
      )}
    </div>
  );
}

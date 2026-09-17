"use client";
import { useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import * as UI from "@/components/ui";
import {
  MdCode,
  MdVisibility,
  MdContentCopy,
  MdCheck,
  MdRefresh,
} from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ComponentPreviewProps {
  code: string;
  scope?: any;
  title?: string;
}

export function ComponentPreview({
  code,
  scope = {},
  title = "Component Preview",
}: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [key, setKey] = useState(0);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="border border-black/10 rounded-lg overflow-hidden bg-white shadow-sm">
      <LiveProvider
        key={key}
        code={code}
        scope={{ ...UI, ...scope }}
        theme={{
          plain: {
            color: "#11382b",
            backgroundColor: "#1a1a1a",
          },
          styles: [
            {
              types: ["keyword", "builtin"],
              style: { color: "#ff7eb3", fontWeight: "bold" },
            },
            { types: ["string", "attr-value"], style: { color: "#7dd3fc" } },
            { types: ["punctuation", "operator"], style: { color: "#94a3b8" } },
            {
              types: ["tag", "attr-name"],
              style: { color: "#f472b6", fontWeight: "bold" },
            },
            {
              types: ["comment"],
              style: { color: "#64748b", fontStyle: "italic" },
            },
            { types: ["function"], style: { color: "#c084fc" } },
            { types: ["number"], style: { color: "#fbbf24" } },
            { types: ["boolean"], style: { color: "#fbbf24" } },
          ],
        }}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-cream/30">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-danger" />
              <div className="w-3 h-3 rounded-full bg-[#CD2C58]" />
              <div className="w-3 h-3 rounded-full bg-dark/20" />
            </div>
            <span className="text-xs font-medium text-gray-800/70 hidden sm:inline">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={reset}
              className="p-1.5 text-gray-800/40 hover:text-gray-800 transition-colors"
              title="Reset preview"
            >
              <MdRefresh size={16} />
            </button>
            <button
              onClick={copyCode}
              className="p-1.5 text-gray-800/40 hover:text-gray-800 transition-colors"
              title="Copy code"
            >
              {copied ? (
                <MdCheck size={16} className="text-[#CD2C58]" />
              ) : (
                <MdContentCopy size={16} />
              )}
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className={twMerge(
                clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                  showCode
                    ? "bg-dark text-white shadow-md"
                    : "bg-dark/5 text-gray-800/70 hover:bg-dark/10",
                ),
              )}
            >
              {showCode ? <MdVisibility size={14} /> : <MdCode size={14} />}
              {showCode ? "Hide" : "Show"} Code
            </button>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="p-6 sm:p-8 bg-cream/10 min-h-[200px] flex items-center justify-center border-b border-black/5">
          <div className="w-full max-w-full">
            <LivePreview className="flex justify-center" />
          </div>
          <LiveError className="mt-4 p-4 bg-danger/10 text-danger rounded-lg text-sm" />
        </div>

        {/* Code Editor Area */}
        {showCode && (
          <div className="bg-[#1a1a1a]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
              <span className="text-xs text-white/50 font-mono">JSX</span>
              <span className="text-[10px] text-white/30">Editable</span>
            </div>
            <div
              className="p-4 sm:p-6 overflow-auto"
              style={{ maxHeight: "400px" }}
            >
              <LiveEditor
                className="focus:outline-none font-mono text-sm leading-relaxed"
                style={{
                  backgroundColor: "#1a1a1a",
                  color: "#e2e8f0",
                  minHeight: "150px",
                }}
              />
            </div>
          </div>
        )}

        {/* Footer hint */}
        {showCode && (
          <div className="px-6 py-2 bg-[#1a1a1a] border-t border-white/10">
            <p className="text-[10px] text-white/30 text-right">
              Edit code above to see changes live
            </p>
          </div>
        )}
      </LiveProvider>
    </div>
  );
}

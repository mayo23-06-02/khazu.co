"use client";
import { useState, useEffect, useRef } from "react";
import { MdExpandMore } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { InputText } from "../InputText/InputText";

interface AutocompleteOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: any) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function Autocomplete({
  options,
  value,
  onChange,
  label,
  error,
  placeholder,
  className = "",
  ...props
}: AutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState<AutocompleteOption[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selectedOption = options.find((opt) => opt.value === value);
    if (selectedOption) {
      setInputValue(selectedOption.label);
    } else {
      setInputValue(value || "");
    }
  }, [value, options]);

  useEffect(() => {
    setFiltered(
      options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase()),
      ),
    );
  }, [inputValue, options]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: AutocompleteOption) => {
    setInputValue(option.label);
    setIsOpen(false);
    onChange?.(option.value);
  };

  return (
    <div className={twMerge(clsx("relative", className))} ref={containerRef}>
      <InputText
        label={label}
        error={error}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          const val = e.target.value;
          setInputValue(val);
          setIsOpen(true);
          onChange?.(val);
        }}
        onFocus={() => setIsOpen(true)}
        icon={<MdExpandMore size={14} />}
        {...props}
      />
      {isOpen &&
        (filtered.length > 0 ||
          (inputValue.trim() !== "" &&
            !options.some(
              (opt) => opt.label.toLowerCase() === inputValue.toLowerCase(),
            ))) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md  border border-gray-200 max-h-64 overflow-y-auto z-[100]">
            {filtered.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-200 last:border-none"
              >
                {opt.icon && (
                  <div className="w-6 h-6 flex items-center justify-center grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                    <opt.icon className="text-xl" />
                  </div>
                )}
                <span className="font-medium text-gray-800">{opt.label}</span>
              </button>
            ))}
            {inputValue.trim() !== "" &&
              !options.some(
                (opt) => opt.label.toLowerCase() === inputValue.toLowerCase(),
              ) && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onChange?.(inputValue);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-200 last:border-none group"
                >
                  <div className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded text-primary">
                    +
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">
                      Add "{inputValue}"
                    </span>
                    <p className="text-sm text-gray-500 ">Use custom model</p>
                  </div>
                </button>
              )}
          </div>
        )}
    </div>
  );
}

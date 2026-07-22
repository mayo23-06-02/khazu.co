"use client";
import { forwardRef, InputHTMLAttributes, useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { InputText } from "../InputText/InputText";

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
  debounce?: number;
  label?: string;
  error?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    { onSearch, debounce = 300, label, error, className = "", ...props },
    ref,
  ) => {
    const [value, setValue] = useState("");
    const [placeholder, setPlaceholder] = useState("");

    const phrases = [
      "Search Make or Model...",
      "Toyota Hilux ",
      "VW Polo",
      "BMW X5",
      "Ford Ranger",
      "Audi A4",
      "Mercedes-Benz C-Class",
      "Honda CR-V",
      "Nissan X-Trail",
      "Hyundai i30",
      "Kia Picanto",
    ];

    useEffect(() => {
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let timeoutId: NodeJS.Timeout;

      const type = () => {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
          setPlaceholder(currentPhrase.substring(0, charIndex - 1));
          charIndex--;
        } else {
          setPlaceholder(currentPhrase.substring(0, charIndex + 1));
          charIndex++;
        }

        let typingSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
          isDeleting = true;
          typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          typingSpeed = 500;
        }

        timeoutId = setTimeout(type, typingSpeed);
      };

      type();
      return () => clearTimeout(timeoutId);
    }, []);

    // Auto-search via debounce removed; search is only triggered on Enter key.

    return (
      <InputText
        ref={ref}
        placeholder={placeholder}
        label={label}
        error={error}
        icon={<MdSearch size={16} />}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch?.(value);
          }
        }}
        className={className}
        {...props}
      />
    );
  },
);
SearchBar.displayName = "SearchBar";

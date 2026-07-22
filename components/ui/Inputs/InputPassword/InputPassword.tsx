"use client";
import { forwardRef, InputHTMLAttributes, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { InputText } from "../InputText/InputText";
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ label, error, fullWidth, className = "", ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div className={twMerge(clsx("relative", fullWidth && "w-full", className))}>
        <InputText
          ref={ref}
          type={show ? "text" : "password"}
          label={label}
          error={error}
          fullWidth={fullWidth}
          className="pr-10"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-[38px] text-gray-800/40 hover:text-gray-800 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
        </button>
      </div>
    );
  },
);
InputPassword.displayName = "InputPassword";

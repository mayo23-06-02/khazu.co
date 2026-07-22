"use client";
import { ReactNode, useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Container } from "@/components/ui/Layout/Container/Container";

interface NavbarProps {
  logo: ReactNode;
  links?: Array<{ label: string; href: string }>;
  actions?: ReactNode;
  className?: string;
  sticky?: boolean;
}

export function Navbar({
  logo,
  links = [],
  actions,
  className = "",
  sticky = false,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav
      className={twMerge(
        clsx(
          "bg-white border-b border-black/5",
          sticky && "sticky top-0 z-40",
          className,
        ),
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-6">
            {logo}
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-800/70 hover:text-gray-800 transition-colors text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">{actions}</div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-dark/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden py-4 border-t border-black/5 flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-800/70 hover:text-gray-800 transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">{actions}</div>
          </div>
        )}
      </Container>
    </nav>
  );
}

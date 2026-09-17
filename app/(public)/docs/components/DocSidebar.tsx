"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  MdLayers,
  MdTextFields,
  MdNavigation,
  MdTouchApp,
  MdInput,
  MdViewModule,
  MdChat,
  MdCreditCard,
  MdSettings,
  MdFlashOn,
} from "react-icons/md";
import { HiCursorClick } from "react-icons/hi";

const categories = [
  {
    name: "Foundations",
    icon: MdFlashOn,
    items: ["Colors", "Typography", "Shadows", "Spacing"],
  },
  {
    name: "Layout",
    icon: MdLayers,
    items: [
      "Container",
      "Grid",
      "Flex",
      "Stack",
      "Section",
      "Card",
      "Divider",
      "Spacer",
      "PageHeader",
    ],
  },
  {
    name: "Typography",
    icon: MdTextFields,
    items: ["Headings", "Body", "Small", "Caption"],
  },
  {
    name: "Navigation",
    icon: MdNavigation,
    items: [
      "Navbar",
      "NavLink",
      "Breadcrumb",
      "Pagination",
      "Tabs",
      "Sidebar",
      "MobileDrawer",
      "DropdownMenu",
      "Accordion",
      "Stepper",
    ],
  },
  {
    name: "Buttons",
    icon: HiCursorClick,
    items: ["Button", "ButtonLink", "IconButton", "ButtonGroup", "CtaButton"],
  },
  {
    name: "Inputs",
    icon: MdInput,
    items: [
      "InputText",
      "InputNumber",
      "InputEmail",
      "InputPassword",
      "Textarea",
      "Select",
      "Checkbox",
      "RadioGroup",
      "ToggleSwitch",
      "Slider",
      "FileUpload",
      "ImageUpload",
      "DatePicker",
      "SearchBar",
      "Autocomplete",
    ],
  },
  {
    name: "Finance",
    icon: MdCreditCard,
    items: ["LoanCalculator", "AmortizationTable"],
  },
  {
    name: "Messaging",
    icon: MdChat,
    items: ["ChatBubble", "ChatInput", "ContactForm"],
  },
];

export function DocSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-[calc(100dvh-80px)] sticky top-20 overflow-y-auto pr-6 pb-10">
      <nav className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center gap-2 mb-3 px-3 py-1 bg-[#CD2C58]/5 rounded-lg border border-[#CD2C58]/10">
              <cat.icon className="text-[#CD2C58]" size={18} />
              <h5 className="text-xs font-bold uppercase tracking-widest text-gray-800/70">
                {cat.name}
              </h5>
            </div>
            <ul className="space-y-1">
              {cat.items.map((item) => {
                const slug = item.toLowerCase().replace(/\s+/g, "-");
                const href = `/docs/${slug}`;
                const isActive = pathname === href;

                return (
                  <li key={item}>
                    <Link
                      href={href}
                      className={twMerge(
                        clsx(
                          "block px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                          isActive
                            ? "bg-[#CD2C58] text-gray-800 shadow-sm"
                            : "text-gray-800/50 hover:bg-dark/5 hover:text-gray-800",
                        ),
                      )}
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

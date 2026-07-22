import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#51f58d",
          light: "#a3faba",
        },
        dark: {
          DEFAULT: "#11382b",
          light: "#4a6a5e",
          subtle: "#7a948a",
        },
        danger: {
          DEFAULT: "#CD2C58",
          light: "#ff8a7a",
        },
        cream: {
          DEFAULT: "#ffedda",
          dark: "#f0d8be",
        },
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        sans: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(17, 56, 43, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(17, 56, 43, 0.08), 0 1px 2px -1px rgba(17, 56, 43, 0.08)",
        md: "0 4px 6px -1px rgba(17, 56, 43, 0.1), 0 2px 4px -2px rgba(17, 56, 43, 0.1)",
        lg: "0 10px 15px -3px rgba(17, 56, 43, 0.15), 0 4px 6px -4px rgba(17, 56, 43, 0.15)",
        xl: "0 20px 25px -5px rgba(17, 56, 43, 0.2), 0 8px 10px -6px rgba(17, 56, 43, 0.2)",
        "2xl": "0 25px 50px -12px rgba(17, 56, 43, 0.25)",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'out': 'ease-out',
      },
    },
  },
  plugins: [],
};
export default config;

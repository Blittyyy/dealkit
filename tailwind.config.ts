import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#F7F8FA",
        primary: "#111318",
        muted: "#6B7280",
        "border-soft": "#E6E8EC",
        brand: "#3B6FFF",
        success: "#18B67A",
        dark: "#0F1115",
      },
      borderRadius: {
        card: "10px",
        pill: "9999px",
      },
      keyframes: {
        "auth-fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "success-pop": {
          "0%": { opacity: "0", transform: "scale(0.8) translateY(10px)" },
          "60%": { opacity: "1", transform: "scale(1.05) translateY(-2px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "auth-fade-in": "auth-fade-in 0.5s ease-out forwards",
        "success-pop": "success-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "pulse-soft": "pulse-soft 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#eef4ff",
          100: "#d9e5ff",
          200: "#bcd0ff",
          300: "#8eb0ff",
          400: "#5a85ff",
          500: "#345dff",
          600: "#1f3df5",
          700: "#1a2fe1",
          800: "#1c29b6",
          900: "#1d298f",
        },
        accent: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        ink: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          800: "#1e293b",
          900: "#0f172a",
        },
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      boxShadow: {
        soft:  "0 4px 20px -4px rgba(15, 23, 42, 0.08)",
        glow:  "0 0 40px -8px rgba(52, 93, 255, 0.45)",
        card:  "0 10px 30px -12px rgba(15, 23, 42, 0.15)",
      },

      backgroundImage: {
        "grid-slate":
          "linear-gradient(to right, rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.15) 1px, transparent 1px)",

        "hero-mesh":
          "radial-gradient(at 20% 20%, rgba(52,93,255,0.25) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(16,185,129,0.20) 0px, transparent 50%), radial-gradient(at 0% 80%, rgba(139,92,246,0.20) 0px, transparent 50%), radial-gradient(at 80% 90%, rgba(52,93,255,0.15) 0px, transparent 50%)",
      },

      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%":      { transform: "translate(30px,-40px) scale(1.05)" },
          "66%":      { transform: "translate(-20px,20px) scale(0.95)" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },

      animation: {
        floaty:  "floaty 6s ease-in-out infinite",
        blob:    "blob 14s ease-in-out infinite",
        fadeUp:  "fadeUp 0.6s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },

  plugins: [],
};
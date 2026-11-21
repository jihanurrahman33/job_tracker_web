/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Logbook palette
        paper: "#F2F4F3",
        ink: "#12263A",
        pencil: "#5C6B79",
        rule: "#D5DBE0",
        marker: "#FFD84A",
        stamp: "#C8372D",
        offer: "#1E7A57",
        // Existing screens use `indigo-*`; remap it to ink blue so the whole
        // app follows the same palette.
        indigo: {
          50: "#EEF3F8",
          100: "#DCE6F0",
          200: "#BDD0E3",
          300: "#8FAECB",
          400: "#5E86AD",
          500: "#3C6591",
          600: "#2A4E75",
          700: "#1F3D5E",
          800: "#172F49",
          900: "#12263A",
          950: "#0B1826",
        },
        primary: {
          50: "#EEF3F8",
          100: "#DCE6F0",
          200: "#BDD0E3",
          300: "#8FAECB",
          400: "#5E86AD",
          500: "#3C6591",
          600: "#2A4E75",
          700: "#1F3D5E",
          800: "#172F49",
          900: "#12263A",
          950: "#0B1826",
        },
        card: {
          light: "#ffffff",
          dark: "#18181b",
        },
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(42, 78, 117, 0.25)",
        "glow-sm": "0 0 15px -3px rgba(42, 78, 117, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-subtle": "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

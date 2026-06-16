import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1F3A",        // djupblå bas
        surface: "#F7F9FC",    // nästan-vit yta
        action: "#2E6DA4",     // signalblå CTA
        gain: "#1FA67D",       // mint/grön – besparing
        gain_dark: "#16805F",
        muted: "#6B7280",      // varmgrå stödtext
        line: "#E2E8F1",       // hårfina dividers
        ink_soft: "#16315C",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;

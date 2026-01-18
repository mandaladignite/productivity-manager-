import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base Theme
        background: {
          dark: "#0F172A",
          light: "#FFFFFF",
        },
        surface: {
          dark: "#111827",
          light: "#F9FAFB",
        },
        border: {
          DEFAULT: "#1F2933",
          dark: "#1F2933",
          light: "#E5E7EB",
        },
        // Status Colors
        status: {
          done: "#22C55E",
          "in-progress": "#EAB308",
          pending: "#EF4444",
          overdue: "#EF4444",
          info: "#3B82F6",
        },
        // Original HTML colors
        paper: {
          DEFAULT: "#fefefe",
          50: "#f9fafb",
          100: "#f3f4f6",
        },
        muted: {
          blue: "#eff6ff",
          green: "#f0fdf4",
          purple: "#faf5ff",
        },
        streak: {
          gold: "#fbbf24",
          silver: "#d1d5db",
          bronze: "#f59e0b",
        },
      },
      fontFamily: {
        primary: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "h1-lg": ["28px", { lineHeight: "36px", fontWeight: "600" }],
        h2: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        h3: ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "h3-sm": ["16px", { lineHeight: "22px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px" }],
        "body-sm": ["14px", { lineHeight: "20px" }],
        caption: ["12px", { lineHeight: "16px" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
    },
  },
  plugins: [],
};

export default config;

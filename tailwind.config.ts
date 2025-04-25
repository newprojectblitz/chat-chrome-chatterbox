
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        'system': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        'comic': ['Comic Neue', 'cursive'],
        'typewriter': ['Courier New', 'Courier', 'monospace'],
      },
      colors: {
        window: "hsl(var(--window-grey))",
        titlebar: "hsl(var(--title-bar))",
        bevel: {
          light: "hsl(var(--bevel-light))",
          dark: "hsl(var(--bevel-dark))",
        },
        accent: "hsl(var(--accent-blue))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Azul vibrante
        secondary: "#22C55E", // Verde
        dark: "#1E293B", // Gris oscuro
      },
    },
  },
  plugins: [],
} satisfies Config;

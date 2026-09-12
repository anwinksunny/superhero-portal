/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        horizon: {
          primary: "#0D2B2E",
          secondary: "#153F45",
          accent: "#F5A947",
          "accent-secondary": "#F2705C",
          "text-light": "#FBF3E7",
          "text-muted": "#9FB3AE",
          dark: "#091E20",
          glow: "rgba(245, 169, 71, 0.15)",
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(245, 169, 71, 0.3)',
        'glow-md': '0 0 30px -5px rgba(245, 169, 71, 0.4)',
        'glow-lg': '0 0 50px -8px rgba(245, 169, 71, 0.5)',
      },
    },
  },
  plugins: [],
};
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
        },
      },
    },
  },
  plugins: [],
};
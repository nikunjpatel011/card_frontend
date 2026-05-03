/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#0E3438",
        accent: "#23979E",
        coral: "#F27A5E",
        surface: "#F1F8F8",
        ink: "#0E3438",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(14, 52, 56, 0.09)",
        lift: "0 24px 70px rgba(14, 52, 56, 0.14)",
        insetGlow: "inset 0 1px 0 rgba(255, 255, 255, 0.65)",
      },
    },
  },
  plugins: [],
};

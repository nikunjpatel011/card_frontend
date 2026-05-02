/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#13221E",
        accent: "#9AF36D",
        coral: "#FF6B4A",
        surface: "#F4F5EF",
        ink: "#111815",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(17, 24, 21, 0.09)",
        lift: "0 24px 70px rgba(17, 24, 21, 0.14)",
        insetGlow: "inset 0 1px 0 rgba(255, 255, 255, 0.65)",
      },
    },
  },
  plugins: [],
};

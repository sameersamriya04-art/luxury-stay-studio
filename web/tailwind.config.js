/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        charcoal: "#181715",
        coal: "#1f1d1a",
        line: "#2c2925",
        gold: { DEFAULT: "#C6A46A", light: "#DCC394", deep: "#9A7B44" },
        ivory: "#F5F1E9",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Jost"', "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: { luxe: "0.32em", wide2: "0.22em" },
      transitionTimingFunction: { luxe: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};

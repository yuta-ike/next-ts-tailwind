/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        bgwhite: "#F4F5F7",
        black: "#333333",
      },
      boxShadow: {
        main: "rgba(149, 157, 165, 0.1) 0px 2px 10px;",
        impact: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
      },
      borderRadius: {
        bubble: "24px 8px 18px 12px",
      },
    },
  },
  plugins: [],
}

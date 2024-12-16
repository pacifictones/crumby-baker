/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cabinSketch: ['"Cabin Sketch", serif'],
        chelseaMarket: ['"Chelsea Market", serif'],
      },
    },
  },
  plugins: [],
};

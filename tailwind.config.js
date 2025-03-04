/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cabinSketch: ['"Cabin Sketch", serif'],
        chelseaMarket: ['"Chelsea Market", serif'],
        heading: ['"Alice", serif'],
        body: ['"Quattrocento Sans", serif'],
      },
      colors: {
        brand: {
          primary: "#ED6A5A",
          hover: "#A480CF",
        },
      },
    },
  },
  plugins: [],
};

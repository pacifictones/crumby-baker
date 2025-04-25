// tailwind.config.js
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cabinSketch: ['"Cabin Sketch"', "serif"],
        chelseaMarket: ['"Chelsea Market"', "serif"],
        heading: ['"Alice"', "serif"],
        body: ['"Quattrocento Sans"', "serif"],
      },
      colors: {
        brand: {
          primary: "#ED6A5A",
          hover: "#A480CF",
        },
      },
      // ↓— here’s the new bit:
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.800"),
            fontFamily: theme("fontFamily.body").join(","),
            h1: { fontFamily: theme("fontFamily.heading").join(",") },
            h2: { fontFamily: theme("fontFamily.heading").join(",") },
            h3: { fontFamily: theme("fontFamily.heading").join(",") },
            p: {
              marginTop: theme("spacing.6"),
              marginBottom: theme("spacing.6"),
              textIndent: theme("spacing.6"),
            },
            "h2 + *": { marginTop: theme("spacing.4") },
            "h3 + *": { marginTop: theme("spacing.4") },
            // you can tweak any other tags here…
          },
        },
      }),
    },
  },
  plugins: [
    typography,
    // …other plugins
  ],
};

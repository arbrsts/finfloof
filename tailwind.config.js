/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        finfloof: {
          background: "#282828",
          primary: "#8DAA46", // Changed to green (previously apple-green)
          secondary: "#D89A23", // Moved harvest-gold to secondary
          accent: "#FF18C6",
          neutral: "#DBC94E",
          text: {
            primary: "#FFFFFF", // White for primary text
            secondary: "#E0E0E0", // Light gray for secondary text
            muted: "#A0A0A0", // Medium gray for less important text
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-react-aria-components")],
};

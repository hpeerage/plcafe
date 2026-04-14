/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#FDF9F3",
          primary: "#935D37",
          text: "#3E2723",
        },
      },
    },
  },
  plugins: [],
};

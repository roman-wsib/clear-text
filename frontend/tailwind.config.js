/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "btn-primary": "#1a1a1a",
        "purple-primary": "#646cff",
        "primary-red": "#f33030",
        "primary-skyblue": "#19a1e6",
        "primary-gray": "#808080",
      },
    },
  },
  plugins: [],
};

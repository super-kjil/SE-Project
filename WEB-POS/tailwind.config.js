/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '429px', // or any value you want
        xxs: '300px', // or any value you want
      },
    },
  },
  plugins: [],
}


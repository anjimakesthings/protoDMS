/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#fec301',
          'yellow-hover': '#fec91a',
          'yellow-light': '#fedf7e',
          sidebar: '#2d3748',
          'sidebar-dark': '#1a202c',
        },
      },
    },
  },
  plugins: [],
}

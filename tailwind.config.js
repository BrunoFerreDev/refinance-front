/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        reffinance: {
          navy: '#081342',      // Deep navy primary from screenshots
          'navy-dark': '#000B33', // Even darker navy for hover states
          canvas: '#F4F6FA',     // Soft gray-blue background
          border: '#E2E8F0',     // Default slate border
          accent: '#1E3A8A',     // Royal blue accent
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

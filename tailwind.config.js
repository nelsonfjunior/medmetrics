/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary-dark': '#1D4ED8',
        'primary-medium': '#3B82F6',
        'success': '#10B981',
        'light-gray': '#F3F4F6',
      },
      animation: {
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
      keyframes: {
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
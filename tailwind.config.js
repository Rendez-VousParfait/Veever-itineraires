/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2A6B9B',
          50: '#F0F7FC',
          100: '#D5E9F7',
          200: '#9AC8EA',
          300: '#5FA7DD',
          400: '#2A6B9B',
          500: '#1E4C6E',
          600: '#183D58',
          700: '#122E42',
          800: '#0C1F2C',
          900: '#060F16',
        },
        secondary: '#FF6B6B',
        'light-gray': '#F5F5F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
      height: {
        'hero': 'calc(100vh - 80px)',
      },
    },
  },
  plugins: [],
} 
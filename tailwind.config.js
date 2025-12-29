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
          50: '#e8eef4',
          100: '#d1dde9',
          200: '#a3bbd3',
          300: '#7599bd',
          400: '#4777a7',
          500: '#1a4f73',
          600: '#0f3651',
          700: '#0b1c2d', // Cor Base
          800: '#091826',
          900: '#07131f',
          950: '#050e18',
        },
        secondary: {
          50: '#fde8ea',
          100: '#fbd1d5',
          200: '#f7a3ab',
          300: '#f37581',
          400: '#ef4757',
          500: '#cc0015',
          600: '#960018', // Cor Base
          700: '#7a0013',
          800: '#5e000f',
          900: '#42000a',
          950: '#260006',
        },
        beige: {
          50: '#f9f6f2',
          100: '#f3ede5',
          200: '#e7dbcb',
          300: '#e0d0ba', // Cor Base
          400: '#d4be9f',
          500: '#c8ac84',
          600: '#b89a6a',
          700: '#9d8356',
          800: '#7d6945',
          900: '#5e4f34',
          950: '#3f3523',
        },
        // Mantendo compatibilidade com cores antigas
        burgundy: {
          50: '#fde8ea',
          100: '#fbd1d5',
          200: '#f7a3ab',
          300: '#f37581',
          400: '#ef4757',
          500: '#cc0015',
          600: '#960018',
          700: '#7a0013',
          800: '#5e000f',
          900: '#42000a',
          950: '#960018',
        },
        royal: {
          50: '#e8eef4',
          100: '#d1dde9',
          200: '#a3bbd3',
          300: '#7599bd',
          400: '#4777a7',
          500: '#1a4f73',
          600: '#0f3651',
          700: '#0b1c2d',
          800: '#091826',
          900: '#07131f',
          950: '#0b1c2d',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
        script: ['The Seasons', 'cursive'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}


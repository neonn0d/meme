/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        'scroll-y': {
          '0%, 100%': { objectPosition: 'top' },
          '50%': { objectPosition: 'bottom' }
        }
      },
      animation: {
        'scroll-y': 'scroll-y 15s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}

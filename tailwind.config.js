/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pangaia: ['Pangaia', 'system-ui', 'sans-serif','Helvetica'],
        helvetica: ['Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

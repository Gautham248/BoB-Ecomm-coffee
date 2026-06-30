/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pangaia: ['Pangaia', 'system-ui', 'sans-serif','Helvetica'],
        helvetica: ['Helvetica', 'sans-serif'],
        aviano:['Aviano','sans-serif'],
      },
      colors: {
        roast: {
          base: '#1a1814',
          surface: '#242018',
          card: '#2c2416',
          hover: '#3a2f1c',
          border: '#4a3d28',
          muted: '#6b604a',
          cream: '#f5f0e8',
          dust: '#d4c9b8',
        },
        copper: {
          DEFAULT: '#c89b4a',
          light: '#d4a853',
          dark: '#a07830',
          glow: '#e8c96a',
          surface: 'rgba(200,155,74,0.08)',
          border: 'rgba(200,155,74,0.25)',
          hover: 'rgba(200,155,74,0.15)',
        },
        amber: {
          DEFAULT: '#b8753e',
          light: '#cc8a50',
          pale: '#e6c89e',
        },
        rust: { DEFAULT: '#c5553a', muted: '#8b3a2a' },
        sage: { DEFAULT: '#7b8a6a', muted: '#5a6350' },
      },
    },
  },
  plugins: [],
};

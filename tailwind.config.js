/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(59, 130, 246, 0.15), 0 24px 80px -24px rgba(15, 23, 42, 0.8)',
      },
    },
  },
  plugins: [],
};

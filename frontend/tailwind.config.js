/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pm: {
          navy: '#0c2356',
          'navy-dark': '#071533',
          'navy-light': '#143888',
          blue: '#163b96',
          'blue-light': '#2563eb',
          'blue-soft': '#edf3ff',
          yellow: '#ffc700',
          'yellow-hover': '#eeb900',
          'yellow-light': '#fff9db',
          'yellow-accent': '#f59e0b',
          gray: '#64748b',
          bg: '#f1f5f9',
          card: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'pm-card': '0 4px 20px -2px rgba(12, 35, 86, 0.08)',
        'pm-glow': '0 0 25px -5px rgba(255, 199, 0, 0.4)',
      },
    },
  },
  plugins: [],
};


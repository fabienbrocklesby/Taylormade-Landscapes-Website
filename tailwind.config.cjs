const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Rubik', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        garden: {
          primary: '#184e21',
          'primary-content': '#f2f8ef',
          secondary: '#169c08',
          'secondary-content': '#f1fbec',
          accent: '#d5a900',
          'accent-content': '#ffffff',
          neutral: '#1f2a24',
          'neutral-content': '#f2f7f0',
          'base-100': '#f9fcf4',
          'base-200': '#edf3e6',
          'base-300': '#dfe8d4',
          'base-content': 'oklch(32% 0.035 152)',
          info: '#4b9fdc',
          'info-content': '#ffffff',
          success: '#2e7d32',
          'success-content': '#f3f8f2',
          warning: '#f1c40f',
          'warning-content': '#1d1500',
          error: '#c0392b',
          'error-content': '#fff5f2',
        },
      },
    ],
    darkTheme: 'garden',
  },
};

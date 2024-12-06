/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#212337',
        'green-title': '#749B3F',
        'image_bac': '#F4F6F6',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          xl: '1200px',
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
};

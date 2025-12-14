/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#D8CBB3',
        foreground: '#1a1410',
        card: {
          DEFAULT: '#e8dcc8',
          foreground: '#1a1410',
        },
        popover: {
          DEFAULT: '#e8dcc8',
          foreground: '#1a1410',
        },
        primary: {
          DEFAULT: '#750609',
          foreground: '#f5efe0',
        },
        secondary: {
          DEFAULT: '#06133c',
          foreground: '#f5efe0',
        },
        muted: {
          DEFAULT: '#c4b8a4',
          foreground: '#4a443a',
        },
        accent: {
          DEFAULT: '#4B5A3E',
          foreground: '#f5efe0',
        },
        destructive: {
          DEFAULT: '#750609',
          foreground: '#f5efe0',
        },
        border: '#b8a890',
        input: '#e8dcc8',
        ring: '#750609',
        'raven-black': '#1C1C1C',
        'ash-gray': '#A8A8A8',
        'weathered-beige': '#D8CBB3',
        'forest-moss': '#4B5A3E',
        'blood-red': '#750609',
        'midnight-blue': '#06133c',
        'parchment': '#e8dcc8',
        'ink-black': '#1a1410',
      },
      fontFamily: {
        'italiana': ['Italiana', 'serif'],
        'cinzel': ['Cinzel Decorative', 'serif'],
        'crimson': ['Crimson Text', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.25rem',
        sm: '0.125rem',
      },
      backgroundImage: {
        'engraving': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/t5tfc6i3_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_1.png')",
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
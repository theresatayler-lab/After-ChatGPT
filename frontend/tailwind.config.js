/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#120f14',
        foreground: '#f3f2e9',
        card: {
          DEFAULT: '#1c1821',
          foreground: '#f3f2e9',
        },
        popover: {
          DEFAULT: '#1c1821',
          foreground: '#f3f2e9',
        },
        primary: {
          DEFAULT: '#d4af37',
          foreground: '#120f14',
        },
        secondary: {
          DEFAULT: '#2d2436',
          foreground: '#d4af37',
        },
        muted: {
          DEFAULT: '#2a2430',
          foreground: '#9ca3af',
        },
        accent: {
          DEFAULT: '#c08e9b',
          foreground: '#120f14',
        },
        destructive: {
          DEFAULT: '#7f1d1d',
          foreground: '#f3f2e9',
        },
        border: '#383042',
        input: '#2a2430',
        ring: '#d4af37',
        'bloomsbury-rose': '#c08e9b',
        'artichoke-green': '#6b8e4a',
        'burnt-orange': '#cc5500',
        'deep-aubergine': '#3d1b24',
        'midnight-blue': '#1e1b2e',
        'gold-deco': '#d4af37',
      },
      fontFamily: {
        'italiana': ['Italiana', 'serif'],
        'cinzel': ['Cinzel Decorative', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.25rem',
        sm: '0.125rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
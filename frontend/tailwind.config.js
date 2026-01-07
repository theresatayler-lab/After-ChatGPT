/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Refined color scheme: Deep navy, vibrant crimson, antique gold (eye mandala inspired)
        background: '#0e1629',  // Deep midnight navy (slightly richer)
        foreground: '#e8e4dc',  // Warm off-white
        card: {
          DEFAULT: '#121d33',  // Slightly lighter navy
          foreground: '#e8e4dc',
        },
        popover: {
          DEFAULT: '#121d33',
          foreground: '#e8e4dc',
        },
        primary: {
          DEFAULT: '#b82330',  // Vibrant crimson red (more saturated)
          foreground: '#f5f3ef',
        },
        secondary: {
          DEFAULT: '#1a2d4d',  // Navy blue
          foreground: '#f5f3ef',
        },
        muted: {
          DEFAULT: '#1a3050',  // Muted navy
          foreground: '#9aabc0',
        },
        accent: {
          DEFAULT: '#d4a84b',  // Warm antique gold (richer)
          foreground: '#0e1629',
        },
        destructive: {
          DEFAULT: '#8b1a1a',
          foreground: '#f5f3ef',
        },
        border: '#2a4163',  // Blue-tinted border
        input: '#121d33',
        ring: '#b82330',
        // Legacy colors
        'raven-black': '#1C1C1C',
        'ash-gray': '#A8A8A8',
        'weathered-beige': '#D8CBB3',
        'forest-moss': '#4B5A3E',
        'blood-red': '#b82330',
        'midnight-blue': '#0e1629',
        'deep-blue': '#1a2d4d',
        'parchment': '#e8e4dc',
        'ink-black': '#0e1629',
        // Enhanced color palette
        'crimson': '#b82330',
        'crimson-bright': '#d42a3a',
        'crimson-deep': '#8a1a24',
        'gold': '#d4a84b',
        'gold-light': '#e6c068',
        'gold-dark': '#a88535',
        'champagne': '#d4a84b',
        'champagne-light': '#e6c068',
        'navy-dark': '#0e1629',
        'navy-mid': '#121d33',
        'navy-light': '#1a2d4d',
        'navy-accent': '#2a4163',
        'silver-mist': '#9aabc0',
        'blue-grey': '#5c7a9e',
        'cream': '#f5f0e6',
      },
      fontFamily: {
        'italiana': ['Italiana', 'serif'],
        'cinzel': ['Cinzel Decorative', 'serif'],
        'crimson': ['Crimson Text', 'serif'],
        'playfair': ['Playfair Display', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.25rem',
        sm: '0.125rem',
      },
      backgroundImage: {
        'engraving-landscape': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/t5tfc6i3_COuld_we_creatre_more_of_these_--profile_bsfwy2d_--v_7_d08b86ee-a6ac-4cf3-a814-1344b45b3380_1.png')",
        'engraving-coral': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/8imph0v6_wherethecrowlands_Could_you_create_some_good_background_style_f734269c-7d4f-4368-8a41-ddf55a00a162_0.png')",
        'engraving-texture-1': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/0pf521mf_wherethecrowlands_Could_you_create_some_good_background_style_f734269c-7d4f-4368-8a41-ddf55a00a162_1.png')",
        'engraving-texture-2': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/8ywnuf0u_wherethecrowlands_Could_you_create_some_good_background_style_f734269c-7d4f-4368-8a41-ddf55a00a162_2.png')",
        'engraving-texture-3': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/efxqeoam_wherethecrowlands_Could_you_create_some_good_background_style_f734269c-7d4f-4368-8a41-ddf55a00a162_3.png')",
        'engraving-texture-4': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/oweu8jv6_wherethecrowlands_lets_create_more_background_images_for_an_a_71f68355-bc18-47e7-9913-17746665f787_0.png')",
        'engraving-texture-5': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/kot7stw7_wherethecrowlands_lets_create_more_background_images_for_an_a_71f68355-bc18-47e7-9913-17746665f787_2.png')",
        'engraving-texture-6': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/35ceuwyl_wherethecrowlands_lets_create_more_background_images_for_an_a_525149ba-7cb5-44f2-8135-98af7078a114_0.png')",
        'engraving-texture-7': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/4iovcjke_wherethecrowlands_lets_create_more_background_images_for_an_a_525149ba-7cb5-44f2-8135-98af7078a114_1.png')",
        'engraving-brand': "url('https://customer-assets.emergentagent.com/job_mystic-circle-2/artifacts/ozjenzg5_wherethecrowlands_Now_can_we_create_a_full_brand_from_this_wi_7e7051a9-9ee4-45aa-b341-887fd0d98a91_0.png')",
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
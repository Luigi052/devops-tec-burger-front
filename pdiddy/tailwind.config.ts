import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a6',
          400: '#f87171',
          500: '#D53132', // Persian Red - main brand color
          600: '#be2b2c',
          700: '#a72526',
          800: '#8f1f20',
          900: '#78191a',
        },
        brown: {
          50: '#f5f3f0',
          100: '#e6e1dc',
          200: '#cdc3b9',
          300: '#b4a596',
          400: '#9b8773',
          500: '#281508', // Zinnwaldite Brown - dark accent
          600: '#231206',
          700: '#1e0f05',
          800: '#190c04',
          900: '#140903',
        },
        cream: {
          50: '#ffffff',
          100: '#fffcfa',
          200: '#FFF5EC', // Seashell - background
          300: '#fff0e3',
          400: '#ffe8d5',
          500: '#ffe0c7',
          600: '#e6cab3',
          700: '#ccb49f',
          800: '#b39e8b',
          900: '#998877',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

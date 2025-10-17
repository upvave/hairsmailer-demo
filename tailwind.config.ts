import { heroui } from '@heroui/react';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      borderWidth: {
        medium: '1px',
      },
      colors: {
        primary: {
          50: '#e9e2f5',
          100: '#d5c8ed',
          200: '#c1aee4',
          300: '#ae94dc',
          400: '#9a7bd3',
          500: '#8761cb',
          600: '#7347c3',
          700: '#5c37a0',
          800: '#462a7a',
          900: '#311d55',
          DEFAULT: '#6F42C1',
        },
      },
    },
  },
  plugins: [
    heroui(),
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;

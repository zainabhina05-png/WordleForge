import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Structured palette
        putty: '#c4c3b6',
        ink: '#000000',
        bone: '#e7e5e4',
        chalk: '#ebebeb',
        vellum: '#dfdcd5',
        graphite: '#595855',
        ash: '#808080',
        paper: '#ffffff',
        // shadcn compatibility — map to Structured palette
        border: 'var(--color-vellum)',
        input: 'var(--color-vellum)',
        ring: 'var(--color-ink)',
        background: 'var(--color-putty)',
        foreground: 'var(--color-ink)',
        primary: {
          DEFAULT: 'var(--color-ink)',
          foreground: 'var(--color-paper)',
        },
        secondary: {
          DEFAULT: 'var(--color-bone)',
          foreground: 'var(--color-ink)',
        },
        destructive: {
          DEFAULT: '#7a1a1a',
          foreground: 'var(--color-paper)',
        },
        muted: {
          DEFAULT: 'var(--color-chalk)',
          foreground: 'var(--color-graphite)',
        },
        accent: {
          DEFAULT: 'var(--color-bone)',
          foreground: 'var(--color-ink)',
        },
        popover: {
          DEFAULT: 'var(--color-bone)',
          foreground: 'var(--color-ink)',
        },
        card: {
          DEFAULT: 'var(--color-bone)',
          foreground: 'var(--color-ink)',
        },
      },
      borderRadius: {
        // Structured radii
        cards: '9px',
        buttons: '28.8px',
        links: '2px',
        lg: '9px',
        md: '6px',
        sm: '4px',
      },
      fontFamily: {
        // Playfair Display as Davinci substitute
        serif: ['var(--font-davinci)', 'Playfair Display', 'Georgia', 'serif'],
        davinci: ['var(--font-davinci)', 'Playfair Display', 'Georgia', 'serif'],
        // Inter as Helvetica Now substitute
        sans: ['var(--font-helvetica-now)', 'Inter', 'system-ui', 'sans-serif'],
        'helvetica-now': ['var(--font-helvetica-now)', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        display: '-3.37px',
        'heading-lg': '-0.47px',
        heading: '-0.215px',
        'heading-sm': '-0.13px',
        subheading: '-0.11px',
      },
      lineHeight: {
        display: '0.84',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        flip: {
          '0%': { transform: 'rotateX(0deg)' },
          '50%': { transform: 'rotateX(90deg)' },
          '100%': { transform: 'rotateX(0deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        flip: 'flip 0.6s ease-in-out',
        shake: 'shake 0.4s ease-in-out',
        bounce: 'bounce 0.5s ease-in-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

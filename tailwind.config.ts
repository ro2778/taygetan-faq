import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          bg: '#060612',
          surface: '#0d0d1a',
          card: '#12122a',
          border: '#1a1a3e',
          accent: '#d4713a',
          'accent-glow': 'rgba(212,113,58,0.15)',
          gold: '#c4a35a',
          text: '#e8e0d0',
          'text-dim': 'rgba(232,224,208,0.6)',
          'text-faint': 'rgba(232,224,208,0.35)',
        },
      },
      fontFamily: {
        serif: ['Crimson Pro', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        breathe: 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': {
            boxShadow: '0 0 30px rgba(212,113,58,0.15), 0 0 80px rgba(212,113,58,0.05)',
          },
          '50%': {
            boxShadow: '0 0 45px rgba(212,113,58,0.28), 0 0 100px rgba(212,113,58,0.08)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;

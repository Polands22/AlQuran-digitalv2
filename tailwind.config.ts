import type { Config } from 'tailwindcss';
const c = (v: string) => `var(--${v})`;
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { bg: c('bg'), card: c('card'), ink: c('ink'), mute: c('mute'), em: c('em'), gold: c('gold'), line: c('line'), soft: c('soft') },
      fontFamily: {
        sans: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
        arab: ['"Amiri Quran"', 'serif'],
      },
    },
  },
} satisfies Config;

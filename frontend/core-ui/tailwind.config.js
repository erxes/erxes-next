const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { fontFamily } = require('tailwindcss/defaultTheme');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app,modules}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-sans)', ...fontFamily.sans],
      mono: ['var(--font-mono)', ...fontFamily.mono],
    },
    fontSize: {
      xs: ['0.75rem', '14px'],
      sm: ['13px', '1rem'],
      base: ['14px', '18px'],
      lg: ['1rem', '1.125rem'],
      xl: ['20px', '20px'],
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        scroll: 'hsl(var(--scroll))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        sidebar: 'hsl(var(--sidebar-background))',
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        cell: '34px',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
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
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      boxShadow: {
        input:
          '0 2px 2px hsla(var(--shadow)), 0 1px 1px hsla(var(--shadow)), 0 0 0 1px hsla(var(--shadow))',
        'command-bar':
          'rgba(0, 0, 0, 0.12) 2px 4px 16px, rgba(0, 0, 0, 0.04) 0 2px 4px',
        'button-primary':
          'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 4px hsla(var(--shadow)), 0 2px 2px hsla(var(--shadow)), 0 1px 1px hsla(var(--shadow))',
        'button-outline':
          '0 4px 4px hsla(var(--shadow)), 0 2px 2px hsla(var(--shadow)), 0 1px 1px hsla(var(--shadow)), 0 0 0 1px hsla(var(--shadow))',
        'sidebar-inset':
          '0 0 0 1px hsla(var(--shadow)), 0 1px 1px hsla(var(--shadow)), 0 2px 2px hsla(var(--shadow)), 0 4px 4px hsla(var(--shadow))',
        xs: '0 0 0 1px hsla(var(--shadow)), 0 1px 1px hsla(var(--shadow)), 0 2px 2px hsla(var(--shadow))',
        sm: '0 0 0 1px hsla(var(--shadow)), 0 1px 1px hsla(var(--shadow)), 0 2px 2px hsla(var(--shadow)), 0 4px 4px hsla(var(--shadow))',
        lg: '0 0 0 1px hsla(var(--shadow)), 0 1px 1px hsla(var(--shadow)), 0 2px 2px hsla(var(--shadow)), 0 4px 4px hsla(var(--shadow)), 0 8px 8px hsla(var(--shadow))',
        xl: '0 0 0 1px hsla(var(--shadow)), 0 1px 1px hsla(var(--shadow)), 0 2px 2px hsla(var(--shadow)), 0 4px 4px hsla(var(--shadow)), 0 8px 8px hsla(var(--shadow)), 0 16px 16px hsla(var(--shadow))',
      },
      ringColor: {
        DEFAULT: 'hsl(var(--ring))',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

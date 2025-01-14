const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { fontFamily } = require('tailwindcss/defaultTheme');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-sans)', ...fontFamily.sans],
      mono: ['var(--font-mono)', ...fontFamily.mono],
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
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        system: {
          DEFAULT: 'hsl(var(--system))',
          foreground: 'hsl(var(--system-foreground))',
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
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        radix: {
          DEFAULT: 'hsl(var(--radix-default))',
          foreground: 'hsl(var(--radix-foreground))',
          tomato: 'hsl(var(--radix-tomato))',
          'tomato-foreground': 'hsl(var(--radix-tomato-foreground))',
          red: 'hsl(var(--radix-red))',
          'red-foreground': 'hsl(var(--radix-red-foreground))',
          ruby: 'hsl(var(--radix-ruby))',
          'ruby-foreground': 'hsl(var(--radix-ruby-foreground))',
          crimson: 'hsl(var(--radix-crimson))',
          'crimson-foreground': 'hsl(var(--radix-crimson-foreground))',
          pink: 'hsl(var(--radix-pink))',
          'pink-foreground': 'hsl(var(--radix-pink-foreground))',
          plum: 'hsl(var(--radix-plum))',
          'plum-foreground': 'hsl(var(--radix-plum-foreground))',
          purple: 'hsl(var(--radix-purple))',
          'purple-foreground': 'hsl(var(--radix-purple-foreground))',
          violet: 'hsl(var(--radix-violet))',
          'violet-foreground': 'hsl(var(--radix-violet-foreground))',
          iris: 'hsl(var(--radix-iris))',
          'iris-foreground': 'hsl(var(--radix-iris-foreground))',
          indigo: 'hsl(var(--radix-indigo))',
          'indigo-foreground': 'hsl(var(--radix-indigo-foreground))',
          blue: 'hsl(var(--radix-blue))',
          'blue-foreground': 'hsl(var(--radix-blue-foreground))',
          cyan: 'hsl(var(--radix-cyan))',
          'cyan-foreground': 'hsl(var(--radix-cyan-foreground))',
          teal: 'hsl(var(--radix-teal))',
          'teal-foreground': 'hsl(var(--radix-teal-foreground))',
          jade: 'hsl(var(--radix-jade))',
          'jade-foreground': 'hsl(var(--radix-jade-foreground))',
          green: 'hsl(var(--radix-green))',
          'green-foreground': 'hsl(var(--radix-green-foreground))',
          grass: 'hsl(var(--radix-grass))',
          'grass-foreground': 'hsl(var(--radix-grass-foreground))',
          bronze: 'hsl(var(--radix-bronze))',
          'bronze-foreground': 'hsl(var(--radix-bronze-foreground))',
          gold: 'hsl(var(--radix-gold))',
          'gold-foreground': 'hsl(var(--radix-gold-foreground))',
          brown: 'hsl(var(--radix-brown))',
          'brown-foreground': 'hsl(var(--radix-brown-foreground))',
          orange: 'hsl(var(--radix-orange))',
          'orange-foreground': 'hsl(var(--radix-orange-foreground))',
          amber: 'hsl(var(--radix-amber))',
          'amber-foreground': 'hsl(var(--radix-amber-foreground))',
          yellow: 'hsl(var(--radix-yellow))',
          'yellow-foreground': 'hsl(var(--radix-yellow-foreground))',
          lime: 'hsl(var(--radix-lime))',
          'lime-foreground': 'hsl(var(--radix-lime-foreground))',
          mint: 'hsl(var(--radix-mint))',
          'mint-foreground': 'hsl(var(--radix-mint-foreground))',
          sky: 'hsl(var(--radix-sky))',
          'sky-foreground': 'hsl(var(--radix-sky-foreground))',
        },
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
        'input': 
          '0px 4px 4px 0px rgba(0, 0, 0, 0.05), 0px 2px 2px 0px rgba(0, 0, 0, 0.05), 0px 1px 1px 0px rgba(0, 0, 0, 0.05), 0px 0px 3px 2px rgba(0, 0, 0, 0.1)',
        'command-bar':
          'rgba(0, 0, 0, 0.12) 2px 4px 16px 0px, rgba(0, 0, 0, 0.04) 0px 2px 4px 0px',
        'button-primary':
          'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 4px rgba(0, 0, 0, 0.05), 0 2px 2px rgba(0, 0, 0, 0.05), 0 1px 1px rgba(0, 0, 0, 0.05)',
        'button-outline':
          '0px 4px 4px 0px rgba(0, 0, 0, 0.05), 0px 2px 2px 0px rgba(0, 0, 0, 0.05), 0px 1px 1px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
        'sidebar-inset':
          '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.05), 0px 2px 2px rgba(0, 0, 0, 0.05), 0px 4px 4px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

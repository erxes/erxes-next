const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['var(--font-sans)', ...fontFamily.sans],
      mono: ['var(--font-mono)', ...fontFamily.mono],
    },
    fontSize: {
      '2xs': ['0.625rem', '0.75rem'], //12px
      xs: ['0.75rem', '0.875rem'], //13px
      sm: ['0.875rem', '1rem'], //14px
      base: ['1rem', '1.125rem'], //16px
      lg: ['1.125rem', '1.25rem'], //18px
      xl: ['1.25rem', '1.5rem'], //20px
      '2xl': ['1.5rem', '1.75rem'], //24px
    },
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
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
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        info: 'hsl(var(--info))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
          background: 'hsl(var(--muted-background))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        sidebar: 'hsl(var(--sidebar-background))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        card: 'hsl(var(--card))',
        // Dynamic widget colors that can be updated via uiOptions
        'widget-primary': 'hsl(var(--widget-primary-color))',
        'widget-text': 'hsl(var(--widget-text-color))',
        'widget-bg': {
          DEFAULT: 'hsl(var(--widget-primary-color))',
          wallpaper: 'var(--widget-wallpaper)',
        },
        'widget-logo': 'var(--widget-logo)',
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        cell: '33px',
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
        focus:
          '0px 0px 0px 4px rgba(79, 70, 229, 0.25), 0px 0px 0px 1px hsl(var(--primary))',
        subtle: '0px 0px 0px 1px hsla(var(--primary))',
        destructive: '0px 0px 0px 1px hsla(var(--destructive))',
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

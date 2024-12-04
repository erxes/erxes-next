import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeColors = [
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'jade',
  'green',
  'grass',
  'bronze',
  'gold',
  'brown',
  'orange',
  'amber',
  'yellow',
  'lime',
  'mint',
  'sky',
] as const;
type BadgeColor = (typeof badgeColors)[number];

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent',
  {
    variants: {
      color: {
        tomato: 'bg-radix-tomato text-radix-tomato-foreground',
        red: 'bg-radix-red text-radix-red-foreground',
        ruby: 'bg-radix-ruby text-radix-ruby-foreground',
        crimson: 'bg-radix-crimson text-radix-crimson-foreground',
        pink: 'bg-radix-pink text-radix-pink-foreground',
        plum: 'bg-radix-plum text-radix-plum-foreground',
        purple: 'bg-radix-purple text-radix-purple-foreground',
        violet: 'bg-radix-violet text-radix-violet-foreground',
        iris: 'bg-radix-iris text-radix-iris-foreground',
        indigo: 'bg-radix-indigo text-radix-indigo-foreground',
        blue: 'bg-radix-blue text-radix-blue-foreground',
        cyan: 'bg-radix-cyan text-radix-cyan-foreground',
        teal: 'bg-radix-teal text-radix-teal-foreground',
        jade: 'bg-radix-jade text-radix-jade-foreground',
        green: 'bg-radix-green text-radix-green-foreground',
        grass: 'bg-radix-grass text-radix-grass-foreground',
        bronze: 'bg-radix-bronze text-radix-bronze-foreground',
        gold: 'bg-radix-gold text-radix-gold-foreground',
        brown: 'bg-radix-brown text-radix-brown-foreground',
        orange: 'bg-radix-orange text-radix-orange-foreground',
        amber: 'bg-radix-amber text-radix-amber-foreground',
        yellow: 'bg-radix-yellow text-radix-yellow-foreground',
        lime: 'bg-radix-lime text-radix-lime-foreground',
        mint: 'bg-radix-mint text-radix-mint-foreground',
        sky: 'bg-radix-sky text-radix-sky-foreground',
      },
    },
    defaultVariants: {
      color: undefined,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  color?: BadgeColor;
}

function Badge({ className, color, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ color }), className)} {...props} />;
}

export { Badge, badgeVariants, badgeColors };

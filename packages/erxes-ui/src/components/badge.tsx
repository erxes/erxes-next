import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeColors = ['red', 'green', 'yellow', 'blue', 'purple'] as const;
type BadgeColor = (typeof badgeColors)[number];

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow',
        outline: 'text-foreground',
      },
      color: {
        red: 'bg-red-500 text-white',
        green: 'bg-green-500 text-white',
        yellow: 'bg-yellow-500 text-white',
        blue: 'bg-blue-500 text-white',
        purple: 'bg-purple-500 text-white',
      },
    },
    compoundVariants: [
      {
        variant: 'secondary',
        color: 'red',
        className: 'bg-red-100 text-red-800',
      },
      {
        variant: 'secondary',
        color: 'green',
        className: 'bg-green-100 text-green-800',
      },
      {
        variant: 'secondary',
        color: 'yellow',
        className: 'bg-yellow-100 text-yellow-800',
      },
      {
        variant: 'secondary',
        color: 'blue',
        className: 'bg-blue-100 text-blue-800',
      },
      {
        variant: 'secondary',
        color: 'purple',
        className: 'bg-purple-100 text-purple-800',
      },
    ],
    defaultVariants: {
      variant: 'default',
      color: undefined,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  color?: BadgeColor;
}

function Badge({ className, variant, color, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, color }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants, badgeColors };

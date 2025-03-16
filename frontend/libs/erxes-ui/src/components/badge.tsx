import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';
import { stringToHslColor } from '../utils/colors';

export const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent whitespace-nowrap font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        muted: 'bg-muted text-foreground',
        ghost: 'text-inherit',
      },
      size: {
        sm: 'h-6 text-xs',
        md: 'h-7 text-sm',
        lg: 'h-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  colorSeed?: string;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, colorSeed, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
        style={
          colorSeed
            ? {
                ...props.style,
                color: stringToHslColor(colorSeed, 75, 20),
                backgroundColor: stringToHslColor(colorSeed, 75, 90),
              }
            : props.style
        }
      />
    );
  },
);

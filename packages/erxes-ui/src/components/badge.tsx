import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { twColorClassNames, Color, colors, stringToHslColor } from './colors';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 h-5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent whitespace-nowrap ',
  {
    variants: {
      color: twColorClassNames,
    },
    defaultVariants: {
      color: undefined,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  color?: Color;
  colorSeed?: string;
}

function Badge({ className, color, colorSeed, ...props }: BadgeProps) {
  const seed = colors.includes(color as Color) ? color : colorSeed;
  return (
    <div
      className={cn(badgeVariants({ color }), className)}
      {...props}
      style={
        seed
          ? {
              ...props.style,
              color: stringToHslColor(seed, 75, 20),
              backgroundColor: stringToHslColor(seed, 75, 90),
            }
          : props.style
      }
    />
  );
}

export { Badge, badgeVariants };

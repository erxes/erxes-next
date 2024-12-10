import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { twColorClassNames, Color } from './colors';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent',
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
}

function Badge({ className, color, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ color }), className)} {...props} />;
}

export { Badge, badgeVariants };

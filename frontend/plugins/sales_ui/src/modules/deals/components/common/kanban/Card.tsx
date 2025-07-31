// @/components/ui/card.tsx
import * as React from 'react';

import { cn } from 'erxes-ui';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { loading?: boolean }
>(({ className, loading, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-white text-black shadow-sm',
      loading && 'animate-pulse',
      className,
    )}
    {...props}
  />
));

Card.displayName = 'Card';

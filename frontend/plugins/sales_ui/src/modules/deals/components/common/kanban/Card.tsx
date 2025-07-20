// @/components/ui/card.tsx
import * as React from 'react';

import { cn } from 'erxes-ui';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('rounded-lg border bg-white text-black shadow-sm', className)}
    {...props}
  />
));

Card.displayName = 'Card';

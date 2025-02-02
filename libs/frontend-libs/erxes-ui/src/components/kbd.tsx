import React from 'react';

import { cn } from '../lib/utils';

export const Kbd = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'kbd'>
>(({ children, className, ...props }, ref) => {
  return (
    <kbd
      ref={ref}
      className={cn('ml-auto text-xs tracking-widest opacity-60 ', className)}
      {...props}
    >
      {children}
    </kbd>
  );
});
Kbd.displayName = 'Kbd';

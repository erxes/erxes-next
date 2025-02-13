import * as React from 'react';

import { cn } from 'erxes-ui/lib';

/**
 * This component is based on the `kbd` element and supports all of its props
 */
const Kbd = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'kbd'>
>(({ children, className, ...props }, ref) => {
  return (
    <kbd
      {...props}
      ref={ref}
      className={cn(
        'bg-background/10 text-inherit opacity-70 border-background/20 inline-flex h-5 w-fit min-w-[20px] items-center justify-center rounded-md border px-1',
        'text-xs',
        className,
      )}
    >
      {children}
    </kbd>
  );
});
Kbd.displayName = 'Kbd';

export { Kbd };

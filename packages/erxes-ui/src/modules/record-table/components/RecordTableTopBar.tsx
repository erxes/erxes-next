import { cn } from 'erxes-ui/lib';
import React from 'react';

export const RecordTableTopBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        'flex items-start justify-between h-9 flex-none',
        className
      )}
    >
      {children}
    </div>
  );
});

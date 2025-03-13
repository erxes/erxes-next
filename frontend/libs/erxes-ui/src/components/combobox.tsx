import React from 'react';
import { Button } from './button';
import { cn } from '../lib/utils';
import { IconChevronDown } from '@tabler/icons-react';
export const Combobox = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & {
    hideChevron?: boolean;
  }
>(({ className, children, hideChevron = false, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      role="combobox"
      variant="outline"
      {...props}
      type="button"
      className={cn(
        'truncate h-8 rounded px-3 shadow-xs focus-visible:shadow-focus focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:outline-transparent justify-between overflow-hidden',
        props.size === 'lg' && 'gap-2',
        className,
      )}
    >
      {children}
      {!hideChevron && (
        <IconChevronDown
          size={16}
          strokeWidth={2}
          className="flex-none opacity-50"
          aria-hidden="true"
        />
      )}
    </Button>
  );
});

Combobox.displayName = 'Combobox';

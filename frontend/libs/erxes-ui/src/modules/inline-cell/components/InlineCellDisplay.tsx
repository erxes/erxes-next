import { cn } from 'erxes-ui/lib/utils';
import React from 'react';
import { Button } from 'erxes-ui/components';
import { PopoverTrigger } from '@radix-ui/react-popover';

import { Combobox } from 'erxes-ui/components/combobox';
export const InlineCellDisplay = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <PopoverTrigger asChild>
      <Combobox.TriggerBase
        ref={ref}
        variant="ghost"
        {...props}
        hideChevron
        className={cn(
          'h-full w-full justify-start font-normal rounded-none',
          className,
        )}
      />
    </PopoverTrigger>
  );
});

InlineCellDisplay.displayName = 'InlineCellDisplay';

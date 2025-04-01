import { cn } from 'erxes-ui/lib/utils';
import React from 'react';
import { useInlineCell } from 'erxes-ui/modules/inline-cell/hooks/useInlineCell';
import { Button } from 'erxes-ui/components';
import { PopoverTrigger } from '@radix-ui/react-popover';

import { Combobox } from 'erxes-ui/components/combobox';
export const InlineCellDisplay = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { handleOpenEditMode } = useInlineCell();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    handleOpenEditMode?.();
    onClick?.(e);
  };

  return (
    <PopoverTrigger asChild>
      <Combobox.Trigger
        ref={ref}
        variant="ghost"
        {...props}
        onClick={handleClick}
        hideChevron
        className={cn('h-full w-full justify-start font-normal', className)}
      />
    </PopoverTrigger>
  );
});

InlineCellDisplay.displayName = 'InlineCellDisplay';

import { cn } from 'erxes-ui/lib/utils';
import React from 'react';
import { useInlineCell } from 'erxes-ui/modules/inline-cell/hooks/useInlineCell';
import { Button } from 'erxes-ui/components';
import { PopoverTrigger } from '@radix-ui/react-popover';

export const InlineCellDisplay = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & {
    className?: string;
  }
>(({ className, onClick, ...props }, ref) => {
  const { handleOpenEditMode } = useInlineCell();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    handleOpenEditMode();
    onClick?.(e);
  };

  return (
    <PopoverTrigger asChild>
      <Button
        ref={ref}
        variant="ghost"
        tabIndex={-1}
        {...props}
        onClick={handleClick}
        className={cn('h-full w-full justify-start font-normal', className)}
      />
    </PopoverTrigger>
  );
});

InlineCellDisplay.displayName = 'InlineCellDisplay';

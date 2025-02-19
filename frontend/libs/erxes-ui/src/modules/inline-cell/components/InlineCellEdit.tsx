import React from 'react';
import { PopoverContent, PopoverPortal } from '@radix-ui/react-popover';
import { cn } from 'erxes-ui/lib/utils';
import { useInlineCell } from 'erxes-ui/modules/inline-cell/hooks/useInlineCell';


export const InlineCellEdit = React.forwardRef(
  ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => {
    const { handleEscape, handleCancel } = useInlineCell();

    return (
      <PopoverPortal>
        <PopoverContent
          onEscapeKeyDown={handleEscape}
          onPointerDownOutside={handleCancel}
          align="start"
          sideOffset={-32}
          className={cn(
            'z-50 min-w-56 bg-background p-0 shadow-lg',
            'focus-visible:ring-0 focus-visible:outline-none  focus-visible:border-0',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 rounded-sm',
            className,
          )}
        >
          {children}
        </PopoverContent>
      </PopoverPortal>
    );
  },
);

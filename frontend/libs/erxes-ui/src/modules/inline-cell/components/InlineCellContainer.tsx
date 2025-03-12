import React from 'react';
import { cn } from 'erxes-ui/lib';
import { Popover } from 'erxes-ui/components';
import { useInlineCell } from 'erxes-ui/modules/inline-cell/hooks/useInlineCell';
import { useAtomValue } from 'jotai';
import { InlineCellIsInEditModeFamilyState } from 'erxes-ui/modules/inline-cell/states/InlineCellIsInEditModeFamilyState';

export const InlineCellContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { id, handleCancel } = useInlineCell();
  const isInEditMode = useAtomValue(InlineCellIsInEditModeFamilyState(id));
  return (
    <Popover
      open={isInEditMode}
      onOpenChange={(open) => {
        if (!open) {
          handleCancel();
        }
      }}
      modal
    >
      <div
        ref={ref}
        className={cn(
          'w-full inline-flex items-stretch relative h-8 cursor-pointer box-border',
          className,
        )}
        {...props}
      />
    </Popover>
  );
});

InlineCellContainer.displayName = 'InlineCellContainer';

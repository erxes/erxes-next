import { Button, Popover } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';
import React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { usePreviousHotkeyScope } from 'erxes-ui/modules/hotkey/hooks/usePreviousHotkeyScope';

export const RecordTablePopover = ({
  scope,
  onOpenChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> & {
  scope?: string;
}) => {
  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();

  return (
    <PopoverPrimitive.Root
      modal
      {...props}
      onOpenChange={(open) => {
        onOpenChange?.(open);
        open
          ? setHotkeyScopeAndMemorizePreviousScope(scope + '.Popover')
          : goBackToPreviousHotkeyScope();
      }}
    />
  );
};
RecordTablePopover.displayName = 'RecordTablePopover';

export const RecordTableCellTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ children, className, ...props }, ref) => {
  return (
    <Popover.Trigger asChild>
      <Button
        variant="ghost"
        className={cn(
          'h-8 px-2 w-full justify-start text-left font-normal rounded-none focus-visible:relative focus-visible:z-10 focus-visible:outline-transparent focus-visible:shadow-subtle overflow-hidden',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    </Popover.Trigger>
  );
});

export const RecordTableCellContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <Popover.Content
      align="start"
      sideOffset={-32}
      disableTransition
      className={cn(
        'p-0 w-[--radix-popper-anchor-width] min-w-56 rounded',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

RecordTableCellTrigger.displayName = 'RecordTableCellTrigger';

export const RecordTableCellDisplay = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, children, ...props }, ref) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        'h-8 px-2 w-full justify-start text-left font-normal rounded-none',
        className,
      )}
      ref={ref}
      asChild
      tabIndex={-1}
      {...props}
    >
      <div>{children}</div>
    </Button>
  );
});

RecordTableCellDisplay.displayName = 'RecordTableCellDisplay';

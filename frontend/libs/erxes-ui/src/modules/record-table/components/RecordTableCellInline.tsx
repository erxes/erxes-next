import { Button, Popover } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';
import React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { usePreviousHotkeyScope } from 'erxes-ui/modules/hotkey/hooks/usePreviousHotkeyScope';
import { Key } from 'erxes-ui/types';
import { useScopedHotkeys } from 'erxes-ui/modules/hotkey';

export const RecordTablePopover = ({
  scope,
  onOpenChange,
  open,
  closeOnEnter,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> & {
  scope?: string;
  closeOnEnter?: boolean;
}) => {
  const [_open, _setOpen] = React.useState(false);
  const {
    setHotkeyScopeAndMemorizePreviousScope,
    goBackToPreviousHotkeyScope,
  } = usePreviousHotkeyScope();

  useScopedHotkeys(
    Key.Enter,
    () => {
      if (!scope || !closeOnEnter) {
        return;
      }
      onOpenChange?.(false);
      _setOpen(false);
      goBackToPreviousHotkeyScope();
    },
    scope + '.Popover',
    [],
  );

  return (
    <PopoverPrimitive.Root
      modal
      {...props}
      open={open ?? _open}
      onOpenChange={(open) => {
        onOpenChange?.(open);
        _setOpen(open);
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

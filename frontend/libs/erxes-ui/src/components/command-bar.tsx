'use client';

import * as React from 'react';

import * as Popover from '@radix-ui/react-popover';

import { Kbd } from './kbd';
import { cn } from '../lib/utils';
import { Button } from './button';
import { IconX } from '@tabler/icons-react';

type CommandBarProps = React.PropsWithChildren<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  disableAutoFocus?: boolean;
}>;

const Root = ({
  open = false,
  onOpenChange,
  defaultOpen = false,
  disableAutoFocus = true,
  children,
}: CommandBarProps) => {
  return (
    <Popover.Root
      open={open}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
    >
      <Popover.Trigger
        className={cn(
          'fixed bottom-10 left-1/2 h-px w-px -translate-x-1/2 z-50',
        )}
      />

      <Popover.Content
        side="top"
        sideOffset={0}
        onOpenAutoFocus={(e) => {
          if (disableAutoFocus) {
            e.preventDefault();
          }
        }}
        className={cn(
          'z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2',
        )}
      >
        {children}
      </Popover.Content>
    </Popover.Root>
  );
};
Root.displayName = 'CommandBar';

const Value = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    onClose?: () => void;
  }
>(({ className, onClose, children, ...props }, ref) => {
  return (
    <div className="flex items-center -space-x-px">
      <Button
        variant="outline"
        className={cn(
          'shadow-none border-dashed border',
          onClose && 'rounded-r-none',
          className,
        )}
        asChild
      >
        <div ref={ref} {...props}>
          {children}
        </div>
      </Button>
      {onClose && (
        <Button
          variant="outline"
          className="shadow-none border-dashed border rounded-l-none"
          onClick={onClose}
        >
          <IconX />
        </Button>
      )}
    </div>
  );
});
Value.displayName = 'CommandBar.Value';

const Bar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'relative flex items-center overflow-hidden rounded-lg p-1 shadow-focus bg-background gap-x-1',
        className,
      )}
      {...props}
    />
  );
});
Bar.displayName = 'CommandBar.Bar';

const CommandBar = Object.assign(Root, {
  Value,
  Bar,
});

export { CommandBar };

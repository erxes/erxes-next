import * as React from 'react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '../lib/utils';

const TooltipRoot = ({
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) => (
  <TooltipPrimitive.Root delayDuration={0} {...props} />
);

TooltipRoot.displayName = TooltipPrimitive.Root.displayName;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-foreground px-3 py-1.5 text-xs text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    >
      {children}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export const Tooltip = Object.assign(TooltipPrimitive.Root, {
  Provider: TooltipPrimitive.Provider,
  Trigger: TooltipPrimitive.Trigger,
  Content: TooltipContent,
});

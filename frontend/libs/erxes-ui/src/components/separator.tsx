'use client';

import * as React from 'react';

import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '../lib/utils';

const SeparatorRoot = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  ),
);

SeparatorRoot.displayName = SeparatorPrimitive.Root.displayName;

const SeparatorInline = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn('inline-block bg-border w-0.5 h-3 rounded-lg', className)}
      {...props}
    />
  );
});

SeparatorInline.displayName = 'Separator.Inline';

export const Separator = Object.assign(SeparatorRoot, {
  Inline: SeparatorInline,
});

import * as React from 'react';

import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from 'erxes-ui/lib';

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    size?: 'sm' | 'md';
  }
>(({ className, size = 'md', ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center text-muted-foreground/70',
      size === 'sm' && 'h-6 bg-muted rounded-lg',
      size === 'md' && 'h-auto border-b',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    size?: 'sm' | 'md';
  }
>(({ className, size = 'md', ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap px-3 font-medium transition-all text-muted-foreground disabled:pointer-events-none disabled:opacity-50 ',
      size === 'sm' &&
        'text-xs leading-none rounded-md h-6 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
      size === 'md' &&
        'relative text-sm py-2 after:absolute after:inset-x-0 after:-bottom-px outline-offset-2 after:h-px data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:after:bg -primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('focus-visible:outline-none', className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export const Tabs = Object.assign(TabsPrimitive.Root, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

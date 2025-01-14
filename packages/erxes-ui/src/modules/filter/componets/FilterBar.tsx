import { IconX } from '@tabler/icons-react';
import { Button, Select } from 'erxes-ui/components';
import { cn } from 'erxes-ui/lib/utils';
import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface FilterBarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface FilterBarFieldProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface FilterBarConditionProps
  extends React.ComponentPropsWithoutRef<typeof Select> {
  className?: string;
}

interface FilterBarValueProps
  extends React.ComponentPropsWithoutRef<typeof Select> {
  className?: string;
}

const FilterBarContainer = React.forwardRef<HTMLDivElement, FilterBarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 h-7 flex-shrink-0', className)}
      {...props}
    >
      <p className="text-[13px] font-semibold text-muted-foreground">
        Filters:
      </p>
      {children}
    </div>
  )
);
FilterBarContainer.displayName = 'FilterBar';

const FilterBarItem = React.forwardRef<HTMLDivElement, FilterBarItemProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-px rounded bg-muted ring-1 ring-muted shadow [&>*:focus]:relative [&>*:focus]:z-10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
FilterBarItem.displayName = 'FilterBarItem';

const FilterBarField = React.forwardRef<HTMLButtonElement, FilterBarFieldProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      className={cn(
        'rounded-l-sm rounded-r-none bg-white px-2 text-[13px]',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
);
FilterBarField.displayName = 'FilterBarField';

const FilterBarSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'rounded-none border-none h-7 bg-background flex w-full items-center px-3 py-1 text-[13px] focus:border-ring focus:outline-none focus:ring-ring/20 focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground/70 font-medium',
      className
    )}
    {...props}
  />
));

const FilterBarCondition = React.forwardRef<
  React.ElementRef<typeof Select>,
  FilterBarConditionProps
>(({ className, ...props }, ref) => (
  <Select {...props}>
    <FilterBarSelectTrigger className={cn(className)}>
      <Select.Value />
    </FilterBarSelectTrigger>
  </Select>
));
FilterBarCondition.displayName = 'FilterBarCondition';

const FilterBarValue = React.forwardRef<
  React.ElementRef<typeof Select>,
  FilterBarValueProps
>(({ className, children, ...props }, ref) => (
  <Select {...props}>
    <FilterBarSelectTrigger className={cn(className)}>
      {children}
    </FilterBarSelectTrigger>
  </Select>
));
FilterBarValue.displayName = 'FilterBarValue';

const FilterBarRemove = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon"
    className={cn('rounded-l-none rounded-r-sm bg-white', className)}
    {...props}
  >
    <IconX />
  </Button>
));
FilterBarRemove.displayName = 'FilterBarRemove';

export {
  FilterBarContainer,
  FilterBarItem,
  FilterBarField,
  FilterBarCondition,
  FilterBarValue,
  FilterBarRemove,
  FilterBarSelectTrigger,
};

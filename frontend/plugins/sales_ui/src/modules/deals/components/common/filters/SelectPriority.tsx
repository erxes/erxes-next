import {
  Combobox,
  Command,
  Filter,
  Popover,
  cn,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import React, { useState } from 'react';

import { IconStackFront } from '@tabler/icons-react';
import { PROJECT_PRIORITIES_OPTIONS } from '@/deals/constants/cards';
import clsx from 'clsx';

interface SelectPriorityContextType {
  value: number;
  onValueChange: (value: number) => void;
}

const SelectPriorityContext =
  React.createContext<SelectPriorityContextType | null>(null);

const useSelectPriorityContext = () => {
  const context = React.useContext(SelectPriorityContext);
  if (!context) {
    throw new Error(
      'useSelectPriorityContext must be used within SelectPriorityProvider',
    );
  }
  return context;
};

export const PriorityIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement> & { priority: number }
>(({ priority, className, ...props }, ref) => {
  const color = [
    'text-muted-foreground',
    'text-success',
    'text-info',
    'text-warning',
    'text-destructive',
  ][priority];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={3}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-4', color, className)}
      {...props}
      ref={ref}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M6 18l0 -3"
        className={priority > 0 ? 'stroke-current' : 'stroke-scroll'}
      />
      <path
        d="M10 18l0 -6"
        className={priority > 1 ? 'stroke-current' : 'stroke-scroll'}
      />
      <path
        d="M14 18l0 -9"
        className={priority > 2 ? 'stroke-current' : 'stroke-scroll'}
      />
      <path
        d="M18 18l0 -12"
        className={priority > 3 ? 'stroke-current' : 'stroke-scroll'}
      />
    </svg>
  );
});

PriorityIcon.displayName = 'PriorityIcon';

export const PriorityTitle = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<'span'> & { priority: number }
>(({ priority, className, ...props }, ref) => {
  const text = PROJECT_PRIORITIES_OPTIONS[priority];
  return (
    <span
      ref={ref}
      className={cn(
        'font-medium',
        priority === 0 && 'text-muted-foreground',
        className,
      )}
      {...props}
    >
      {text}
    </span>
  );
});

PriorityTitle.displayName = 'PriorityTitle';

const SelectPriorityProvider = ({
  children,
  value = 0,
  onValueChange,
}: {
  children: React.ReactNode;
  value?: number;
  onValueChange: (value: number) => void;
}) => {
  return (
    <SelectPriorityContext.Provider
      value={{
        value,
        onValueChange,
      }}
    >
      {children}
    </SelectPriorityContext.Provider>
  );
};

const SelectPriorityValue = () => {
  const { value } = useSelectPriorityContext();

  return (
    <>
      <PriorityIcon priority={value} />
      <PriorityTitle priority={value} />
    </>
  );
};

const SelectPriorityCommandItem = ({ priority }: { priority: number }) => {
  const { onValueChange, value } = useSelectPriorityContext();
  const priorityLabel = PROJECT_PRIORITIES_OPTIONS[priority];
  return (
    <Command.Item
      value={clsx(priorityLabel, value)}
      onSelect={() => onValueChange(priority)}
    >
      <div className="flex items-center gap-2 flex-1">
        <PriorityIcon priority={priority} />
        <PriorityTitle priority={priority} />
      </div>
      <Combobox.Check checked={value === priority} />
    </Command.Item>
  );
};

const SelectPriorityContent = () => {
  return (
    <Command>
      <Command.Input placeholder="Search priority" />
      <Command.Empty>No priority found</Command.Empty>
      <Command.List>
        {PROJECT_PRIORITIES_OPTIONS.map((priority, index) => (
          <SelectPriorityCommandItem key={priority} priority={index} />
        ))}
      </Command.List>
    </Command>
  );
};

export const SelectPriorityFilterItem = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {
  return (
    <Filter.Item value={value}>
      <IconStackFront />
      {label}
    </Filter.Item>
  );
};

const SelectPriorityFilterView = () => {
  const [priority, setPriority] = useQueryState<string>('priority');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey="priority">
      <SelectPriorityProvider
        value={Number(priority)}
        onValueChange={(value) => {
          setPriority(String(value));
          resetFilterState();
        }}
      >
        <SelectPriorityContent />
      </SelectPriorityProvider>
    </Filter.View>
  );
};

const SelectPriorityFilterBar = () => {
  const [priority, setPriority] = useQueryState<string>('priority');
  const [open, setOpen] = useState(false);

  if (!priority) {
    return null;
  }

  return (
    <Filter.BarItem queryKey={priority}>
      <Filter.BarName>
        <IconStackFront />
        By Priority
      </Filter.BarName>
      <SelectPriorityProvider
        value={Number(priority)}
        onValueChange={(value) => {
          if (value && value > 0) {
            setPriority(String(value));
          } else {
            setPriority(null);
          }
          setOpen(false);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey={priority}>
              <SelectPriorityValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectPriorityContent />
          </Combobox.Content>
        </Popover>
      </SelectPriorityProvider>
    </Filter.BarItem>
  );
};

export const SelectPriority = Object.assign(SelectPriorityProvider, {
  FilterBar: SelectPriorityFilterBar,
  FilterView: SelectPriorityFilterView,
  FilterItem: SelectPriorityFilterItem,
});

import React, { useEffect, useRef, useState } from 'react';
import { FilterContext } from '../context/FilterContext';
import { useFilterContext } from '../hooks/useFilterContext';
import { Button, Command, Dialog, Input, Popover } from 'erxes-ui/components';
import { IconAdjustmentsHorizontal, IconX } from '@tabler/icons-react';
import { useQueryState, useRemoveQueryStateByKey } from 'erxes-ui/hooks';
import { Except } from 'type-fest';
import { cn } from 'erxes-ui/lib';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  filterDialogViewState,
  filterPopoverViewState,
  openDialogState,
  openPopoverState,
} from '../states/filterStates';

const FilterProvider = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) => {
  const setOpen = useSetAtom(openPopoverState(id));
  const setView = useSetAtom(filterPopoverViewState(id));

  const resetFilterState = () => {
    setOpen(false);
    setView('root');
  };

  return (
    <FilterContext.Provider value={{ id, resetFilterState }}>
      {children}
    </FilterContext.Provider>
  );
};

const FilterTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => {
  return (
    <Popover.Trigger asChild>
      <Button ref={ref} variant="outline" {...props}>
        <IconAdjustmentsHorizontal className="w-4 h-4" />
        Filter
      </Button>
    </Popover.Trigger>
  );
});

const FilterPopover = (
  props: React.ComponentPropsWithoutRef<typeof Popover>,
) => {
  const { id } = useFilterContext();
  const [open, setOpen] = useAtom(openPopoverState(id));
  const setView = useSetAtom(filterPopoverViewState(id));
  return (
    <Popover
      open={open}
      onOpenChange={(op) => {
        setOpen(op);
        op && setView('root');
      }}
      {...props}
    />
  );
};

const FilterItem = React.forwardRef<
  React.ComponentRef<typeof Command.Item>,
  Except<React.ComponentPropsWithoutRef<typeof Command.Item>, 'value'> & {
    value: string;
    inDialog?: boolean;
  }
>(({ children, value, inDialog, className, ...props }, ref) => {
  const { id } = useFilterContext();
  const setDialogView = useSetAtom(filterDialogViewState(id));
  const setOpenDialog = useSetAtom(openDialogState(id));
  const setOpen = useSetAtom(openPopoverState(id));
  const setView = useSetAtom(filterPopoverViewState(id));

  const onSelect = () => {
    if (inDialog) {
      setDialogView(value);
      setOpenDialog(true);
      setOpen(false);
    } else {
      setView(value);
    }
  };

  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      ref={ref}
      className={cn('h-8', className)}
      {...props}
    >
      {children}
    </Command.Item>
  );
});

const FilterView = ({
  children,
  value = 'root',
  inDialog,
}: {
  children: React.ReactNode;
  value?: string;
  inDialog?: boolean;
}) => {
  const { id } = useFilterContext();
  const view = useAtomValue(filterPopoverViewState(id));
  const [dialogView] = useAtom(filterDialogViewState(id));

  if (inDialog ? dialogView !== value : view !== value) {
    return null;
  }
  return children;
};

const FilterDialog = (props: React.ComponentPropsWithoutRef<typeof Dialog>) => {
  const { id } = useFilterContext();
  const [openDialog, setOpenDialog] = useAtom(openDialogState(id));
  return <Dialog open={openDialog} onOpenChange={setOpenDialog} {...props} />;
};

const FilterBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex-none bg-sidebar p-3 border-b flex gap-3 items-center',
        className,
      )}
      {...props}
    />
  );
});

const FilterBarItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded flex gap-px h-7 items-stretch shadow-xs bg-muted text-sm font-medium',
        className,
      )}
      {...props}
    />
  );
});

const FilterBarName = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-background rounded-l [&>svg]:size-4 flex items-center px-2 gap-2',
        className,
      )}
      {...props}
    />
  );
});

const FilterBarButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  Except<React.ComponentPropsWithoutRef<typeof Button>, 'value'> & {
    inDialog?: boolean;
    value?: string;
  }
>(({ className, inDialog, value, ...props }, ref) => {
  const { id } = useFilterContext();
  const setDialogView = useSetAtom(filterDialogViewState(id));
  const setOpenDialog = useSetAtom(openDialogState(id));

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn('rounded-none bg-background focus-visible:z-10', className)}
      onClick={() => {
        if (inDialog) {
          setDialogView(value ?? 'root');
          setOpenDialog(true);
        }
      }}
      {...props}
    />
  );
});

const FilterBarCloseButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  Except<React.ComponentPropsWithoutRef<typeof Button>, 'value'> & {
    value?: string;
  }
>(({ className, value, ...props }, ref) => {
  const removeQuery = useRemoveQueryStateByKey();

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn('rounded-l-none bg-background', className)}
      onClick={() => removeQuery(value ?? '')}
      {...props}
    >
      <IconX />
    </Button>
  );
});

const FilterDialogStringView = ({ value }: { value: string }) => {
  const { id } = useFilterContext();
  const [dialogView, setDialogView] = useAtom(filterDialogViewState(id));
  const setOpenDialog = useSetAtom(openDialogState(id));
  const [dialogSearch, setDialogSearch] = useState('');
  const [query, setQuery] = useQueryState<string>(dialogView);

  useEffect(() => {
    if (query) {
      setDialogSearch(query);
    }
  }, [dialogView, query]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery(dialogSearch.length > 0 ? dialogSearch : null);
    setDialogView('root');
    setOpenDialog(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <Dialog.Header>
        <Dialog.Title className="font-medium text-lg">
          Filter by {value}...
        </Dialog.Title>
      </Dialog.Header>

      <Input
        placeholder={value.charAt(0).toUpperCase() + value.slice(1)}
        className="my-4"
        value={dialogSearch}
        onChange={(e) => setDialogSearch(e.target.value)}
      />
      <Dialog.Footer className="sm:space-x-3">
        <Dialog.Close asChild>
          <Button variant="outline" size="lg">
            Cancel
          </Button>
        </Dialog.Close>
        <Button size="lg" type="submit">
          Apply
        </Button>
      </Dialog.Footer>
    </form>
  );
};

const FilterPopoverDateView = ({ value }: { value: string }) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Command className="outline-none">
      <Command.Input
        variant="secondary"
        ref={ref}
        placeholder={value.charAt(0).toUpperCase() + value.slice(1) + ' date'}
      />
      <Command.Separator />
      <Command.List className="p-1">
        <Command.Item className="h-8" value="in-the-past">
          In the past
        </Command.Item>
        <Command.Item className="h-8" value="1-day-from-now">
          1 day from now
        </Command.Item>
        <Command.Item className="h-8" value="3-days-from-now">
          3 days from now
        </Command.Item>
        <Command.Item className="h-8" value="1-week-from-now">
          1 week from now
        </Command.Item>
        <Command.Item className="h-8" value="3-months-from-now">
          3 months from now
        </Command.Item>
        <Command.Item className="h-8" value="custom-date-or-timeframe">
          Custom date or timeframe
        </Command.Item>
        <Command.Item className="h-8" value="no-due-date">
          No due date
        </Command.Item>
      </Command.List>
    </Command>
  );
};

export const Filter = Object.assign(FilterProvider, {
  Trigger: FilterTrigger,
  Popover: FilterPopover,
  Item: FilterItem,
  View: FilterView,
  Dialog: FilterDialog,
  DialogStringView: FilterDialogStringView,
  DateView: FilterPopoverDateView,
  Bar: FilterBar,
  BarItem: FilterBarItem,
  BarName: FilterBarName,
  BarButton: FilterBarButton,
  BarClose: FilterBarCloseButton,
});

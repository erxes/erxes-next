import React, { useState } from 'react';
import {
  cn,
  Combobox,
  Command,
  Filter,
  Form,
  Popover,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
  useFilterContext,
  useQueryState,
  Badge,
  Button,
} from 'erxes-ui';
import { IconAlertSquareRounded } from '@tabler/icons-react';
import { PROJECT_PRIORITIES_OPTIONS } from '@/project/constants';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';

interface SelectPriorityContextType {
  priorities: typeof PROJECT_PRIORITIES_OPTIONS;
  priorityIds: string[];
  onSelect: (priority: (typeof PROJECT_PRIORITIES_OPTIONS)[0]) => void;
  setPriorities: (priorities: typeof PROJECT_PRIORITIES_OPTIONS) => void;
  loading: boolean;
  error: any;
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

export const SelectPriorityProvider = ({
  children,
  mode = 'single',
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  mode?: 'single' | 'multiple';
  value?: string[] | string;
  onValueChange: (value: string[] | string) => void;
}) => {
  const [_priorities, setPriorities] = useState<
    typeof PROJECT_PRIORITIES_OPTIONS
  >(PROJECT_PRIORITIES_OPTIONS);
  const isSingleMode = mode === 'single';

  const onSelect = (priority: (typeof PROJECT_PRIORITIES_OPTIONS)[0]) => {
    if (!priority) return;
    if (isSingleMode) {
      setPriorities([priority]);
      return onValueChange?.(priority.value.toString());
    }

    const arrayValue = Array.isArray(value) ? value : [];
    const isPrioritySelected = arrayValue.includes(priority.value.toString());
    const newSelectedPriorityIds = isPrioritySelected
      ? arrayValue.filter((id) => id !== priority.value.toString())
      : [...arrayValue, priority.value.toString()];

    setPriorities((prev) =>
      prev.filter((p) => newSelectedPriorityIds.includes(p.value.toString())),
    );
    onValueChange?.(newSelectedPriorityIds);
  };

  return (
    <SelectPriorityContext.Provider
      value={{
        priorities: _priorities,
        priorityIds: !value ? [] : Array.isArray(value) ? value : [value],
        onSelect,
        setPriorities,
        loading: false,
        error: null,
      }}
    >
      {children}
    </SelectPriorityContext.Provider>
  );
};

const SelectPriorityBadgeValue = ({
  placeholder,
}: {
  placeholder?: string;
}) => {
  const { priorityIds } = useSelectPriorityContext();

  const selectedPriorities = PROJECT_PRIORITIES_OPTIONS.filter((priority) =>
    priorityIds.includes(priority.value.toString()),
  );

  if (selectedPriorities.length === 0) {
    return (
      <span className="text-accent-foreground/80">
        {placeholder || 'Select priority...'}
      </span>
    );
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {selectedPriorities.map((priority) => (
        <Badge
          key={priority.value}
          variant="secondary"
          className="flex items-center gap-1"
          style={
            priority.value !== 0
              ? { backgroundColor: `${priority.IconColor}25` }
              : undefined
          }
        >
          {priority.value !== 0 && (
            <priority.Icon
              className="w-3 h-3"
              color={priority.IconColor}
              stroke={2}
            />
          )}
          {priority.name}
        </Badge>
      ))}
    </div>
  );
};
const SelectPriorityValue = ({ placeholder }: { placeholder?: string }) => {
  const { priorityIds } = useSelectPriorityContext();

  const selectedPriorities = PROJECT_PRIORITIES_OPTIONS.filter((priority) =>
    priorityIds.includes(priority.value.toString()),
  );

  if (selectedPriorities.length === 0) {
    return (
      <span className="text-accent-foreground/80">
        {placeholder || 'Select priority...'}
      </span>
    );
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {selectedPriorities.map((priority) => (
        <div className="flex items-center gap-2" key={priority.value}>
          {priority.value !== 0 && (
            <priority.Icon
              className="w-3 h-3"
              color={priority.IconColor}
              stroke={2}
            />
          )}
          <p
            className={cn(
              'font-medium text-base',
              priority.value === 0 && 'text-muted-foreground',
            )}
          >
            {priority.name}
          </p>
        </div>
      ))}
    </div>
  );
};

const SelectPriorityCommandItem = ({
  priority,
}: {
  priority: (typeof PROJECT_PRIORITIES_OPTIONS)[0];
}) => {
  const { onSelect, priorityIds } = useSelectPriorityContext();

  return (
    <Command.Item
      value={priority.value.toString()}
      onSelect={() => {
        onSelect(priority);
      }}
    >
      <div className="flex items-center gap-2 flex-1">
        <priority.Icon
          className="w-4 h-4"
          color={priority.IconColor}
          stroke={1.8}
        />
        <span className="font-medium">{priority.name}</span>
      </div>
      <Combobox.Check
        checked={priorityIds.includes(priority.value.toString())}
      />
    </Command.Item>
  );
};

const SelectPriorityContent = () => {
  return (
    <Command shouldFilter={false} id="priority-command-menu">
      <Command.List>
        {PROJECT_PRIORITIES_OPTIONS.map((priority) => (
          <SelectPriorityCommandItem key={priority.value} priority={priority} />
        ))}
      </Command.List>
    </Command>
  );
};

export const SelectPriorityFilterItem = () => {
  return (
    <Filter.Item value="priority">
      <IconAlertSquareRounded />
      Priority
    </Filter.Item>
  );
};

export const SelectPriorityFilterView = ({
  onValueChange,
  queryKey,
  mode = 'single',
}: {
  onValueChange?: (value: string[] | string) => void;
  queryKey?: string;
  mode?: 'single' | 'multiple';
}) => {
  const [priority, setPriority] = useQueryState<number>(queryKey || 'priority');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey={queryKey || 'priority'}>
      <SelectPriorityProvider
        mode={mode}
        value={
          priority !== null ? priority.toString() : mode === 'single' ? '' : []
        }
        onValueChange={(value) => {
          const numValue =
            typeof value === 'string' ? parseInt(value, 10) : null;
          setPriority(numValue);
          resetFilterState();
          onValueChange?.(value);
        }}
      >
        <SelectPriorityContent />
      </SelectPriorityProvider>
    </Filter.View>
  );
};

export const SelectPriorityFilterBar = ({
  iconOnly,
  onValueChange,
  queryKey,
  mode = 'single',
}: {
  iconOnly?: boolean;
  onValueChange?: (value: string[] | string) => void;
  queryKey?: string;
  mode?: 'single' | 'multiple';
}) => {
  const [priority, setPriority] = useQueryState<number>(queryKey || 'priority');
  const [open, setOpen] = useState(false);

  if (priority === null) {
    return null;
  }

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconAlertSquareRounded />
        {!iconOnly && 'Priority'}
      </Filter.BarName>
      <SelectPriorityProvider
        mode={mode}
        value={
          priority !== null ? priority.toString() : mode === 'single' ? '' : []
        }
        onValueChange={(value) => {
          const hasValue = Array.isArray(value) ? value.length > 0 : !!value;
          if (hasValue) {
            const numValue =
              typeof value === 'string' ? parseInt(value, 10) : null;
            setPriority(numValue);
          } else {
            setPriority(null);
          }
          setOpen(false);
          onValueChange?.(value);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey={queryKey || 'priority'}>
              <SelectPriorityBadgeValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectPriorityContent />
          </Combobox.Content>
        </Popover>
      </SelectPriorityProvider>
      <Filter.BarClose filterKey={queryKey || 'priority'} />
    </Filter.BarItem>
  );
};

export const SelectPriorityInlineCell = ({
  value,
  id,
  onValueChange,
  scope,
  ...props
}: {
  value?: number | string;
  id?: string;
  onValueChange?: (value: string | string[]) => void;
  scope?: string;
} & Omit<
  React.ComponentProps<typeof SelectPriorityProvider>,
  'children' | 'onValueChange' | 'value'
>) => {
  const { updateTask } = useUpdateTask();
  const [open, setOpen] = useState(false);

  const handleValueChange = (value: string | string[]) => {
    if (id) {
      updateTask({
        variables: {
          _id: id,
          priority: Number(value),
        },
      });
    }
    onValueChange?.(value);
    setOpen(false);
  };

  const stringValue =
    typeof value === 'number' ? value.toString() : value || '';
  const finalScope =
    scope || (id ? `ProjectTableCell.${id}.Priority` : undefined);

  return (
    <SelectPriorityProvider
      mode="single"
      value={stringValue}
      onValueChange={handleValueChange}
      {...props}
    >
      <RecordTablePopover
        open={open}
        onOpenChange={setOpen}
        scope={finalScope}
        closeOnEnter
      >
        <RecordTableCellTrigger>
          <SelectPriorityBadgeValue placeholder={''} />
        </RecordTableCellTrigger>
        <RecordTableCellContent className="max-w-72">
          <SelectPriorityContent />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectPriorityProvider>
  );
};

export const SelectPriorityFormItem = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<
    React.ComponentProps<typeof SelectPriorityProvider>,
    'children' | 'onValueChange' | 'value'
  > & {
    className?: string;
    placeholder?: string;
    value?: number | string;
    onChange?: (value: number) => void;
  }
>(({ onChange, className, placeholder, value, ...props }, ref) => {
  const [open, setOpen] = useState(false);

  const stringValue =
    typeof value === 'number' ? value.toString() : value || '';

  return (
    <SelectPriorityProvider
      value={stringValue}
      onValueChange={(value) => {
        const numValue =
          typeof value === 'string' ? parseInt(value, 10) : Number(value);
        onChange?.(numValue);
        setOpen(false);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.TriggerBase
            ref={ref}
            className={cn('w-full shadow-xs', className)}
            asChild
          >
            <Button variant="secondary" className="h-7">
              <SelectPriorityValue placeholder={placeholder} />
            </Button>
          </Combobox.TriggerBase>
        </Form.Control>
        <Combobox.Content>
          <SelectPriorityContent />
        </Combobox.Content>
      </Popover>
    </SelectPriorityProvider>
  );
});

SelectPriorityFormItem.displayName = 'SelectPriorityFormItem';

const SelectPriorityRoot = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectPriorityProvider>, 'children'> &
    React.ComponentProps<typeof Combobox.Trigger> & {
      placeholder?: string;
    }
>(({ onValueChange, className, mode, value, placeholder, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectPriorityProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      mode={mode}
      value={value}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.Trigger
          ref={ref}
          className={cn('w-full inline-flex', className)}
          variant="outline"
          {...props}
        >
          <SelectPriorityBadgeValue placeholder={placeholder} />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectPriorityContent />
        </Combobox.Content>
      </Popover>
    </SelectPriorityProvider>
  );
});

SelectPriorityRoot.displayName = 'SelectPriorityRoot';

export const SelectPriority = Object.assign(SelectPriorityRoot, {
  Provider: SelectPriorityProvider,
  Value: SelectPriorityBadgeValue,
  Content: SelectPriorityContent,
  FilterItem: SelectPriorityFilterItem,
  FilterView: SelectPriorityFilterView,
  FilterBar: SelectPriorityFilterBar,
  InlineCell: SelectPriorityInlineCell,
  FormItem: SelectPriorityFormItem,
});

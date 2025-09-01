import React, { useState } from 'react';
import {
  Button,
  cn,
  Combobox,
  Command,
  Filter,
  Form,
  Popover,
  PopoverScoped,
  RecordTableInlineCell,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import { IconProgressCheck } from '@tabler/icons-react';
import { useUpdateProject } from '@/project/hooks/useUpdateProject';
import { PROJECT_STATUS_OPTIONS } from '@/operation/constants/statusConstants';
interface SelectStatusContextType {
  statuses: typeof PROJECT_STATUS_OPTIONS;
  statusIds: string[];
  onSelect: (status: (typeof PROJECT_STATUS_OPTIONS)[0]) => void;
  setStatuses: (statuses: typeof PROJECT_STATUS_OPTIONS) => void;
  loading: boolean;
  error: any;
}

const SelectStatusContext = React.createContext<SelectStatusContextType | null>(
  null,
);

const useSelectStatusContext = () => {
  const context = React.useContext(SelectStatusContext);
  if (!context) {
    throw new Error(
      'useSelectStatusContext must be used within SelectStatusProvider',
    );
  }
  return context;
};

export const SelectStatusProvider = ({
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
  const [_statuses, setStatuses] = useState<typeof PROJECT_STATUS_OPTIONS>(
    PROJECT_STATUS_OPTIONS,
  );
  const isSingleMode = mode === 'single';

  const onSelect = (status: (typeof PROJECT_STATUS_OPTIONS)[0]) => {
    if (!status) return;
    if (isSingleMode) {
      onValueChange?.(status.value.toString());
      return;
    }

    const arrayValue = Array.isArray(value) ? value : [];
    const isStatusSelected = arrayValue.includes(status.value.toString());
    const newSelectedStatusIds = isStatusSelected
      ? arrayValue.filter((id) => id !== status.value.toString())
      : [...arrayValue, status.value.toString()];

    onValueChange?.(newSelectedStatusIds);
  };

  return (
    <SelectStatusContext.Provider
      value={{
        statuses: _statuses,
        statusIds: !value ? [] : Array.isArray(value) ? value : [value],
        onSelect,
        setStatuses,
        loading: false,
        error: null,
      }}
    >
      {children}
    </SelectStatusContext.Provider>
  );
};

const SelectStatusValue = ({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) => {
  const { statusIds } = useSelectStatusContext();

  const selectedStatuses = PROJECT_STATUS_OPTIONS.filter((status) =>
    statusIds.includes(status.value.toString()),
  );
  if (selectedStatuses.length === 0) {
    return (
      <span className="text-accent-foreground/80">
        {placeholder || 'Select status...'}
      </span>
    );
  }

  return (
    <div className="flex gap-1 ">
      {selectedStatuses.map((status) => (
        <div className="flex items-center gap-2" key={status.value}>
          <status.Icon
            className="size-4 flex-none"
            color={status.IconColor}
            stroke={2}
          />
          <p className={cn('font-medium', className)}>{status.name}</p>
        </div>
      ))}
    </div>
  );
};

const SelectStatusCommandItem = ({
  status,
}: {
  status: (typeof PROJECT_STATUS_OPTIONS)[0];
}) => {
  const { onSelect, statusIds } = useSelectStatusContext();

  return (
    <Command.Item
      value={status.value.toString()}
      onSelect={() => {
        onSelect(status);
      }}
    >
      <div className="flex items-center gap-2 flex-1">
        <status.Icon
          className="w-4 h-4"
          color={status.IconColor}
          stroke={1.8}
        />
        <span className="font-medium">{status.name}</span>
      </div>
      <Combobox.Check checked={statusIds.includes(status.value.toString())} />
    </Command.Item>
  );
};

const SelectStatusContent = () => {
  return (
    <Command shouldFilter={false} id="status-command-menu">
      <Command.List>
        {PROJECT_STATUS_OPTIONS.map((status) => (
          <SelectStatusCommandItem key={status.value} status={status} />
        ))}
      </Command.List>
    </Command>
  );
};

export const SelectStatusFilterItem = () => {
  return (
    <Filter.Item value="status">
      <IconProgressCheck />
      Status
    </Filter.Item>
  );
};

export const SelectStatusFilterView = ({
  onValueChange,
  queryKey,
  mode = 'single',
}: {
  onValueChange?: (value: string[] | string) => void;
  queryKey?: string;
  mode?: 'single' | 'multiple';
}) => {
  const [status, setStatus] = useQueryState<number>(queryKey || 'status');
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey={queryKey || 'status'}>
      <SelectStatusProvider
        mode={mode}
        value={
          status !== null ? status.toString() : mode === 'single' ? '' : []
        }
        onValueChange={(value) => {
          const numValue =
            typeof value === 'string' ? parseInt(value, 10) : null;
          setStatus(numValue);
          resetFilterState();
          onValueChange?.(value);
        }}
      >
        <SelectStatusContent />
      </SelectStatusProvider>
    </Filter.View>
  );
};

export const SelectStatusFilterBar = ({
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
  const [status, setStatus] = useQueryState<number>(queryKey || 'status');
  const [open, setOpen] = useState(false);

  if (status === null) return null;

  return (
    <Filter.BarItem queryKey={queryKey || 'status'}>
      <Filter.BarName>
        <IconProgressCheck />
        {!iconOnly && 'Status'}
      </Filter.BarName>
      <SelectStatusProvider
        mode={mode}
        value={
          status !== null ? status.toString() : mode === 'single' ? '' : []
        }
        onValueChange={(value) => {
          const hasValue = Array.isArray(value) ? value.length > 0 : !!value;
          if (hasValue) {
            const numValue =
              typeof value === 'string' ? parseInt(value, 10) : null;
            setStatus(numValue);
          } else {
            setStatus(null);
          }
          setOpen(false);
          onValueChange?.(value);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey={queryKey || 'status'}>
              <SelectStatusValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectStatusContent />
          </Combobox.Content>
        </Popover>
      </SelectStatusProvider>
    </Filter.BarItem>
  );
};

export const SelectStatusInlineCell = ({
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
  React.ComponentProps<typeof SelectStatusProvider>,
  'children' | 'onValueChange' | 'value'
>) => {
  const { updateProject } = useUpdateProject();
  const [open, setOpen] = useState(false);

  const handleValueChange = (value: string | string[]) => {
    if (id) {
      updateProject({
        variables: {
          _id: id,
          status: Number(value),
        },
      });
    }
    onValueChange?.(value);
    setOpen(false);
  };

  const stringValue =
    typeof value === 'number' ? value.toString() : value || '';
  const finalScope =
    scope || (id ? `ProjectTableCell.${id}.Status` : undefined);

  return (
    <SelectStatusProvider
      mode="single"
      value={stringValue}
      onValueChange={handleValueChange}
      {...props}
    >
      <PopoverScoped
        open={open}
      onOpenChange={setOpen}
        scope={finalScope}
        closeOnEnter
      >
        <RecordTableInlineCell.Trigger>
          <SelectStatusValue placeholder={''} />
        </RecordTableInlineCell.Trigger>
        <RecordTableInlineCell.Content className="max-w-72">
          <SelectStatusContent />
        </RecordTableInlineCell.Content>
      </PopoverScoped>
    </SelectStatusProvider>
  );
};

export const SelectStatusFormItem = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<
    React.ComponentProps<typeof SelectStatusProvider>,
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
    <SelectStatusProvider
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
              <SelectStatusValue placeholder={placeholder} />
            </Button>
          </Combobox.TriggerBase>
        </Form.Control>
        <Combobox.Content>
          <SelectStatusContent />
        </Combobox.Content>
      </Popover>
    </SelectStatusProvider>
  );
});

SelectStatusFormItem.displayName = 'SelectStatusFormItem';

const SelectStatusRoot = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectStatusProvider>, 'children'> &
    React.ComponentProps<typeof Combobox.Trigger> & {
      placeholder?: string;
    }
>(({ onValueChange, className, mode, value, placeholder, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectStatusProvider
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
          <SelectStatusValue placeholder={placeholder} />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectStatusContent />
        </Combobox.Content>
      </Popover>
    </SelectStatusProvider>
  );
});

SelectStatusRoot.displayName = 'SelectStatusRoot';

export const SelectStatusDetail = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<
    React.ComponentProps<typeof SelectStatusProvider>,
    'children' | 'onValueChange' | 'value'
  > & {
    className?: string;
    placeholder?: string;
    value?: number | string;
    id?: string;
  }
>(({ className, placeholder, value, id, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const { updateProject } = useUpdateProject();
  const stringValue =
    typeof value === 'number' ? value.toString() : value || '';

  const handleValueChange = (value: number) => {
    if (id) {
      updateProject({
        variables: {
          _id: id,
          status: value,
        },
      });
    }
    setOpen(false);
  };

  return (
    <SelectStatusProvider
      value={stringValue}
      onValueChange={(value) => {
        const numValue =
          typeof value === 'string' ? parseInt(value, 10) : Number(value);
        handleValueChange(numValue);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.TriggerBase
          ref={ref}
          className={cn('w-min shadow-xs', className)}
          asChild
        >
          <Button variant="secondary" className="h-7">
            <SelectStatusValue placeholder={placeholder} />
          </Button>
        </Combobox.TriggerBase>
        <Combobox.Content>
          <SelectStatusContent />
        </Combobox.Content>
      </Popover>
    </SelectStatusProvider>
  );
});

SelectStatusDetail.displayName = 'SelectStatusDetail';

export const SelectStatus = Object.assign(SelectStatusRoot, {
  Provider: SelectStatusProvider,
  Value: SelectStatusValue,
  Content: SelectStatusContent,
  FilterItem: SelectStatusFilterItem,
  FilterView: SelectStatusFilterView,
  FilterBar: SelectStatusFilterBar,
  InlineCell: SelectStatusInlineCell,
  FormItem: SelectStatusFormItem,
  Detail: SelectStatusDetail,
});

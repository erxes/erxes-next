import React, { useEffect, useState } from 'react';
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
import { IStatus } from '@/task/types';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';
import { useGetStatusByTeam } from '@/task/hooks/useGetStatusByTeam';
import { DEFAULT_TEAM_STATUSES } from '@/team/constants';
import { useParams } from 'react-router-dom';
import { StatusInlineIcon } from '@/task/components/StatusInline';

interface SelectStatusContextType {
  statuses: IStatus[];
  statusId: string;
  onSelect: (status: IStatus) => void;
  setStatuses: (statuses: IStatus[]) => void;
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
  value,
  onValueChange,
  statuses = [],
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange: (value: string) => void;
  statuses?: IStatus[];
}) => {
  const [_statuses, setStatuses] = useState<IStatus[]>(statuses);

  const onSelect = (status: IStatus) => {
    if (!status) return;
    onValueChange?.(status.value.toString());
  };
  React.useEffect(() => {
    setStatuses(statuses);
  }, [statuses]);

  return (
    <SelectStatusContext.Provider
      value={{
        statuses: _statuses,
        statusId: value || '',
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
  const { statusId, statuses } = useSelectStatusContext();
  const selectedStatus = statuses.find((status) => status.value === statusId);
  if (!selectedStatus) {
    return (
      <span className="text-accent-foreground/80">
        {placeholder || 'Status'}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <StatusInlineIcon
        type={selectedStatus.type}
        color={selectedStatus.color}
      />
      <p className={cn('font-medium text-sm', className)}>
        {selectedStatus.label}
      </p>
    </div>
  );
};

const SelectStatusCommandItem = ({ status }: { status: IStatus }) => {
  const { onSelect, statusId } = useSelectStatusContext();

  return (
    <Command.Item
      value={status.value.toString()}
      onSelect={() => {
        onSelect(status);
      }}
    >
      <div className="flex items-center gap-2 flex-1">
        <StatusInlineIcon type={status.type} color={status.color} />
        <span className="font-medium">{status.label}</span>
      </div>
      <Combobox.Check checked={statusId === status.value.toString()} />
    </Command.Item>
  );
};

const SelectStatusContent = () => {
  const { statuses } = useSelectStatusContext();
  return (
    <Command shouldFilter={false} id="status-command-menu">
      <Command.List>
        {statuses.map((status) => (
          <SelectStatusCommandItem key={status.value} status={status} />
        ))}
      </Command.List>
    </Command>
  );
};

export const SelectStatusFilterItem = () => {
  const { teamId } = useParams();
  return (
    <Filter.Item value={teamId ? 'status' : 'statusType'}>
      <IconProgressCheck />
      Status
    </Filter.Item>
  );
};

export const SelectStatusFilterView = ({
  onValueChange,
  queryKey,
  teamId,
}: {
  onValueChange?: (value: string) => void;
  queryKey?: string;
  teamId: string;
}) => {
  const [status, setStatus] = useQueryState<string>(queryKey || 'status');
  const { resetFilterState } = useFilterContext();
  const { statuses } = useGetStatusByTeam({
    variables: {
      teamId,
    },
  });
  return (
    <Filter.View filterKey={queryKey || 'status'}>
      <SelectStatusProvider
        statuses={statuses}
        value={status || ''}
        onValueChange={(value) => {
          setStatus(value);
          resetFilterState();
          onValueChange?.(value);
        }}
      >
        <SelectStatusContent />
      </SelectStatusProvider>
    </Filter.View>
  );
};

export const SelectStatusTypeFilterView = ({
  onValueChange,
}: {
  onValueChange?: (value: string) => void;
}) => {
  const [statusType, setStatusType] = useQueryState<number>('statusType');
  const { resetFilterState } = useFilterContext();
  return (
    <Filter.View filterKey={'statusType'}>
      <SelectStatusProvider
        statuses={DEFAULT_TEAM_STATUSES}
        value={statusType?.toString() || ''}
        onValueChange={(value) => {
          setStatusType(Number(value));
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
}: {
  iconOnly?: boolean;
  onValueChange?: (value: string) => void;
  queryKey?: string;
}) => {
  const [status, setStatus] = useQueryState<number>(queryKey || 'status');
  const [open, setOpen] = useState(false);

  if (status === null) return null;

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconProgressCheck />
        {!iconOnly && 'Status'}
      </Filter.BarName>
      <SelectStatusProvider
        value={status?.toString() || ''}
        onValueChange={(value) => {
          if (value) {
            setStatus(Number(value));
          } else {
            setStatus(null);
          }
          setOpen(false);
          onValueChange?.(value);
        }}
        statuses={DEFAULT_TEAM_STATUSES}
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
      <Filter.BarClose filterKey={queryKey || 'status'} />
    </Filter.BarItem>
  );
};

export const SelectStatusInlineCell = ({
  value,
  id,
  onValueChange,
  teamId,
  scope,
  ...props
}: {
  value?: string;
  id?: string;
  onValueChange?: (value: string) => void;
  teamId: string;
  scope?: string;
} & Omit<
  React.ComponentProps<typeof SelectStatusProvider>,
  'children' | 'onValueChange' | 'value' | 'statuses'
>) => {
  const { updateTask } = useUpdateTask();
  const [open, setOpen] = useState(false);
  const { statuses } = useGetStatusByTeam({
    variables: { teamId },
    skip: !teamId,
  });
  const handleValueChange = (value: string) => {
    if (id) {
      updateTask({
        variables: {
          _id: id,
          status: value,
        },
      });
    }
    onValueChange?.(value);
    setOpen(false);
  };

  return (
    <SelectStatusProvider
      value={value || ''}
      onValueChange={handleValueChange}
      statuses={statuses || []}
      {...props}
    >
      <PopoverScoped
        open={open}
        onOpenChange={setOpen}
        scope={scope}
        closeOnEnter
      >
        <RecordTableInlineCell.Trigger className="text-sm">
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
    value?: string;
    onChange?: (value: string) => void;
    teamId?: string;
    scope?: string;
  }
>(
  (
    { onChange, className, placeholder, value, teamId, scope, ...props },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const { statuses } = useGetStatusByTeam({
      variables: { teamId },
      skip: !teamId,
    });

    useEffect(() => {
      if (teamId && statuses?.length && !value) {
        onChange?.(statuses?.[0]?.value);
      }
    }, [onChange, statuses, teamId, value]);

    return (
      <SelectStatusProvider
        value={value || ''}
        onValueChange={(value) => {
          onChange?.(value);
          setOpen(false);
        }}
        statuses={statuses}
        {...props}
      >
        <PopoverScoped scope={scope} open={open} onOpenChange={setOpen}>
          <Form.Control>
            <Combobox.TriggerBase ref={ref} className={cn('h-7', className)}>
              <SelectStatusValue
                placeholder={placeholder}
                className={!value ? 'text-muted-foreground' : undefined}
              />
            </Combobox.TriggerBase>
          </Form.Control>
          <Combobox.Content>
            <SelectStatusContent />
          </Combobox.Content>
        </PopoverScoped>
      </SelectStatusProvider>
    );
  },
);

SelectStatusFormItem.displayName = 'SelectStatusFormItem';

const SelectStatusRoot = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectStatusProvider>, 'children'> &
    React.ComponentProps<typeof Combobox.Trigger> & {
      placeholder?: string;
    }
>(
  (
    { onValueChange, className, value, placeholder, statuses, ...props },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    return (
      <SelectStatusProvider
        onValueChange={(value) => {
          onValueChange?.(value);
          setOpen(false);
        }}
        value={value}
        statuses={statuses}
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
  },
);

SelectStatusRoot.displayName = 'SelectStatusRoot';

export const SelectStatusDetail = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<
    React.ComponentProps<typeof SelectStatusProvider>,
    'children' | 'onValueChange' | 'value' | 'statuses'
  > & {
    className?: string;
    placeholder?: string;
    value?: string;
    id?: string;
    teamId: string | undefined;
  }
>(({ className, placeholder, value, id, teamId, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const { updateTask } = useUpdateTask();
  const { statuses } = useGetStatusByTeam({
    variables: { teamId },
    skip: !teamId,
  });

  const handleValueChange = (value: string) => {
    if (id) {
      updateTask({
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
      value={value || ''}
      onValueChange={handleValueChange}
      statuses={statuses || []}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.TriggerBase
          ref={ref}
          className={cn('w-min shadow-xs', className)}
          asChild
        >
          <Button variant="secondary" className="h-7">
            <SelectStatusValue
              placeholder={placeholder}
              className={!value ? 'text-muted-foreground' : undefined}
            />
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
  TypeFilterView: SelectStatusTypeFilterView,
  Detail: SelectStatusDetail,
});

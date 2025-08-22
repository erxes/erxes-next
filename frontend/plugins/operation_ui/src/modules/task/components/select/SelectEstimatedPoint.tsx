import React, { useEffect, useState } from 'react';
import { IEstimateChoice } from '@/task/types';
import {
  Button,
  cn,
  Combobox,
  Command,
  Form,
  Popover,
  PopoverScoped,
  RecordTableInlineCell,
} from 'erxes-ui';
import { IconHash } from '@tabler/icons-react';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';
import { useGetEstimateChoiceByTeam } from '~/modules/task/hooks/useGetEstimateChoiceByTeam';

interface SelectEstimatedPointContextType {
  estimateChoices: IEstimateChoice[];
  estimateIds: string[];
  onSelect: (estimate: IEstimateChoice) => void;
  setEstimateChoices: (choices: IEstimateChoice[]) => void;
  loading: boolean;
  error: any;
}

const SelectEstimatedPointContext =
  React.createContext<SelectEstimatedPointContextType | null>(null);

const useSelectEstimatedPointContext = () => {
  const context = React.useContext(SelectEstimatedPointContext);
  if (!context) {
    throw new Error(
      'useSelectEstimatedPointContext must be used within SelectEstimatedPointProvider',
    );
  }
  return context;
};

export const SelectEstimatedPointProvider = ({
  children,
  mode = 'single',
  value,
  onValueChange,
  estimateChoices = [],
}: {
  children: React.ReactNode;
  mode?: 'single' | 'multiple';
  value?: string[] | string;
  onValueChange: (value: string[] | string) => void;
  estimateChoices?: IEstimateChoice[];
}) => {
  const [_estimateChoices, setEstimateChoices] = useState<IEstimateChoice[]>(
    estimateChoices || [],
  );
  const isSingleMode = mode === 'single';

  const onSelect = (estimate: IEstimateChoice) => {
    if (!estimate) return;
    if (isSingleMode) {
      onValueChange?.(estimate.value.toString());
      return;
    }

    const arrayValue = Array.isArray(value) ? value : [];
    const isEstimateSelected = arrayValue.includes(estimate.value.toString());
    const newSelectedEstimateIds = isEstimateSelected
      ? arrayValue.filter((id) => id !== estimate.value.toString())
      : [...arrayValue, estimate.value.toString()];

    onValueChange?.(newSelectedEstimateIds);
  };

  return (
    <SelectEstimatedPointContext.Provider
      value={{
        estimateChoices: _estimateChoices,
        estimateIds: !value ? [] : Array.isArray(value) ? value : [value],
        onSelect,
        setEstimateChoices,
        loading: false,
        error: null,
      }}
    >
      {children}
    </SelectEstimatedPointContext.Provider>
  );
};

const SelectEstimatedPointValue = ({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) => {
  const { estimateIds, estimateChoices } = useSelectEstimatedPointContext();

  const selectedEstimates = (estimateChoices || []).filter((estimate) =>
    estimateIds.includes(estimate.value.toString()),
  );

  if (selectedEstimates.length === 0) {
    return (
      <span className="text-accent-foreground/80">
        {placeholder || 'Select estimate...'}
      </span>
    );
  }

  return (
    <div className="flex gap-1 ">
      {selectedEstimates.map((estimate) => (
        <div className="flex items-center gap-2" key={estimate.value}>
          <IconHash className="size-4 text-accent-foreground" />
          <p className={cn('font-medium', className)}>{estimate.label}</p>
        </div>
      ))}
    </div>
  );
};

const SelectEstimatedPointCommandItem = ({
  estimate,
}: {
  estimate: IEstimateChoice;
}) => {
  const { onSelect, estimateIds } = useSelectEstimatedPointContext();

  return (
    <Command.Item
      value={estimate.value.toString()}
      onSelect={() => {
        onSelect(estimate);
      }}
    >
      <div className="flex items-center gap-2 flex-1">
        <IconHash className="w-4 h-4" stroke={1.8} />
        <span className="font-medium">{estimate.label}</span>
      </div>
      <Combobox.Check
        checked={estimateIds.includes(estimate.value.toString())}
      />
    </Command.Item>
  );
};

const SelectEstimatedPointContent = () => {
  const { estimateChoices } = useSelectEstimatedPointContext();

  return (
    <Command shouldFilter={false} id="estimate-command-menu">
      <Command.List>
        {(estimateChoices || []).map((estimate) => (
          <SelectEstimatedPointCommandItem
            key={estimate.value}
            estimate={estimate}
          />
        ))}
      </Command.List>
    </Command>
  );
};

export const SelectEstimatedPointInlineCell = ({
  value,
  id,
  onValueChange,
  scope,
  teamId,
  ...props
}: {
  value?: number | string;
  id?: string;
  onValueChange?: (value: string | string[]) => void;
  scope?: string;
  teamId?: string;
} & Omit<
  React.ComponentProps<typeof SelectEstimatedPointProvider>,
  'children' | 'onValueChange' | 'value' | 'estimateChoices'
>) => {
  const { updateTask } = useUpdateTask();
  const [open, setOpen] = useState(false);

  const { estimateChoices } = useGetEstimateChoiceByTeam({
    variables: { teamId },
    skip: !teamId,
  });

  if (estimateChoices?.length === 0) {
    return (
      <div className="text-muted-foreground p-2">Estimate not enabled</div>
    );
  }

  const handleValueChange = (value: string | string[]) => {
    if (id) {
      updateTask({
        variables: {
          _id: id,
          estimatePoint:
            typeof value === 'string'
              ? parseInt(value, 10)
              : parseInt(value[0], 10),
        },
      });
    }
    onValueChange?.(value);
    setOpen(false);
  };

  const stringValue =
    typeof value === 'number' ? value.toString() : value || '';
  const finalScope =
    scope || (id ? `ProjectTableCell.${id}.EstimatedPoint` : undefined);

  return (
    <SelectEstimatedPointProvider
      mode="single"
      value={stringValue}
      onValueChange={handleValueChange}
      estimateChoices={estimateChoices || []}
      {...props}
    >
      <PopoverScoped
        open={open}
        onOpenChange={setOpen}
        scope={finalScope}
        closeOnEnter
      >
        <RecordTableInlineCell.Trigger>
          <SelectEstimatedPointValue placeholder={''} />
        </RecordTableInlineCell.Trigger>
        <RecordTableInlineCell.Content className="max-w-72">
          <SelectEstimatedPointContent />
        </RecordTableInlineCell.Content>
      </PopoverScoped>
    </SelectEstimatedPointProvider>
  );
};

export const SelectEstimatedPointFormItem = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<
    React.ComponentProps<typeof SelectEstimatedPointProvider>,
    'children' | 'onValueChange' | 'value' | 'estimateChoices'
  > & {
    className?: string;
    placeholder?: string;
    value?: number | string;
    onChange?: (value: number) => void;
    teamId?: string;
  }
>(({ onChange, className, placeholder, value, teamId, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const { estimateChoices } = useGetEstimateChoiceByTeam({
    variables: { teamId },
    skip: !teamId,
  });
  const stringValue =
    typeof value === 'number' ? value.toString() : value || '';
  useEffect(() => {
    if (estimateChoices?.length && !value) {
      onChange?.(estimateChoices?.[0]?.value || 0);
    }
  }, [estimateChoices, value, onChange]);

  if (!estimateChoices || !estimateChoices?.length) {
    return null;
  }

  return (
    <SelectEstimatedPointProvider
      value={stringValue}
      onValueChange={(value) => {
        const numValue =
          typeof value === 'string' ? parseInt(value, 10) : Number(value);
        onChange?.(numValue);
        setOpen(false);
      }}
      estimateChoices={estimateChoices || []}
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
              <SelectEstimatedPointValue
                placeholder={placeholder}
                className={value === 0 ? 'text-muted-foreground' : undefined}
              />
            </Button>
          </Combobox.TriggerBase>
        </Form.Control>
        <Combobox.Content>
          <SelectEstimatedPointContent />
        </Combobox.Content>
      </Popover>
    </SelectEstimatedPointProvider>
  );
});

SelectEstimatedPointFormItem.displayName = 'SelectEstimatedPointFormItem';

const SelectEstimatedPointRoot = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectEstimatedPointProvider>, 'children'> &
    React.ComponentProps<typeof Combobox.Trigger> & {
      placeholder?: string;
    }
>(
  (
    {
      onValueChange,
      className,
      mode,
      value,
      placeholder,
      estimateChoices,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    return (
      <SelectEstimatedPointProvider
        onValueChange={(value) => {
          onValueChange?.(value);
          setOpen(false);
        }}
        mode={mode}
        value={value}
        estimateChoices={estimateChoices || []}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Combobox.Trigger
            ref={ref}
            className={cn('w-full inline-flex', className)}
            variant="outline"
            {...props}
          >
            <SelectEstimatedPointValue placeholder={placeholder} />
          </Combobox.Trigger>
          <Combobox.Content>
            <SelectEstimatedPointContent />
          </Combobox.Content>
        </Popover>
      </SelectEstimatedPointProvider>
    );
  },
);

SelectEstimatedPointRoot.displayName = 'SelectEstimatedPointRoot';

export const SelectEstimatedPointDetail = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<
    React.ComponentProps<typeof SelectEstimatedPointProvider>,
    'children' | 'onValueChange' | 'value' | 'estimateChoices'
  > & {
    className?: string;
    placeholder?: string;
    value?: number | string;
    id?: string;
    teamId?: string;
  }
>(({ className, placeholder, value, id, teamId, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const { updateTask } = useUpdateTask();

  const { estimateChoices } = useGetEstimateChoiceByTeam({
    variables: { teamId },
    skip: !teamId,
  });

  if (!estimateChoices || !estimateChoices?.length) {
    return (
      <Button
        variant="secondary"
        className="h-7 text-muted-foreground"
        disabled
      >
        Estimate not enabled
      </Button>
    );
  }

  const stringValue =
    typeof value === 'number' ? value.toString() : value || '';

  const handleValueChange = (value: string | string[]) => {
    if (id) {
      updateTask({
        variables: {
          _id: id,
          estimatePoint:
            typeof value === 'string'
              ? parseInt(value, 10)
              : parseInt(value[0], 10),
        },
      });
    }
    setOpen(false);
  };

  return (
    <SelectEstimatedPointProvider
      value={stringValue}
      onValueChange={handleValueChange}
      estimateChoices={estimateChoices || []}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Combobox.TriggerBase
          ref={ref}
          className={cn('w-min shadow-xs', className)}
          asChild
        >
          <Button variant="secondary" className="h-7">
            <SelectEstimatedPointValue
              placeholder={placeholder}
              className={value === 0 ? 'text-muted-foreground' : undefined}
            />
          </Button>
        </Combobox.TriggerBase>
        <Combobox.Content>
          <SelectEstimatedPointContent />
        </Combobox.Content>
      </Popover>
    </SelectEstimatedPointProvider>
  );
});

SelectEstimatedPointDetail.displayName = 'SelectEstimatedPointDetail';

export const SelectEstimatedPoint = Object.assign(SelectEstimatedPointRoot, {
  Provider: SelectEstimatedPointProvider,
  Value: SelectEstimatedPointValue,
  Content: SelectEstimatedPointContent,
  InlineCell: SelectEstimatedPointInlineCell,
  FormItem: SelectEstimatedPointFormItem,
  Detail: SelectEstimatedPointDetail,
});

import React, { useState } from 'react';
import { IEstimateChoice } from '@/task/types';
import {
  Button,
  cn,
  Combobox,
  Command,
  Form,
  Popover,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
} from 'erxes-ui';
import { IconHash } from '@tabler/icons-react';
import { useUpdateTask } from '@/task/hooks/useUpdateTask';

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
          <IconHash className="w-3 h-3" stroke={2} />
          <p className={cn('font-medium text-base ', className)}>
            {estimate.label}
          </p>
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
  estimateChoices,
  ...props
}: {
  value?: number | string;
  id?: string;
  onValueChange?: (value: string | string[]) => void;
  scope?: string;
  estimateChoices?: IEstimateChoice[];
} & Omit<
  React.ComponentProps<typeof SelectEstimatedPointProvider>,
  'children' | 'onValueChange' | 'value' | 'estimateChoices'
>) => {
  const { updateTask } = useUpdateTask();
  const [open, setOpen] = useState(false);

  if (!estimateChoices) {
    return <div>Team does not enabled estimate</div>;
  }

  const handleValueChange = (value: string | string[]) => {
    if (id) {
      updateTask({
        variables: {
          _id: id,
          estimatedPoint:
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
      <RecordTablePopover
        open={open}
        onOpenChange={setOpen}
        scope={finalScope}
        closeOnEnter
      >
        <RecordTableCellTrigger>
          <SelectEstimatedPointValue placeholder={''} />
        </RecordTableCellTrigger>
        <RecordTableCellContent className="max-w-72">
          <SelectEstimatedPointContent />
        </RecordTableCellContent>
      </RecordTablePopover>
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
    estimateChoices?: IEstimateChoice[];
  }
>(
  (
    { onChange, className, placeholder, value, estimateChoices, ...props },
    ref,
  ) => {
    const [open, setOpen] = useState(false);

    const stringValue =
      typeof value === 'number' ? value.toString() : value || '';

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
              <Button variant="secondary">
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
  },
);

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

export const SelectEstimatedPoint = Object.assign(SelectEstimatedPointRoot, {
  Provider: SelectEstimatedPointProvider,
  Value: SelectEstimatedPointValue,
  Content: SelectEstimatedPointContent,
  InlineCell: SelectEstimatedPointInlineCell,
  FormItem: SelectEstimatedPointFormItem,
});

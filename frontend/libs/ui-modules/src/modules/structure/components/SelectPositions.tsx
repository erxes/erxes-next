import React, { useState } from 'react';
import { IPosition, ISelectPositionsProviderProps } from '../types/Position';
import { SelectPositionsContext } from '../contexts/SelectPositionsContext';
import { useDebounce } from 'use-debounce';
import { useSelectPositionsContext } from '../hooks/useSelectPositionsContext';
import { usePositions } from '../hooks/usePositions';
import {
  Button,
  cn,
  Combobox,
  Command,
  Filter,
  Form,
  Popover,
  PopoverScoped,
  RecordTableCellContent,
  RecordTableCellTrigger,
  RecordTablePopover,
  SelectTree,
  TextOverflowTooltip,
  useFilterContext,
  useQueryState,
} from 'erxes-ui';
import { PositionBadge } from './PositionBadge';
import { IconBriefcase, IconPlus } from '@tabler/icons-react';
import {
  CreatePositionForm,
  SelectPositionCreateContainer,
} from './CreatePositionForm';

export const SelectPositionsProvider = ({
  children,
  value,
  onValueChange,
  mode = 'single',
}: ISelectPositionsProviderProps) => {
  const [newPositionName, setNewPositionName] = useState<string>('');
  const [selectedPositions, setSelectedPositions] = useState<IPosition[]>([]);

  const handleSelectCallback = (position: IPosition) => {
    if (!position) return;

    const isSingleMode = mode === 'single';
    const multipleValue = (value as string[]) || [];
    const isSelected = !isSingleMode && multipleValue.includes(position._id);

    const newSelectedPositionIds = isSingleMode
      ? [position._id]
      : isSelected
      ? multipleValue.filter((p) => p !== position._id)
      : [...multipleValue, position._id];

    const newSelectedPositions = isSingleMode
      ? [position]
      : isSelected
      ? selectedPositions.filter((p) => p._id !== position._id)
      : [...selectedPositions, position];

    setSelectedPositions(newSelectedPositions);
    onValueChange?.(isSingleMode ? position._id : newSelectedPositionIds);
  };

  return (
    <SelectPositionsContext.Provider
      value={{
        onSelect: handleSelectCallback,
        value,
        selectedPositions,
        setSelectedPositions,
        newPositionName,
        setNewPositionName,
        mode,
      }}
    >
      {children}
    </SelectPositionsContext.Provider>
  );
};

export const SelectPositionsCommand = ({
  disableCreateOption,
}: {
  disableCreateOption?: boolean;
}) => {
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { selectedPositions } = useSelectPositionsContext();
  const [noPositionsSearchValue, setNoPositionsSearchValue] =
    useState<string>('');

  const {
    sortedPositions: positions,
    loading,
    error,
    handleFetchMore,
    totalCount,
  } = usePositions({
    variables: {
      searchValue: debouncedSearch,
    },
    skip:
      !!noPositionsSearchValue &&
      debouncedSearch.includes(noPositionsSearchValue),
    onCompleted(data) {
      const { totalCount } = data?.positionsMain || {};
      setNoPositionsSearchValue(totalCount === 0 ? debouncedSearch : '');
    },
  });

  return (
    <Command shouldFilter={false}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder="Search positions"
        focusOnMount
      />
      {selectedPositions?.length > 0 && (
        <>
          <div className="flex flex-wrap justify-start p-2 gap-2">
            <PositionsList />
          </div>
          <Command.Separator />
        </>
      )}

      <Command.List>
        <SelectTree.Provider id={'select-positions'} ordered={!search}>
          <SelectPositionsCreate
            search={search}
            show={!disableCreateOption && !loading && !positions?.length}
          />
          <Combobox.Empty loading={loading} error={error} />
          {positions?.map((position) => (
            <SelectPositionsItem
              key={position._id}
              position={{
                ...position,
                hasChildren: positions.some((p) => p.parentId === position._id),
              }}
            />
          ))}
          <Combobox.FetchMore
            fetchMore={handleFetchMore}
            currentLength={positions?.length || 0}
            totalCount={totalCount}
          />
        </SelectTree.Provider>
      </Command.List>
    </Command>
  );
};

export const SelectPositionsCreate = ({
  search,
  show,
}: {
  search: string;
  show: boolean;
}) => {
  const { setNewPositionName } = useSelectPositionsContext();

  if (!search || !show) return null;

  return (
    <Command.Item
      onSelect={() => setNewPositionName(search)}
      className="font-medium"
    >
      <IconPlus />
      Create new position: "{search}"
    </Command.Item>
  );
};

export const SelectPositionsItem = ({
  position,
}: {
  position: IPosition & { hasChildren: boolean };
}) => {
  const { onSelect, selectedPositions } = useSelectPositionsContext();
  const isSelected = selectedPositions.some((p) => p._id === position._id);
  return (
    <SelectTree.Item
      key={position._id}
      id={position._id}
      name={position.title}
      order={position.order}
      hasChildren={position.hasChildren}
      selected={isSelected}
      onSelect={() => onSelect(position)}
    >
      <TextOverflowTooltip
        value={position.title}
        className="flex-auto w-auto font-medium"
      />
    </SelectTree.Item>
  );
};

export const PositionsList = ({
  placeholder,
  renderAsPlainText,
  ...props
}: Omit<React.ComponentProps<typeof PositionBadge>, 'onClose'> & {
  placeholder?: string;
  renderAsPlainText?: boolean;
}) => {
  const { value, selectedPositions, setSelectedPositions, onSelect } =
    useSelectPositionsContext();

  const selectedPositionIds = Array.isArray(value) ? value : [value];

  if (!value || !value.length) {
    return <Combobox.Value placeholder={placeholder || ''} />;
  }

  return (
    <>
      {selectedPositionIds.map((positionId) => (
        <PositionBadge
          key={positionId}
          positionId={positionId}
          position={selectedPositions.find((p) => p._id === positionId)}
          renderAsPlainText={renderAsPlainText}
          variant={'secondary'}
          onCompleted={(position) => {
            if (!position) return;
            if (selectedPositionIds.includes(position._id)) {
              setSelectedPositions([...selectedPositions, position]);
            }
          }}
          onClose={() =>
            onSelect?.(
              selectedPositions.find((p) => p._id === positionId) as IPosition,
            )
          }
          {...props}
        />
      ))}
    </>
  );
};

export const SelectPositionsValue = () => {
  const { selectedPositions, mode } = useSelectPositionsContext();

  if (selectedPositions?.length > 1)
    return (
      <span className="text-muted-foreground">
        {selectedPositions.length} positions selected
      </span>
    );

  return (
    <PositionsList
      placeholder="Select positions"
      renderAsPlainText={mode === 'single'}
    />
  );
};

export const SelectPositionsContent = () => {
  const { newPositionName } = useSelectPositionsContext();

  if (newPositionName) {
    return (
      <SelectPositionCreateContainer>
        <CreatePositionForm />
      </SelectPositionCreateContainer>
    );
  }
  return <SelectPositionsCommand />;
};

export const SelectPositionsInlineCell = ({
  onValueChange,
  scope,
  ...props
}: Omit<React.ComponentProps<typeof SelectPositionsProvider>, 'children'> & {
  scope?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <SelectPositionsProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <RecordTablePopover open={open} onOpenChange={setOpen} scope={scope}>
        <RecordTableCellTrigger>
          <SelectPositionsValue />
        </RecordTableCellTrigger>
        <RecordTableCellContent className="min-w-72">
          <SelectPositionsContent />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectPositionsProvider>
  );
};

export const SelectPositionsDetail = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectPositionsProvider>, 'children'> &
    Omit<
      React.ComponentPropsWithoutRef<typeof Combobox.Trigger>,
      'children'
    > & {
      scope?: string;
    }
>(({ onValueChange, scope, value, mode, options, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectPositionsProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...{ value, mode, options }}
    >
      <PopoverScoped open={open} onOpenChange={setOpen} scope={scope}>
        <Combobox.Trigger ref={ref} {...props}>
          <SelectPositionsValue />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectPositionsContent />
        </Combobox.Content>
      </PopoverScoped>
    </SelectPositionsProvider>
  );
});

SelectPositionsDetail.displayName = 'SelectPositionsDetail';

export const SelectPositionsCommandbarItem = ({
  onValueChange,
  ...props
}: Omit<React.ComponentProps<typeof SelectPositionsProvider>, 'children'>) => {
  const [open, setOpen] = useState(false);

  return (
    <SelectPositionsProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <RecordTablePopover open={open} onOpenChange={setOpen}>
        <Button variant={'secondary'} asChild>
          <RecordTableCellTrigger>
            <IconBriefcase />
            Position
          </RecordTableCellTrigger>
        </Button>
        <RecordTableCellContent className="w-96">
          <SelectPositionsContent />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectPositionsProvider>
  );
};

export const SelectPositionsFormItem = ({
  onValueChange,
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectPositionsProvider>, 'children'> & {
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectPositionsProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.Trigger className={cn('w-full shadow-xs', className)}>
            <SelectPositionsValue />
          </Combobox.Trigger>
        </Form.Control>

        <Combobox.Content>
          <SelectPositionsContent />
        </Combobox.Content>
      </Popover>
    </SelectPositionsProvider>
  );
};

export const SelectPositionsFilterItem = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {
  return (
    <Filter.Item value={value}>
      <IconBriefcase />
      {label}
    </Filter.Item>
  );
};

export const SelectPositionsFilterView = ({
  mode,
  filterKey,
}: {
  mode: 'single' | 'multiple';
  filterKey: string;
}) => {
  const [query, setQuery] = useQueryState<string[] | string | undefined>(
    filterKey,
  );
  const { resetFilterState } = useFilterContext();

  return (
    <Filter.View filterKey={filterKey}>
      <SelectPositionsProvider
        mode={mode}
        value={query || []}
        onValueChange={(value) => {
          setQuery(value);
          resetFilterState();
        }}
      >
        <SelectPositionsContent />
      </SelectPositionsProvider>
    </Filter.View>
  );
};

export const SelectPositionsFilterBar = ({
  mode = 'multiple',
  filterKey,
  label,
}: {
  mode: 'single' | 'multiple';
  filterKey: string;
  label: string;
}) => {
  const [query, setQuery] = useQueryState<string[]>(filterKey);
  const [open, setOpen] = useState<boolean>(false);

  if (!query) {
    return null;
  }

  return (
    <Filter.BarItem>
      <Filter.BarName>
        <IconBriefcase />
        {label}
      </Filter.BarName>
      <SelectPositionsProvider
        mode={mode}
        value={query || []}
        onValueChange={(value) => {
          if (value && value.length > 0) {
            setQuery(value as string[]);
          } else {
            setQuery(null);
          }
          setOpen(false);
        }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Filter.BarButton filterKey={filterKey}>
              <SelectPositionsValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectPositionsContent />
          </Combobox.Content>
        </Popover>
      </SelectPositionsProvider>
      <Filter.BarClose filterKey={filterKey} />
    </Filter.BarItem>
  );
};

export const SelectPositions = Object.assign(SelectPositionsProvider, {
  Provider: SelectPositionsProvider,
  CommandBarItem: SelectPositionsCommandbarItem,
  Content: SelectPositionsContent,
  Command: SelectPositionsCommand,
  Item: SelectPositionsItem,
  Value: SelectPositionsValue,
  List: PositionsList,
  InlineCell: SelectPositionsInlineCell,
  FormItem: SelectPositionsFormItem,
  FilterItem: SelectPositionsFilterItem,
  FilterView: SelectPositionsFilterView,
  FilterBar: SelectPositionsFilterBar,
  Detail: SelectPositionsDetail,
});

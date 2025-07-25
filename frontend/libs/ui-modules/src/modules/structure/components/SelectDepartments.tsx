import React, { useState } from 'react';
import { SelectDepartmentsContext } from '../contexts/SelectDepartmentsContext';
import { useDebounce } from 'use-debounce';
import { useSelectDepartmentsContext } from '../hooks/useSelectDepartmentsContext';
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
import { IconFolder, IconPlus } from '@tabler/icons-react';
import {
  IDepartment,
  ISelectDepartmentsProviderProps,
} from '../types/Department';
import { useDepartments } from '../hooks/useDepartments';
import { DepartmentBadge } from './DepartmentBadge';
import {
  CreateDepartmentForm,
  SelectDepartmentsCreateContainer,
} from './CreateDepartmentForm';

export const SelectDepartmentsProvider = ({
  children,
  value,
  onValueChange,
  mode = 'single',
}: ISelectDepartmentsProviderProps) => {
  const [newDepartmentName, setNewDepartmentName] = useState<string>('');
  const [selectedDepartments, setSelectedDepartments] = useState<IDepartment[]>(
    [],
  );

  const handleSelectCallback = (department: IDepartment) => {
    if (!department) return;

    const isSingleMode = mode === 'single';
    const multipleValue = (value as string[]) || [];
    const isSelected = !isSingleMode && multipleValue.includes(department._id);

    const newSelectedDepartmentIds = isSingleMode
      ? [department._id]
      : isSelected
      ? multipleValue.filter((d) => d !== department._id)
      : [...multipleValue, department._id];

    const newSelectedDepartments = isSingleMode
      ? [department]
      : isSelected
      ? selectedDepartments.filter((d) => d._id !== department._id)
      : [...selectedDepartments, department];

    setSelectedDepartments(newSelectedDepartments);
    onValueChange?.(isSingleMode ? department._id : newSelectedDepartmentIds);
  };

  return (
    <SelectDepartmentsContext.Provider
      value={{
        onSelect: handleSelectCallback,
        value,
        selectedDepartments,
        setSelectedDepartments,
        newDepartmentName,
        setNewDepartmentName,
        mode,
      }}
    >
      {children}
    </SelectDepartmentsContext.Provider>
  );
};

export const SelectDepartmentsCommand = ({
  disableCreateOption,
}: {
  disableCreateOption?: boolean;
}) => {
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { selectedDepartments } = useSelectDepartmentsContext();
  const [noDepartmentsSearchValue, setNoDepartmentsSearchValue] =
    useState<string>('');

  const {
    sortedDepartments: departments,
    loading,
    error,
    handleFetchMore,
    totalCount,
  } = useDepartments({
    variables: {
      searchValue: debouncedSearch,
    },
    skip:
      !!noDepartmentsSearchValue &&
      debouncedSearch.includes(noDepartmentsSearchValue),
    onCompleted(data) {
      const { totalCount } = data?.departmentsMain || {};
      setNoDepartmentsSearchValue(totalCount === 0 ? debouncedSearch : '');
    },
  });
  return (
    <Command shouldFilter={false}>
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder="Search departments"
        focusOnMount
      />
      {selectedDepartments?.length > 0 && (
        <>
          <div className="flex flex-wrap justify-start p-2 gap-2">
            <DepartmentsList />
          </div>
          <Command.Separator />
        </>
      )}

      <Command.List>
        <SelectTree.Provider id={'select-departments'} ordered={!search}>
          <SelectDepartmentsCreate
            search={search}
            show={!disableCreateOption && !loading && !departments?.length}
          />
          <Combobox.Empty loading={loading} error={error} />
          {departments?.map((department) => (
            <SelectDepartmentsItem
              key={department._id}
              department={{
                ...department,
                hasChildren: departments.some(
                  (b) => b.parentId === department._id,
                ),
              }}
            />
          ))}
          <Combobox.FetchMore
            fetchMore={handleFetchMore}
            currentLength={departments?.length || 0}
            totalCount={totalCount}
          />
        </SelectTree.Provider>
      </Command.List>
    </Command>
  );
};

export const SelectDepartmentsCreate = ({
  search,
  show,
}: {
  search: string;
  show: boolean;
}) => {
  const { setNewDepartmentName } = useSelectDepartmentsContext();

  if (!search || !show) return null;

  return (
    <Command.Item
      onSelect={() => setNewDepartmentName(search)}
      className="font-medium"
    >
      <IconPlus />
      Create new department: "{search}"
    </Command.Item>
  );
};

export const SelectDepartmentsItem = ({
  department,
}: {
  department: IDepartment & { hasChildren: boolean };
}) => {
  const { onSelect, selectedDepartments } = useSelectDepartmentsContext();
  const isSelected = selectedDepartments.some((d) => d._id === department._id);
  return (
    <SelectTree.Item
      key={department._id}
      id={department._id}
      name={department.title}
      order={department.order}
      hasChildren={department.hasChildren}
      selected={isSelected}
      onSelect={() => onSelect(department)}
    >
      <TextOverflowTooltip
        value={department.title}
        className="flex-auto w-auto font-medium"
      />
    </SelectTree.Item>
  );
};

export const DepartmentsList = ({
  placeholder,
  renderAsPlainText,
  ...props
}: Omit<React.ComponentProps<typeof DepartmentBadge>, 'onClose'> & {
  placeholder?: string;
  renderAsPlainText?: boolean;
}) => {
  const { value, selectedDepartments, setSelectedDepartments, onSelect } =
    useSelectDepartmentsContext();

  const selectedDepartmentIds = Array.isArray(value) ? value : [value];

  if (!value || !value.length) {
    return <Combobox.Value placeholder={placeholder || ''} />;
  }

  return (
    <>
      {selectedDepartmentIds.map((departmentId) => (
        <DepartmentBadge
          key={departmentId}
          departmentId={departmentId}
          department={selectedDepartments.find((d) => d._id === departmentId)}
          renderAsPlainText={renderAsPlainText}
          variant={'secondary'}
          onCompleted={(department) => {
            if (!department) return;
            if (selectedDepartmentIds.includes(department._id)) {
              setSelectedDepartments([...selectedDepartments, department]);
            }
          }}
          onClose={() =>
            onSelect?.(
              selectedDepartments.find(
                (d) => d._id === departmentId,
              ) as IDepartment,
            )
          }
          {...props}
        />
      ))}
    </>
  );
};

export const SelectDepartmentsValue = () => {
  const { selectedDepartments, mode } = useSelectDepartmentsContext();

  if (selectedDepartments?.length > 1)
    return (
      <span className="text-muted-foreground">
        {selectedDepartments.length} departments selected
      </span>
    );

  return (
    <DepartmentsList
      placeholder="Select departments"
      renderAsPlainText={mode === 'single'}
    />
  );
};

export const SelectDepartmentsContent = () => {
  const { newDepartmentName } = useSelectDepartmentsContext();

  if (newDepartmentName) {
    return (
      <SelectDepartmentsCreateContainer>
        <CreateDepartmentForm />
      </SelectDepartmentsCreateContainer>
    );
  }
  return <SelectDepartmentsCommand />;
};

export const SelectDepartmentsInlineCell = ({
  onValueChange,
  scope,
  ...props
}: Omit<React.ComponentProps<typeof SelectDepartmentsProvider>, 'children'> & {
  scope?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <SelectDepartmentsProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <RecordTablePopover open={open} onOpenChange={setOpen} scope={scope}>
        <RecordTableCellTrigger>
          <SelectDepartmentsValue />
        </RecordTableCellTrigger>
        <RecordTableCellContent className="min-w-72">
          <SelectDepartmentsContent />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectDepartmentsProvider>
  );
};

export const SelectDepartmentsDetail = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Omit<React.ComponentProps<typeof SelectDepartmentsProvider>, 'children'> &
    Omit<
      React.ComponentPropsWithoutRef<typeof Combobox.Trigger>,
      'children'
    > & {
      scope?: string;
    }
>(({ onValueChange, scope, value, mode, options, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectDepartmentsProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...{ value, mode, options }}
    >
      <PopoverScoped open={open} onOpenChange={setOpen} scope={scope}>
        <Combobox.Trigger ref={ref} {...props}>
          <SelectDepartmentsValue />
        </Combobox.Trigger>
        <Combobox.Content>
          <SelectDepartmentsContent />
        </Combobox.Content>
      </PopoverScoped>
    </SelectDepartmentsProvider>
  );
});

SelectDepartmentsDetail.displayName = 'SelectDepartmentsDetail';

export const SelectDepartmentsCommandbarItem = ({
  onValueChange,
  ...props
}: Omit<
  React.ComponentProps<typeof SelectDepartmentsProvider>,
  'children'
>) => {
  const [open, setOpen] = useState(false);

  return (
    <SelectDepartmentsProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <RecordTablePopover open={open} onOpenChange={setOpen}>
        <Button variant={'secondary'} asChild>
          <RecordTableCellTrigger>
            <IconFolder />
            Department
          </RecordTableCellTrigger>
        </Button>
        <RecordTableCellContent className="w-96">
          <SelectDepartmentsContent />
        </RecordTableCellContent>
      </RecordTablePopover>
    </SelectDepartmentsProvider>
  );
};

export const SelectDepartmentsFormItem = ({
  onValueChange,
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectDepartmentsProvider>, 'children'> & {
  className?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <SelectDepartmentsProvider
      onValueChange={(value) => {
        onValueChange?.(value);
        setOpen(false);
      }}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <Form.Control>
          <Combobox.Trigger className={cn('w-full shadow-xs', className)}>
            <SelectDepartmentsValue />
          </Combobox.Trigger>
        </Form.Control>

        <Combobox.Content>
          <SelectDepartmentsContent />
        </Combobox.Content>
      </Popover>
    </SelectDepartmentsProvider>
  );
};

export const SelectDepartmentsFilterItem = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => {
  return (
    <Filter.Item value={value}>
      <IconFolder />
      {label}
    </Filter.Item>
  );
};

export const SelectDepartmentsFilterView = ({
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
      <SelectDepartmentsProvider
        mode={mode}
        value={query || []}
        onValueChange={(value) => {
          setQuery(value);
          resetFilterState();
        }}
      >
        <SelectDepartmentsContent />
      </SelectDepartmentsProvider>
    </Filter.View>
  );
};

export const SelectDepartmentsFilterBar = ({
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
        <IconFolder />
        {label}
      </Filter.BarName>
      <SelectDepartmentsProvider
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
              <SelectDepartmentsValue />
            </Filter.BarButton>
          </Popover.Trigger>
          <Combobox.Content>
            <SelectDepartmentsContent />
          </Combobox.Content>
        </Popover>
      </SelectDepartmentsProvider>
      <Filter.BarClose filterKey={filterKey} />
    </Filter.BarItem>
  );
};

export const SelectDepartments = Object.assign(SelectDepartmentsProvider, {
  CommandBarItem: SelectDepartmentsCommandbarItem,
  Content: SelectDepartmentsContent,
  Command: SelectDepartmentsCommand,
  Item: SelectDepartmentsItem,
  Value: SelectDepartmentsValue,
  List: DepartmentsList,
  InlineCell: SelectDepartmentsInlineCell,
  FormItem: SelectDepartmentsFormItem,
  FilterItem: SelectDepartmentsFilterItem,
  FilterView: SelectDepartmentsFilterView,
  FilterBar: SelectDepartmentsFilterBar,
  Detail: SelectDepartmentsDetail,
});

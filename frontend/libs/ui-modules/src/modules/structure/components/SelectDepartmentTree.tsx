import React, { useEffect, useRef, useState } from 'react';
import {
  Combobox,
  Command,
  InlineCell,
  InlineCellDisplay,
  InlineCellEdit,
  SelectTree,
  TextOverflowTooltip,
} from 'erxes-ui';
import { Except } from 'type-fest';
import { useDebounce } from 'use-debounce';
import { IDepartment } from '../types/Department';
import { useDepartmentsMain } from '../hooks/useDepartmentsMain';

export const SelectDepartmentTree = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  Except<
    React.ComponentPropsWithoutRef<typeof Combobox.Trigger>,
    'onSelect'
  > & {
    selected?: string;
    onSelect: (departmentId: string | null) => void;
    recordId: string;
    nullable?: boolean;
    exclude?: string[];
  }
>(({ onSelect, selected, recordId, nullable, exclude, ...props }, ref) => {
  const [selectedDepartment, setSelectedDepartment] = useState<
    IDepartment | undefined
  >();
  const { departments, loading } = useDepartmentsMain({
    onCompleted: ({ departments: list }: { departments: IDepartment[] }) => {
      setSelectedDepartment(
        list.find((department) => department._id === selected),
      );
    },
  });
  useEffect(() => {
    if (departments && selected) {
      setSelectedDepartment(
        departments.find((department) => department._id === selected),
      );
    }
  }, [selected, departments]);
  return (
    <SelectTree.Provider id="select-department" ordered>
      <InlineCell
        name="department"
        recordId={recordId}
        display={() => (
          <SelectDepartmentTrigger
            ref={ref}
            {...props}
            selectedDepartment={selectedDepartment}
            loading={loading}
            totalCount={selectedDepartment?.userCount || 0}
          />
        )}
        edit={(closeEditMode) => (
          <InlineCellEdit>
            <SelectDepartmentCommand
              nullable={nullable}
              exclude={exclude}
              selected={selected}
              onSelect={(departmentId) => {
                onSelect(departmentId);
                setSelectedDepartment(
                  departments?.find(
                    (department) => department._id === departmentId,
                  ),
                );
                closeEditMode();
              }}
            />
          </InlineCellEdit>
        )}
      />
    </SelectTree.Provider>
  );
});

export const SelectDepartmentCommand = ({
  selected,
  onSelect,
  focusOnMount,
  nullable,
  exclude,
}: {
  selected?: string;
  onSelect: (departmentId: string | null) => void;
  focusOnMount?: boolean;
  nullable?: boolean;
  exclude?: string[];
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const { departments, loading, error } = useDepartmentsMain({
    variables: {
      searchValue: debouncedSearch ?? undefined,
    },
  });
  const selectedDepartment = departments?.find(
    (department) => department._id === selected,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && focusOnMount) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

  return (
    <Command shouldFilter={false}>
      <Command.Input
        variant="secondary"
        placeholder="Filter by department"
        ref={inputRef}
        value={search}
        onValueChange={(value) => setSearch(value)}
      />
      <Command.Separator />
      <Command.List className="p-1">
        <Combobox.Empty error={error} loading={loading} />
        {nullable && (
          <Command.Item key="null" value="null" onSelect={() => onSelect(null)}>
            No department selected
          </Command.Item>
        )}
        {departments?.map((department: IDepartment) => (
          <SelectDepartmentItem
            key={department._id}
            department={department}
            selected={selectedDepartment?._id === department._id}
            onSelect={() => onSelect(department._id)}
            disabled={exclude?.includes(department._id)}
            hasChildren={
              departments?.find(
                (c: IDepartment) => c.parentId === department._id,
              ) !== undefined
            }
          />
        ))}
      </Command.List>
    </Command>
  );
};

export const SelectDepartmentItem = ({
  department,
  selected,
  onSelect,
  hasChildren,
  disabled,
}: {
  department: IDepartment;
  selected: boolean;
  onSelect: () => void;
  hasChildren: boolean;
  disabled?: boolean;
}) => {
  const { title, code, order, userCount } = department;

  return (
    <SelectTree.Item
      order={order || '/'}
      hasChildren={hasChildren}
      name={title}
      value={code + title}
      onSelect={onSelect}
      selected={false}
      disabled={disabled}
    >
      <SelectDepartmentBadge
        department={department}
        selected={selected}
        totalCount={userCount}
      />
    </SelectTree.Item>
  );
};

const SelectDepartmentBadge = ({
  department,
  selected,
  totalCount,
}: {
  department?: IDepartment;
  totalCount: number;
  selected?: boolean;
}) => {
  if (!department) return null;

  const { title, code } = department;

  const codeTitle = code ? code + '-' + title : title;

  return (
    <>
      <div className="flex items-center gap-2 flex-auto overflow-hidden justify-start">
        <TextOverflowTooltip value={codeTitle} className="flex-auto" />
      </div>
      {!selected ? (
        totalCount > 0 && (
          <div className="text-muted-foreground ml-auto">{totalCount}</div>
        )
      ) : (
        <Combobox.Check checked={selected} />
      )}
    </>
  );
};

const SelectDepartmentTrigger = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & {
    totalCount: number;
    selectedDepartment?: IDepartment;
    loading?: boolean;
  }
>(({ selectedDepartment, loading, totalCount, ...props }, ref) => {
  return (
    <InlineCellDisplay asChild>
      <Combobox.Trigger {...props} ref={ref}>
        {selectedDepartment ? (
          <SelectDepartmentBadge
            department={selectedDepartment}
            totalCount={totalCount}
          />
        ) : (
          <Combobox.Value placeholder="Select a department" />
        )}
      </Combobox.Trigger>
    </InlineCellDisplay>
  );
});

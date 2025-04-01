import {
  cn,
  Combobox,
  Command,
  Popover,
  Skeleton,
  TextOverflowTooltip,
} from 'erxes-ui';
import React, { useState } from 'react';
import { useDepartments } from '../hooks/useDepartments';
import { IDepartment } from '../types/Department';
import { SelectDepartmentContext } from '../contexts/SelectDepartmentContext';
import { useSelectDepartmentContext } from '../hooks/useSelectDepartmentContext';
import { useDepartmentById } from '../hooks/useDepartmentById';

export const SelectDepartment = React.forwardRef<
  React.ElementRef<typeof Combobox.Trigger>,
  React.ComponentPropsWithoutRef<typeof Combobox.Trigger> & {
    value?: string;
    onValueChange: (value: string) => void;
  }
>(({ value, onValueChange, ...props }, ref) => {
  const [_open, _setOpen] = useState(false);
  return (
    <SelectDepartmentProvider>
      <Popover open={_open} onOpenChange={_setOpen}>
        <Combobox.Trigger
          {...props}
          ref={ref}
          className={cn('w-full flex text-left', props.className)}
        >
          <SelectDepartmentValue value={value} />
        </Combobox.Trigger>
        <Combobox.Content>
          <DepartmentList
            renderItem={(department) => (
              <SelectDepartmentItem
                key={department._id}
                department={department}
                onValueChange={(value) => {
                  onValueChange(value);
                  _setOpen(false);
                }}
              />
            )}
          />
        </Combobox.Content>
      </Popover>
    </SelectDepartmentProvider>
  );
});

const SelectDepartmentItem = ({
  department,
  onValueChange,
}: {
  department: IDepartment;
  onValueChange: (value: string) => void;
}) => {
  const { setSelectedDepartment, selectedDepartment } =
    useSelectDepartmentContext();
  return (
    <Command.Item
      value={department.title}
      onSelect={() => {
        setSelectedDepartment(department);
        onValueChange(department._id);
      }}
    >
      <TextOverflowTooltip value={department.title} />
      <Combobox.Check checked={selectedDepartment?._id === department._id} />
    </Command.Item>
  );
};
const SelectDepartmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState<
    IDepartment | undefined
  >(undefined);
  return (
    <SelectDepartmentContext.Provider
      value={{ selectedDepartment, setSelectedDepartment }}
    >
      {children}
    </SelectDepartmentContext.Provider>
  );
};

const SelectDepartmentValue = ({ value }: { value?: string }) => {
  const { selectedDepartment } = useSelectDepartmentContext();

  const { departmentDetail, loading } = useDepartmentById({
    variables: { id: value },
    skip: selectedDepartment || !value,
  });
  if (loading) return <Skeleton className="h-4 w-32 overflow-hidden" />;
  return (
    <Combobox.Value
      placeholder="Select Department"
      value={selectedDepartment?.title || departmentDetail?.title}
    />
  );
};

export const DepartmentList = ({
  renderItem,
}: {
  renderItem: (department: IDepartment) => React.ReactNode;
}) => {
  const { departments, loading } = useDepartments();
  return (
    <Command>
      <Command.Input placeholder="Search department" />
      <Command.List>
        <Combobox.Empty loading={loading} />
        {departments?.map((department: IDepartment) => renderItem(department))}
      </Command.List>
    </Command>
  );
};
